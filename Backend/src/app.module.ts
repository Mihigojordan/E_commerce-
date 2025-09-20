// app.module.ts
import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { ConfigModule } from '@nestjs/config';
import { AdminModule } from './Modules/admin/admin.module';
import { CategoryModule } from './Modules/Category-management/category.module';
import { ProductModule } from './Modules/Product-management/product.module';
@Module({
  imports: [

    ConfigModule.forRoot({
      isGlobal: true, // so you don't have to import ConfigModule in every module
    }),
    CommonModule,
    AdminModule,
    CategoryModule,
    ProductModule
  ],
  controllers: [],
})
export class AppModule {}
