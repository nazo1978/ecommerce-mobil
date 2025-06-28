'use server';

import { revalidatePath } from 'next/cache';
import { AuctionService } from '../../backend/business/auction.service';
import { BaseRepository } from '../../backend/repositories/base.repository';
import { Auction, AuctionBid, AuctionWatcher, AutoBidSettings } from '../../backend/entities/auction.entity';
import { Product } from '../../backend/entities/product.entity';
import { createAuctionSchema, placeBidSchema } from '../../backend/validation/auction.validation';
import { ErrorHandler } from '../../backend/utils/errors';

// Repository implementations (simplified for demo)
class AuctionRepository extends BaseRepository<Auction> {
  protected documentType = 'auction';
}

class AuctionBidRepository extends BaseRepository<AuctionBid> {
  protected documentType = 'auctionBid';
}

class AuctionWatcherRepository extends BaseRepository<AuctionWatcher> {
  protected documentType = 'auctionWatcher';
}

class AutoBidRepository extends BaseRepository<AutoBidSettings> {
  protected documentType = 'autoBidSettings';
}

class ProductRepository extends BaseRepository<Product> {
  protected documentType = 'product';
}

// Initialize services
const auctionRepository = new AuctionRepository();
const bidRepository = new AuctionBidRepository();
const watcherRepository = new AuctionWatcherRepository();
const autoBidRepository = new AutoBidRepository();
const productRepository = new ProductRepository();

const auctionService = new AuctionService(
  auctionRepository,
  bidRepository,
  watcherRepository,
  autoBidRepository,
  productRepository
);

export async function createAuction(vendorId: string, formData: FormData) {
  try {
    const data = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      productId: formData.get('productId') as string,
      startingPrice: parseFloat(formData.get('startingPrice') as string),
      bidIncrement: parseFloat(formData.get('bidIncrement') as string),
      reservePrice: formData.get('reservePrice') ? parseFloat(formData.get('reservePrice') as string) : undefined,
      buyNowPrice: formData.get('buyNowPrice') ? parseFloat(formData.get('buyNowPrice') as string) : undefined,
      startAt: new Date(formData.get('startAt') as string),
      endAt: new Date(formData.get('endAt') as string),
      autoExtend: formData.get('autoExtend') === 'true',
      extensionTime: parseInt(formData.get('extensionTime') as string) || 5,
      maxExtensions: parseInt(formData.get('maxExtensions') as string) || 10,
    };

    // Validate data
    const validatedData = createAuctionSchema.parse(data);

    // Create auction
    const auction = await auctionService.createAuction(vendorId, validatedData);

    revalidatePath('/seller/auctions');
    revalidatePath('/auctions');
    return { success: true, data: auction };
  } catch (error) {
    const appError = ErrorHandler.handle(error as Error);
    return { 
      success: false, 
      error: appError.message,
      code: appError.code 
    };
  }
}

export async function placeBid(auctionId: string, userId: string, formData: FormData) {
  try {
    const data = {
      amount: parseFloat(formData.get('amount') as string),
      isAutoBid: formData.get('isAutoBid') === 'true',
      maxAmount: formData.get('maxAmount') ? parseFloat(formData.get('maxAmount') as string) : undefined,
    };

    // Validate data
    const validatedData = placeBidSchema.parse(data);

    // Place bid
    const bid = await auctionService.placeBid(auctionId, userId, validatedData);

    revalidatePath(`/auctions/${auctionId}`);
    revalidatePath('/auctions');
    return { success: true, data: bid };
  } catch (error) {
    const appError = ErrorHandler.handle(error as Error);
    return { 
      success: false, 
      error: appError.message,
      code: appError.code 
    };
  }
}

export async function watchAuction(auctionId: string, userId: string) {
  try {
    await auctionService.watchAuction(auctionId, userId);

    revalidatePath(`/auctions/${auctionId}`);
    revalidatePath('/profile/watched-auctions');
    return { success: true };
  } catch (error) {
    const appError = ErrorHandler.handle(error as Error);
    return { 
      success: false, 
      error: appError.message,
      code: appError.code 
    };
  }
}

export async function unwatchAuction(auctionId: string, userId: string) {
  try {
    await auctionService.unwatchAuction(auctionId, userId);

    revalidatePath(`/auctions/${auctionId}`);
    revalidatePath('/profile/watched-auctions');
    return { success: true };
  } catch (error) {
    const appError = ErrorHandler.handle(error as Error);
    return { 
      success: false, 
      error: appError.message,
      code: appError.code 
    };
  }
}

export async function startAuction(auctionId: string) {
  try {
    const auction = await auctionService.startAuction(auctionId);

    revalidatePath('/seller/auctions');
    revalidatePath(`/auctions/${auctionId}`);
    revalidatePath('/auctions');
    return { success: true, data: auction };
  } catch (error) {
    const appError = ErrorHandler.handle(error as Error);
    return { 
      success: false, 
      error: appError.message,
      code: appError.code 
    };
  }
}

export async function endAuction(auctionId: string) {
  try {
    const auction = await auctionService.endAuction(auctionId);

    revalidatePath('/seller/auctions');
    revalidatePath(`/auctions/${auctionId}`);
    revalidatePath('/auctions');
    return { success: true, data: auction };
  } catch (error) {
    const appError = ErrorHandler.handle(error as Error);
    return { 
      success: false, 
      error: appError.message,
      code: appError.code 
    };
  }
}
