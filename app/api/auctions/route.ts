import { NextRequest, NextResponse } from 'next/server';
import { AuctionService } from '../../../backend/business/auction.service';
import { BaseRepository } from '../../../backend/repositories/base.repository';
import { Auction, AuctionBid, AuctionWatcher, AutoBidSettings } from '../../../backend/entities/auction.entity';
import { Product } from '../../../backend/entities/product.entity';
import { createAuctionSchema } from '../../../backend/validation/auction.validation';
import { formatErrorResponse, formatSuccessResponse, ErrorHandler } from '../../../backend/utils/errors';
import { PAGINATION } from '../../../backend/utils/constants';

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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || PAGINATION.DEFAULT_LIMIT.toString());
    const status = searchParams.get('status');
    const vendorId = searchParams.get('vendorId');

    // Build filters
    const filters: Record<string, any> = {};
    if (status) filters.status = status;
    if (vendorId) filters.vendorId = vendorId;

    const options = {
      limit,
      offset: (page - 1) * limit,
      orderBy: '_createdAt',
      orderDirection: 'desc' as const,
    };

    let auctions;
    if (Object.keys(filters).length > 0) {
      auctions = await auctionRepository.findBy(filters);
    } else {
      auctions = await auctionRepository.findAll(options);
    }

    const total = await auctionRepository.count(filters);

    const response = {
      auctions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    };

    return NextResponse.json(formatSuccessResponse(response));
  } catch (error) {
    const appError = ErrorHandler.handle(error as Error);
    return NextResponse.json(
      formatErrorResponse(appError),
      { status: appError.statusCode }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body
    const validatedData = createAuctionSchema.parse(body);
    
    // Get vendor ID from request (this would typically come from authentication)
    const vendorId = request.headers.get('x-vendor-id');
    if (!vendorId) {
      throw new Error('Vendor ID is required');
    }
    
    // Create auction
    const auction = await auctionService.createAuction(vendorId, validatedData);
    
    return NextResponse.json(
      formatSuccessResponse(auction, 'Auction created successfully'),
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
