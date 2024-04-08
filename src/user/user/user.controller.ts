import { Body, Controller, Delete, Get, Injectable, Param, ParseIntPipe, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { CreateUserDTO } from './create-user.dto';
import { updateUserDTO } from './update-user.dto';
import { UserService } from './user.service';
import { LogInterceptor } from 'src/interceptors/log.interceptor';
import { ParamId } from 'src/decorators/params-id.decorator';
import { Roles } from 'src/decorators/role.decorator';
import { Role } from 'src/enums/role.enum';
import { RoleGuard } from 'src/guards/role/role.guard';
import { AuthGuard } from 'src/guards/auth/auth.guard';
import { SkipThrottle } from '@nestjs/throttler';

@UseInterceptors(LogInterceptor)
@UseGuards(AuthGuard,RoleGuard)
@Controller('users')
export class UserController {
    public user = [
        {"nome":"Bruno"},
        {"nome":"Bruno 2"},
        {"nome":"Bruno 3 "}
    ];

    constructor(
        private readonly userService: UserService
    ) {

    }
    @UseGuards()
    @UseInterceptors(LogInterceptor)
    @Post()
    async create(@Body() body:CreateUserDTO) {
        return this.userService.create(body)
    }
    
    @Get()
    @Roles(Role.Admin, Role.User)
    async users() {
        return this.userService.list()
    }

    @Roles(Role.Admin, Role.User)
    @Get(':id') 
        async oneUser(@ParamId() id: Number) {
            return  this.userService.findId(id)
        }
    
    @Put(':id')
    async update(@Body()Body:updateUserDTO,@Param('id', ParseIntPipe) id) {
        return this.userService.update(Body, id)
    }

    @Delete(':id') 
    async delete(@Param('id', ParseIntPipe) id) {
        return  this.userService.delete(id)
    }
}
