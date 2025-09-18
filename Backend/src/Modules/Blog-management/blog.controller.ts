import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { BlogService } from './blog.service';

@Controller('blogs')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post()
  create(@Body() data: { title: string; description: string; quote?: string; image?: string }) {
    return this.blogService.create(data);
  }

  @Get()
  findAll() {
    return this.blogService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.blogService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: { title?: string; description?: string; quote?: string; image?: string }) {
    return this.blogService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.blogService.remove(id);
  }

  @Post(':id/replies')
  addReply(@Param('id') blogId: string, @Body() data: { fullName: string; email: string; message: string }) {
    return this.blogService.addReply(blogId, data);
  }

  @Get(':id/replies')
  getReplies(@Param('id') blogId: string) {
    return this.blogService.getReplies(blogId);
  }
}
