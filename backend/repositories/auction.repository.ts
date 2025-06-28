import { BaseRepository } from './base.repository';
import { Auction } from '../entities/auction.entity';

export class AuctionRepository extends BaseRepository<Auction> {
  protected documentType = 'auction';

  async findActive(limit: number = 10): Promise<Auction[]> {
    try {
      const now = new Date().toISOString();
      const query = `*[_type == "auction" && status == "active" && endTime > $now] | order(endTime asc)[0...${limit}]`;
      const results = await this.executeQuery(query, { now });
      return results.map((doc: any) => this.mapSanityDoc(doc));
    } catch (error) {
      console.error('Error finding active auctions:', error);
      return [];
    }
  }

  async findByStatus(status: string, limit: number = 50): Promise<Auction[]> {
    try {
      const query = `*[_type == "auction" && status == $status] | order(_createdAt desc)[0...${limit}]`;
      const results = await this.executeQuery(query, { status });
      return results.map((doc: any) => this.mapSanityDoc(doc));
    } catch (error) {
      console.error('Error finding auctions by status:', error);
      return [];
    }
  }

  async findEndingSoon(hours: number = 24, limit: number = 10): Promise<Auction[]> {
    try {
      const now = new Date();
      const endTime = new Date(now.getTime() + (hours * 60 * 60 * 1000));
      
      const query = `*[_type == "auction" && status == "active" && endTime > $now && endTime <= $endTime] | order(endTime asc)[0...${limit}]`;
      const results = await this.executeQuery(query, { 
        now: now.toISOString(), 
        endTime: endTime.toISOString() 
      });
      return results.map((doc: any) => this.mapSanityDoc(doc));
    } catch (error) {
      console.error('Error finding auctions ending soon:', error);
      return [];
    }
  }

  async findByCategory(categoryId: string, limit: number = 20): Promise<Auction[]> {
    try {
      const query = `*[_type == "auction" && categoryId == $categoryId && status == "active"] | order(_createdAt desc)[0...${limit}]`;
      const results = await this.executeQuery(query, { categoryId });
      return results.map((doc: any) => this.mapSanityDoc(doc));
    } catch (error) {
      console.error('Error finding auctions by category:', error);
      return [];
    }
  }

  async findByVendor(vendorId: string, limit: number = 20): Promise<Auction[]> {
    try {
      const query = `*[_type == "auction" && vendorId == $vendorId] | order(_createdAt desc)[0...${limit}]`;
      const results = await this.executeQuery(query, { vendorId });
      return results.map((doc: any) => this.mapSanityDoc(doc));
    } catch (error) {
      console.error('Error finding auctions by vendor:', error);
      return [];
    }
  }

  async updateBid(auctionId: string, bidAmount: number, bidderId: string): Promise<Auction> {
    try {
      const auction = await this.findById(auctionId);
      if (!auction) {
        throw new Error('Auction not found');
      }

      if (auction.status !== 'active') {
        throw new Error('Auction is not active');
      }

      if (new Date() > new Date(auction.endTime)) {
        throw new Error('Auction has ended');
      }

      if (bidAmount <= auction.currentBid) {
        throw new Error('Bid amount must be higher than current bid');
      }

      const updatedAuction = await this.update(auctionId, {
        currentBid: bidAmount,
        bidCount: auction.bidCount + 1,
        lastBidderId: bidderId,
        lastBidTime: new Date().toISOString(),
      } as Partial<Auction>);

      return updatedAuction;
    } catch (error) {
      console.error('Error updating bid:', error);
      throw error;
    }
  }

  async endAuction(auctionId: string): Promise<Auction> {
    try {
      return await this.update(auctionId, {
        status: 'ended',
        endedAt: new Date().toISOString(),
      } as Partial<Auction>);
    } catch (error) {
      console.error('Error ending auction:', error);
      throw error;
    }
  }

  async getAuctionStats(auctionId: string): Promise<{
    totalBids: number;
    uniqueBidders: number;
    averageBid: number;
    highestBid: number;
  }> {
    try {
      // This would require a more complex query or separate bid tracking
      // For now, return basic stats from the auction document
      const auction = await this.findById(auctionId);
      if (!auction) {
        throw new Error('Auction not found');
      }

      return {
        totalBids: auction.bidCount,
        uniqueBidders: 1, // Would need separate bid tracking
        averageBid: auction.currentBid / Math.max(auction.bidCount, 1),
        highestBid: auction.currentBid,
      };
    } catch (error) {
      console.error('Error getting auction stats:', error);
      throw error;
    }
  }
}
