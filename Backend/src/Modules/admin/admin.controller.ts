import { Body, Controller, Get, InternalServerErrorException, Post, Put, Req, Res, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { Request, Response } from 'express';
import { AdminAuthGuard } from 'src/Guards/AdminAuth.guard';
import { RequestWithAdmin } from 'src/common/interfaces/request-admin.interface';

@Controller('admin')
export class AdminController {
    // This controller will handle admin-related routes
    // You can add methods here to handle specific admin actions
    // For example, you might have methods for registering an admin, logging in, etc.

    constructor( private readonly adminServices: AdminService ){}

    @Post('register')
    async adminRegister(@Body() req){
        const { email , password, names} = req
        try {
            return await this.adminServices.registerAdmin(email, password, names);
        } catch (error) {
            console.error('Error registering admin:', error);
            throw new InternalServerErrorException({ error: error.error ,message: error.message})
        }
    }

    @Post('login')
    async adminLogin(@Body() req , @Res({ passthrough: true }) res: Response){
        const { email , password } = req
        try {
            return await this.adminServices.adminLogin(email, password, res);
        } catch (error) {
            console.error('Error logging in admin:', error);
            throw new InternalServerErrorException({ error: error.error ,message: error.message})
        }
    }

    @Post('logout')
    async adminLogout(@Res({passthrough: true}) res: Response ){
        try {
            return await this.adminServices.logout(res);
        } catch (error) {
            console.error('Error logging out admin:', error);
            throw new InternalServerErrorException({ error: error.error ,message: error.message})
        }
    }

    @Get('profile')
    @UseGuards(AdminAuthGuard)
    async getAdminProfile(@Req() req: RequestWithAdmin){
        try{
            const admin = req.admin;
            const adminId = admin?.id as string;
            console.log('admin id', admin?.id);
            return await this.adminServices.getAdminProfile(adminId);
        }catch(error) {
            console.error('Error fetching admin profile:', error);
            throw new InternalServerErrorException({ error: error.error ,message: error.message});
        }
    }

    @Put('edit-profile')
    @UseGuards(AdminAuthGuard)
    async editAdminProfile(@Body() body , @Req() req: RequestWithAdmin){
        try {
            const adminId = req.admin?.id as string;
            return await this.adminServices.editAdminProfile(adminId , body);
        } catch (error) {
            console.error('Error editing admin profile:', error);
            throw new InternalServerErrorException({ error: error.error ,message: error.message});
        }
    }

    @Post('lock')
    @UseGuards(AdminAuthGuard)
    async lockAdmin(@Req() req: RequestWithAdmin){
        try {
            const adminId = req.admin?.id as string;
            return await this.adminServices.adminLocking(adminId);
        } catch (error) {
            console.error('Error locking admin:', error);
            throw new InternalServerErrorException({ error: error.error ,message: error.message});
        }
    }

    @Post('unlock')
    @UseGuards(AdminAuthGuard)
    async unlockAdmin( @Body() body ,@Req() req: RequestWithAdmin){
        try {
            const adminId = req.admin?.id as string;
            return await this.adminServices.adminUnlocking(adminId , body);
        } catch (error) {
            console.error('Error unlocking admin:', error);
            throw new InternalServerErrorException({ error: error.error ,message: error.message});
        }
    }


}
