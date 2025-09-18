import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/Prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AdminService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,

  ) {}

  emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  async registerAdmin(email: string, password: string, names: string) {
    try {
      // check if the  email and password are provided
      if (!this.emailRegex.test(email) || !password || !names) {
        throw new BadRequestException('Email and password are required');
      }

      if (password.length < 6) {
        throw new BadRequestException(
          'Password must be at least 6 characters long',
        );
      }

      // check if the admin email already exists

      const existingAdmin = await this.prismaService.admin.findUnique({
        where: { email: email },
      });
      if (existingAdmin) {
        throw new BadRequestException('Admin with this email already exists');
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      // create a new admin
      const createdAdmin = await this.prismaService.admin.create({
        data: {
          email: email,
          password: hashedPassword,
          names: names,
        },
      });

      if (!createdAdmin) {
        throw new InternalServerErrorException('failed to create admin');
      }

      return { message: 'admin registered successfully', admin: createdAdmin };
    } catch (error) {
      console.error('Error registering admin:', error);
      throw new InternalServerErrorException(error.message);
    }
  }

  async adminLogin(email: string, password: string, res: Response) {
    try {
      // check if the email and password are provided
      if (!this.emailRegex.test(email) || !password) {
        throw new BadRequestException('Email and password are required');
      }
      // if the password is less than 6 characters
      if (password.length < 6) {
        throw new BadRequestException(
          'Password must be at least 6 characters long',
        );
      }
      // find the admin by email
      const admin = await this.prismaService.admin.findUnique({
        where: { email: email },
      });

      if (!admin) {
        throw new BadRequestException('unknown credentials');
      }
      // compare the password with the hashed password
      const isPasswordValid = await bcrypt.compare(password, admin.password);
      if (!isPasswordValid) {
        throw new BadRequestException('Invalid credentials');
      }
      // if the password is valid, return the admin

      const token = this.jwtService.sign({ id: admin.id, role: 'admin' });

      res.cookie('adminAccessToken', token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
        sameSite: 'lax', // Adjust based on your needs
      });

      return { message: 'Admin logged in successfully' };
    } catch (error) {
      console.error('Error logging in admin:', error);
      throw new InternalServerErrorException(error.message);
    }
  }

  async logout(res: Response) {
    try {
      res.clearCookie('adminAccessToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      });
      return { message: 'Admin logged out successfully' };
    } catch (error) {
      console.error('Error logging out admin:', error);
      throw new InternalServerErrorException(error.message);
    }
  }

  async getAdminProfile(adminId: string) {
    try {
      const admin = await this.prismaService.admin.findUnique({
        where: { id: adminId },
      });
    
      

      if (!admin) {
        throw new BadRequestException('admin not found');
      }
      return admin;
    } catch (error) {
      console.error('Error fetching admin profile:', error);
      throw new InternalServerErrorException(error.message);
    }
  }

  async editAdminProfile(
    adminId: string,
    updatedData: { email?: string; names?: string; password?: string },
  ) {
    try {
      // validate the input data
      if (!adminId) {
        throw new BadRequestException('Admin ID is required');
      }
      // if the email is provided, check if it is valid
      if (updatedData.email && !this.emailRegex.test(updatedData.email)) {
        throw new BadRequestException('Invalid email format');
      }
      // if the password is provided, check if it is valid
      if (updatedData.password && updatedData.password.length < 6) {
        throw new BadRequestException(
          'Password must be at least 6 characters long',
        );
      }
      //if password was provided, hash it
      let hashedPassword: string | undefined;
      if (updatedData.password) {
        hashedPassword = await bcrypt.hash(updatedData.password, 10);
      }
      // check if the admin exists
      const existingAdmin = await this.prismaService.admin.findUnique({
        where: {
          id: adminId,
        },
      });

      // if the admin does not exist, throw an error
      if (!existingAdmin) {
        throw new BadRequestException('Admin not found');
      }
      // if the existingadmin is not locked, throw an error
      if (existingAdmin.isLocked) {
        throw new BadRequestException('Admin is locked and cannot be edited');
      }
      // update the admin profile
      const updatedAdmin = await this.prismaService.admin.update({
        where: { id: adminId },
        data: {
          email: updatedData.email || undefined,
          names: updatedData.names || undefined,
          password: hashedPassword || undefined,
        },
      });
      return {
        message: 'admin profile updated successfully',
        updatedAdmin
      };
    } catch (error) {
      console.error('Error editing admin profile:', error);
      throw new InternalServerErrorException(error.message);
    }
  }

  async adminLocking (adminId: string){
    try {
      // validate the adminId
      if(!adminId){
        throw new BadRequestException('admin id is required');
      }
      // check if the admin exists
      const admin = await this.prismaService.admin.findUnique({
        where: { id: adminId},
      })
      // if the admin does not exist, throw an error
      if(!admin){
        throw new BadRequestException('admin not found');
      }
      // if the admin is already locked, throw an error
      if(admin.isLocked){
        throw new BadRequestException('admin is already locked');
      }
      const lockedAdmin = await this.prismaService.admin.update({
        where: { id: adminId},
        data: { isLocked: true},
      })
      return{
        message: 'admin locked successfully',
      }
    } catch (error) {
      console.error('Error locking admin:', error);
      throw new InternalServerErrorException(error.message);
    }
  }

  async adminUnlocking (adminId: string , body: {password: string}){
    try {
      // validate the adminId
      if(!adminId){
        throw new BadRequestException('admin id is required');
      }
      // check and validate the password
      if(!body.password || body.password.length < 6){
        throw new BadRequestException('password is required and must be at least 6 characters long');
      }
      // check if the admin exists
      const admin = await this.prismaService.admin.findUnique({
        where: { id: adminId},
      })
      // if the admin does not exist, throw an error
      if(!admin){
        throw new BadRequestException('admin not found');
      }
      // if the admin is not locked, throw an error
      if(!admin.isLocked){
        throw new BadRequestException('admin is not locked');
      }
      // compare the password with the hashed password
      const isPasswordValid = await bcrypt.compare(body.password, admin.password);
      if (!isPasswordValid) {
        throw new BadRequestException('Invalid password');
      }
      // unlock the admin
      const unlockedAdmin = await this.prismaService.admin.update({
        where: { id: adminId},
        data: { isLocked: false},
      })
      return{
        message: 'admin unlocked successfully',
      }
    } catch (error) {
      console.error('Error unlocking admin:', error);
      throw new InternalServerErrorException(error.message);
    }
  }


}
