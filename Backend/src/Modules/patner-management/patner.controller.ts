import { Controller, Get, Post, Put, Delete, Body, Param, UseInterceptors, UploadedFile, UploadedFiles } from '@nestjs/common';
import { PatnerService } from './partner.service';
import { PatnerFileFields, patnerUploadConfig } from 'src/common/Utils/file-upload.util';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

@Controller('patners')
export class PatnerController {
  constructor(private readonly patnerService: PatnerService) {}

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor(PatnerFileFields,patnerUploadConfig)
  )
  create(@Body() data: any, @UploadedFiles() files: { logo?: Express.Multer.File[] }) {
    if(files?.logo){
        data.logo = `/uploads/partner-photos/${files.logo[0].filename}`;
    }
    return this.patnerService.create(data);
  }

  @Get()
  findAll() {
    return this.patnerService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.patnerService.findOne(id);
  }

  @Put(':id')
   @UseInterceptors(
    FileFieldsInterceptor(PatnerFileFields,patnerUploadConfig)
  )
  update(@Param('id') id: string, @Body() data: any,@UploadedFiles() files: { logo?: Express.Multer.File[] }) {
    if(files?.logo){
        data.logo = `/uploads/partner-photos/${files.logo[0].filename}`;
    }
    return this.patnerService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.patnerService.remove(id);
  }
}
