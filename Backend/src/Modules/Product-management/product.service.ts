// src/product/product.service.ts

import { 
  Injectable, 
  NotFoundException, 
  BadRequestException,
  InternalServerErrorException 
} from '@nestjs/common';
import { PrismaService } from '../../Prisma/prisma.service';
import { Prisma } from 'generated/prisma';

// src/product/product.service.ts
interface CreateProductData {
  name: string;
  images?: string[];
  brand: string;
  size: string;
  quantity: number;
  price: number;
  perUnit: string;
  description: string;
  subDescription?: string; // string | undefined
  review?: number;
  availability?: boolean;
  tags?: string[];
  categoryId: number; // Changed from string to number
}

interface UpdateProductData {
  name?: string;
  images?: string[];   // You can still accept string[] from API
  brand?: string;
  size?: string;
  quantity?: number;
  price?: number;
  perUnit?: string;
  description?: string;
  subDescription?: string;
  review?: number;
  availability?: boolean;
  tags?: string[];     // Same here, accept array
  categoryId?: number; // ✅ must be number now
}


interface ProductFilters {
  category?: string;
  brand?: string;
  availability?: boolean;
  minPrice?: number;
  maxPrice?: number;
  tags?: string[];
  search?: string;
  size?: string;
}

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create a new product
   */
