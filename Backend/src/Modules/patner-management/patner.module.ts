import { Module } from '@nestjs/common';
import { PatnerService } from './partner.service';
import { PatnerController } from './patner.controller';

@Module({
  controllers: [PatnerController],
  providers: [PatnerService],
})
export class PatnerModule {}
