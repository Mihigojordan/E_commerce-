import { Injectable, BadRequestException, NotFoundException, UseInterceptors } from '@nestjs/common';
import { PrismaService } from 'src/Prisma/prisma.service';


@Injectable()
export class PatnerService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    try {
      return await this.prisma.patner.create({ data });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findAll() {
    try {
      return await this.prisma.patner.findMany({
        orderBy: { createdAt: 'desc' },
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findOne(id: string) {
    try {
      const patner = await this.prisma.patner.findUnique({ where: { id } });
      if (!patner) throw new NotFoundException('Patner not found');
      return patner;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async update(id: string, data: any) {
    try {
      return await this.prisma.patner.update({
        where: { id },
        data,
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.patner.delete({ where: { id } });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