async createProduct(productData: CreateProductData) {
  console.log('Received productData:', JSON.stringify(productData, null, 2));
  try {
    // Convert categoryId to number if it's a string
    const categoryId =
      typeof productData.categoryId === 'string'
        ? parseInt(productData.categoryId, 10)
        : productData.categoryId;

    console.log('Converted categoryId:', categoryId);

    // Validate category exists
    const categoryExists = await this.prisma.category.findUnique({
      where: { id: categoryId },
    });

    console.log('Category exists:', categoryExists);

    if (!categoryExists) {
      throw new BadRequestException('Category not found');
    }

    const product = await this.prisma.product.create({
      data: {
        name: productData.name,
        images: productData.images || [], // Ensure images is an array of URLs
        brand: productData.brand,
        size: productData.size,
        quantity: productData.quantity,
        price: productData.price,
        perUnit: productData.perUnit,
        description: productData.description,
        subDescription: productData.subDescription || null,
        review: productData.review || 0,
        availability:
          productData.availability !== undefined
            ? productData.availability
            : true,
        tags: productData.tags || [],
        categoryId: categoryId,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return {
      success: true,
      message: 'Product created successfully',
      data: product,
    };
  } catch (error) {
    console.error('Error in createProduct:', error);
    if (error instanceof BadRequestException) {
      throw error;
    }
    throw new InternalServerErrorException(
      `Failed to create product: ${error.message}`,
    );
  }
}

/**
 * Get all products with pagination and filters
 */
async getAllProducts(
  page = 1,
  limit = 10,
  filters: Partial<ProductFilters> = {}
) {
  try {
    const skip = (page - 1) * limit;
    const where: Prisma.ProductWhereInput = {};

    // Category filter
    if (filters.category) {
      where.categoryId = parseInt(filters.category, 10);
    }

    // Availability filter
    if (filters.availability !== undefined) {
      where.availability = filters.availability;
    }

    // Price range filter
    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      where.price = {};
      if (filters.minPrice !== undefined) {
        where.price.gte = filters.minPrice;
      }
      if (filters.maxPrice !== undefined) {
        where.price.lte = filters.maxPrice;
      }
    }

    // Tags filter (for JSON field)
    if (filters.tags && filters.tags.length > 0) {
      // Will match if product has AT LEAST ONE of the tags
      where.OR = filters.tags.map(tag => ({
        tags: { array_contains: tag },
      }));
    }

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        include: {
          category: { select: { id: true, name: true } },
        },
        orderBy: { createdAt: "desc" },
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      success: true,
      data: products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    };
  } catch (error) {
    throw new InternalServerErrorException(
      `Failed to fetch products: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}


  /**
   * Get single product by ID
   */
  async getProductById(id: string) {
    try {
      const product = await this.prisma.product.findUnique({
        where: { id },
        include: {
          category: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      if (!product) {
        throw new NotFoundException('Product not found');
      }

      return {
        success: true,
        data: product,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(`Failed to fetch product: ${error.message}`);
    }
  }

  /**
   * Update product
   */
  async updateProduct(id: string, updateData: UpdateProductData) {
  try {
    // Check if product exists
    const existingProduct = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      throw new NotFoundException('Product not found');
    }

    // Validate category if provided
    if (updateData.categoryId) {
      const categoryExists = await this.prisma.category.findUnique({
        where: { id: updateData.categoryId }, // ✅ now number
      });

      if (!categoryExists) {
        throw new BadRequestException('Category not found');
      }
    }

    // Validate images array (max 4 images)
    if (updateData.images && updateData.images.length > 4) {
      throw new BadRequestException('Maximum 4 images allowed');
    }

    // Validate price
    if (updateData.price !== undefined && updateData.price < 0) {
      throw new BadRequestException('Price cannot be negative');
    }

    // Validate quantity
    if (updateData.quantity !== undefined && updateData.quantity < 0) {
      throw new BadRequestException('Quantity cannot be negative');
    }

    // Validate review rating
    if (updateData.review !== undefined && (updateData.review < 0 || updateData.review > 5)) {
      throw new BadRequestException('Review rating must be between 0 and 5');
    }

 const updatedProduct = await this.prisma.product.update({
  where: { id },
  data: {
    ...updateData,
    images: updateData.images !== undefined 
      ? (updateData.images as unknown as Prisma.InputJsonValue) 
      : undefined,
    tags: updateData.tags !== undefined 
      ? (updateData.tags as unknown as Prisma.InputJsonValue) 
      : undefined,
  },
  include: {
    category: { select: { id: true, name: true } },
  },
});


    return {
      success: true,
      message: 'Product updated successfully',
      data: updatedProduct,
    };
  } catch (error) {
    if (error instanceof NotFoundException || error instanceof BadRequestException) {
      throw error;
    }
    throw new InternalServerErrorException(`Failed to update product: ${error.message}`);
  }
}

  /**
   * Delete product
   */
  async deleteProduct(id: string) {
    try {
      const existingProduct = await this.prisma.product.findUnique({
        where: { id },
      });

      if (!existingProduct) {
        throw new NotFoundException('Product not found');
      }

      await this.prisma.product.delete({
        where: { id },
      });

      return {
        success: true,
        message: 'Product deleted successfully',
        data: { deletedId: id },
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(`Failed to delete product: ${error.message}`);
    }
  }

  /**
   * Bulk update availability
   */
  async bulkUpdateAvailability(productIds: string[], availability: boolean) {
    try {
      if (!productIds || productIds.length === 0) {
        throw new BadRequestException('Product IDs array cannot be empty');
      }

      const updatedProducts = await this.prisma.product.updateMany({
        where: {
          id: { in: productIds },
        },
        data: {
          availability,
        },
      });

      return {
        success: true,
        message: `Updated availability for ${updatedProducts.count} products`,
        data: { 
          updatedCount: updatedProducts.count,
          availability 
        },
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(`Failed to bulk update: ${error.message}`);
    }
  }

  /**
   * Get products by category
   */
  

  /**
   * Update product quantity (for inventory management)
   */
  async updateProductQuantity(id: string, quantity: number) {
    try {
      if (quantity < 0) {
        throw new BadRequestException('Quantity cannot be negative');
      }

      const updatedProduct = await this.prisma.product.update({
        where: { id },
        data: { quantity },
        select: {
          id: true,
          name: true,
          quantity: true,
          availability: true,
        },
      });

      // Auto-update availability based on quantity
      if (quantity === 0 && updatedProduct.availability) {
        await this.prisma.product.update({
          where: { id },
          data: { availability: false },
        });
      }

      return {
        success: true,
        message: 'Product quantity updated successfully',
        data: updatedProduct,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(`Failed to update quantity: ${error.message}`);
    }
  }

  /**
   * Get low stock products
   */
  async getLowStockProducts(threshold = 5) {
    try {
      const products = await this.prisma.product.findMany({
        where: {
          quantity: {
            lte: threshold,
          },
          availability: true,
        },
        include: {
          category: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          quantity: 'asc',
        },
      });

      return {
        success: true,
        data: products,
        count: products.length,
      };
    } catch (error) {
      throw new InternalServerErrorException(`Failed to fetch low stock products: ${error.message}`);
    }
  }
}