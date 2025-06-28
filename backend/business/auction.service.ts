import { BaseService } from './base.service';
import { Auction, AuctionBid, AuctionWatcher, AutoBidSettings } from '../entities/auction.entity';
import { Product } from '../entities/product.entity';
import { IRepository } from '../core/interfaces';
import { CreateAuctionDTO, PlaceBidDTO, AuctionFilterDTO } from '../validation/auction.validation';
import { PaginatedResponse, AuctionStatus } from '../core/types/common';

export class AuctionService extends BaseService<Auction> {
  constructor(
    auctionRepository: IRepository<Auction>,
    private bidRepository: IRepository<AuctionBid>,
    private watcherRepository: IRepository<AuctionWatcher>,
    private autoBidRepository: IRepository<AutoBidSettings>,
    private productRepository: IRepository<Product>
  ) {
    super(auctionRepository);
  }

  async createAuction(vendorId: string, data: CreateAuctionDTO): Promise<Auction> {
    // Verify product exists and belongs to vendor
    const product = await this.productRepository.findById(data.productId);
    if (!product) {
      throw new Error('Product not found');
    }

    if (product.vendorId !== vendorId) {
      throw new Error('Product does not belong to this vendor');
    }

    // Validate auction timing
    const startAt = new Date(data.startAt);
    const endAt = new Date(data.endAt);
    
    if (startAt <= new Date()) {
      throw new Error('Auction start time must be in the future');
    }

    if (endAt <= startAt) {
      throw new Error('Auction end time must be after start time');
    }

    const auctionData = {
      ...data,
      vendorId,
      status: 'upcoming' as AuctionStatus,
      currentPrice: data.startingPrice,
      bidCount: 0,
      currentExtensions: 0,
      viewCount: 0,
      watcherCount: 0,
      isPaid: false,
      startAt,
      endAt,
    };

    return this.create(auctionData);
  }

  async placeBid(auctionId: string, userId: string, bidData: PlaceBidDTO): Promise<AuctionBid> {
    const auction = await this.getById(auctionId);
    if (!auction) {
      throw new Error('Auction not found');
    }

    // Validate auction status and timing
    await this.validateBidding(auction, userId, bidData.amount);

    // Handle auto-bidding logic
    if (bidData.isAutoBid && bidData.maxAmount) {
      await this.setupAutoBid(auctionId, userId, bidData.maxAmount);
    }

    // Create the bid
    const bid = await this.bidRepository.create({
      auctionId,
      userId,
      amount: bidData.amount,
      isWinning: true, // Will be updated after processing
      isAutoBid: bidData.isAutoBid || false,
      maxAmount: bidData.maxAmount,
    });

    // Update auction state
    await this.updateAuctionAfterBid(auction, bid);

    // Process auto-bids from other users
    await this.processAutoBids(auction, bid);

    return bid;
  }

  async watchAuction(auctionId: string, userId: string): Promise<void> {
    const existing = await this.watcherRepository.findBy({ auctionId, userId });
    if (existing.length > 0) {
      return; // Already watching
    }

    await this.watcherRepository.create({ auctionId, userId });
    
    // Update watcher count
    const auction = await this.getById(auctionId);
    if (auction) {
      await this.update(auctionId, { watcherCount: auction.watcherCount + 1 });
    }
  }

  async unwatchAuction(auctionId: string, userId: string): Promise<void> {
    const watchers = await this.watcherRepository.findBy({ auctionId, userId });
    
    for (const watcher of watchers) {
      await this.watcherRepository.delete(watcher.id);
    }

    // Update watcher count
    const auction = await this.getById(auctionId);
    if (auction) {
      await this.update(auctionId, { watcherCount: Math.max(0, auction.watcherCount - 1) });
    }
  }

  async getAuctionBids(auctionId: string): Promise<AuctionBid[]> {
    return this.bidRepository.findBy({ auctionId });
  }

  async getUserBids(userId: string): Promise<AuctionBid[]> {
    return this.bidRepository.findBy({ userId });
  }

  async getWatchedAuctions(userId: string): Promise<Auction[]> {
    const watchers = await this.watcherRepository.findBy({ userId });
    const auctionIds = watchers.map(w => w.auctionId);
    
    if (auctionIds.length === 0) {
      return [];
    }

    // This would typically be a more efficient query
    const auctions = [];
    for (const id of auctionIds) {
      const auction = await this.getById(id);
      if (auction) {
        auctions.push(auction);
      }
    }
    
    return auctions;
  }

