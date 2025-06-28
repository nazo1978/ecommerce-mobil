import { NextRequest, NextResponse } from 'next/server';
import { AuctionService } from '../../../../../backend/business/auction.service';
import { BaseRepository } from '../../../../../backend/repositories/base.repository';
import { Auction, AuctionBid, AuctionWatcher, AutoBidSettings } from '../../../../../backend/entities/auction.entity';
import { Product } from '../../../../../backend/entities/product.entity';
import { placeBidSchema } from '../../../../../backend/validation/auction.validation';
import { formatErrorResponse, formatSuccessResponse, ErrorHandler } from '../../../../../backend/utils/errors';

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

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const bids = await auctionService.getAuctionBids(params.id);
    
    return NextResponse.json(formatSuccessResponse(bids));
  } catch (error) {
    const appError = ErrorHandler.handle(error as Error);
    return NextResponse.json(
      formatErrorResponse(appError),
      { status: appError.statusCode }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    
    // Validate request body
    const validatedData = placeBidSchema.parse(body);
    
    // Get user ID from request (this would typically come from authentication)
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      throw new Error('User ID is required');
    }
    
    // Place bid
    const bid = await auctionService.placeBid(params.id, userId, validatedData);
    
    return NextResponse.json(
      formatSuccessResponse(bid, 'Bid placed successfully'),
      { status: 201 }
    );
  } catch (error) {
    const appError = ErrorHandler.handle(error as Error);
    return NextResponse.json(
      formatErrorResponse(appError),
      { status: appError.statusCode }
    );
  }
}
