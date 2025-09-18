import { Controller, Get, Post, Patch, Delete, Param, Body } from '@nestjs/common';
import { CategoryService } from './category.service';

/**
 * CategoryController
 * 
 * Handles API endpoints for Category CRUD operations.
 * Base route: /categories
 */
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  /**
   * Create a new category
   * POST /categories
   * Body: { name: string, subCategory?: string, status?: string }
   */
  @Post()
  create(@Body() body: { name: string; subCategory?: string; status?: string }) {
    return this.categoryService.create(body);
  }

  /**
   * Get all categories
   * GET /categories
   */
  @Get()
  findAll() {
    return this.categoryService.findAll();
  }

  /**
   * Get a single category by ID
   * GET /categories/:id
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(Number(id));
  }

  /**
   * Update a category
   * PATCH /categories/:id
   * Body: { name?: string, subCategory?: string, status?: string }
   */
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() body: { name?: string; subCategory?: string; status?: string },
  ) {
    return this.categoryService.update(Number(id), body);
  }

  /**
   * Delete a category
   * DELETE /categories/:id
   */
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoryService.remove(Number(id));
  }
}
