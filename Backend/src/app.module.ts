// app.module.ts
import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { ConfigModule } from '@nestjs/config';
import { AdminModule } from './Modules/admin/admin.module';
import { CategoryModule } from './Modules/Category-management/category.module';
import { ProductModule } from './Modules/Product-management/product.module';
import { PartnerModule } from './Modules/partner-management/partner.module';
import { TestimonialModule } from './Modules/testmonial-management/testmonial.module';
import { BlogModule } from './Modules/Blog-management/blog.module';
import { ContactModule } from './Modules/Contact-us/contact.module';

import { SubscribersModule } from './Modules/subscribers/subscribers.module';
@Module({
  imports: [

    ConfigModule.forRoot({
      isGlobal: true, // so you don't have to import ConfigModule in every module
    }),
    CommonModule,
    AdminModule,
    CategoryModule,
    ProductModule,
    PartnerModule,
    TestimonialModule,
    BlogModule,
    ContactModule,
    SubscribersModule
    
  ],
  controllers: [],
})
export class AppModule {}
