// app.module.ts
import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { ConfigModule } from '@nestjs/config';
import { AdminModule } from './Modules/admin/admin.module';
@Module({
  imports: [

    ConfigModule.forRoot({
      isGlobal: true, // so you don't have to import ConfigModule in every module
    }),
    CommonModule,
    AdminModule,
  ],
  controllers: [],
})
export class AppModule {}
