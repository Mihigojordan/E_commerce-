// src/Modules/admin/admin.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { AdminAuthGuard } from '../../Guards/AdminAuth.guard';
import { CommonModule } from '../../common/common.module';

@Module({
  imports: [
    CommonModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'defaultSecret',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [AdminService, AdminAuthGuard],
  controllers: [AdminController],
  exports: [AdminService, AdminAuthGuard, JwtModule], // <- export JwtModule
})
export class AdminModule {}