  async startAuction(auctionId: string): Promise<Auction> {
    const auction = await this.getById(auctionId);
    if (!auction) {
      throw new Error('Auction not found');
    }

    if (auction.status !== 'upcoming') {
      throw new Error('Auction cannot be started');
    }

    return this.update(auctionId, { status: 'live' });
  }

  async endAuction(auctionId: string): Promise<Auction> {
    const auction = await this.getById(auctionId);
    if (!auction) {
      throw new Error('Auction not found');
    }

    if (auction.status !== 'live') {
      throw new Error('Auction is not live');
    }

    // Determine winner
    const winningBid = await this.getWinningBid(auctionId);
    
    const updateData: Partial<Auction> = {
      status: 'ended' as AuctionStatus,
      completedAt: new Date(),
    };

    if (winningBid) {
      updateData.winningBidId = winningBid.id;
      updateData.winnerId = winningBid.userId;
      updateData.paymentDueAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    }

    return this.update(auctionId, updateData);
  }

  private async validateBidding(auction: Auction, userId: string, amount: number): Promise<void> {
    if (auction.status !== 'live') {
      throw new Error('Auction is not live');
    }

    if (new Date() > auction.endAt) {
      throw new Error('Auction has ended');
    }

    if (auction.vendorId === userId) {
      throw new Error('Vendor cannot bid on their own auction');
    }

    const minimumBid = auction.currentPrice + auction.bidIncrement;
    if (amount < minimumBid) {
      throw new Error(`Minimum bid is ${minimumBid}`);
    }

    // Check if user is the current highest bidder
    if (auction.winnerId === userId) {
      throw new Error('You are already the highest bidder');
    }
  }

  private async updateAuctionAfterBid(auction: Auction, bid: AuctionBid): Promise<void> {
    // Mark previous winning bids as not winning
    const previousBids = await this.bidRepository.findBy({ auctionId: auction.id, isWinning: true });
    for (const prevBid of previousBids) {
      if (prevBid.id !== bid.id) {
        await this.bidRepository.update(prevBid.id, { isWinning: false });
      }
    }

    // Update auction
    const updateData: Partial<Auction> = {
      currentPrice: bid.amount,
      bidCount: auction.bidCount + 1,
      winningBidId: bid.id,
      winnerId: bid.userId,
    };

    // Handle auto-extension
    if (auction.autoExtend && auction.currentExtensions < auction.maxExtensions) {
      const timeLeft = auction.endAt.getTime() - new Date().getTime();
      const extensionThreshold = auction.extensionTime * 60 * 1000; // Convert to milliseconds

      if (timeLeft < extensionThreshold) {
        updateData.endAt = new Date(auction.endAt.getTime() + extensionThreshold);
        updateData.currentExtensions = auction.currentExtensions + 1;
      }
    }

    await this.update(auction.id, updateData);
  }

  private async processAutoBids(auction: Auction, newBid: AuctionBid): Promise<void> {
    // Get all active auto-bid settings for this auction
    const autoBids = await this.autoBidRepository.findBy({ 
      auctionId: auction.id, 
      isActive: true 
    });

    // Process auto-bids in order of max amount (highest first)
    const sortedAutoBids = autoBids
      .filter(ab => ab.userId !== newBid.userId && ab.maxAmount > newBid.amount)
      .sort((a, b) => b.maxAmount - a.maxAmount);

    for (const autoBid of sortedAutoBids) {
      const nextBidAmount = Math.min(
        newBid.amount + auction.bidIncrement,
        autoBid.maxAmount
      );

      if (nextBidAmount > newBid.amount) {
        await this.placeBid(auction.id, autoBid.userId, {
          amount: nextBidAmount,
          isAutoBid: true,
          maxAmount: autoBid.maxAmount,
        });
        break; // Only one auto-bid per round
      }
    }
  }

  private async setupAutoBid(auctionId: string, userId: string, maxAmount: number): Promise<void> {
    // Deactivate existing auto-bid settings
    const existing = await this.autoBidRepository.findBy({ auctionId, userId });
    for (const autoBid of existing) {
      await this.autoBidRepository.update(autoBid.id, { isActive: false });
    }

    // Create new auto-bid setting
    await this.autoBidRepository.create({
      auctionId,
      userId,
      maxAmount,
      isActive: true,
    });
  }

  private async getWinningBid(auctionId: string): Promise<AuctionBid | null> {
    const bids = await this.bidRepository.findBy({ auctionId, isWinning: true });
    return bids[0] || null;
  }

  protected async afterCreate(auction: Auction): Promise<void> {
    console.log(`Auction created: ${auction.title}`);
    // Schedule auction start/end jobs
  }
}
