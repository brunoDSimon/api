import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDTO } from './create-user.dto';
import { PrismaClient } from '@prisma/client';
import { PrismaService } from 'src/prisma/service/prisma.service';
import * as bcrypt from 'bcrypt'

@Injectable()
export class UserService {

    constructor(
        private readonly prisma: PrismaService
    ) {

    }
    public async create({email,name,password}:CreateUserDTO) {
        let pwt = await bcrypt.hash(password,await bcrypt.genSalt())
        password = pwt
        return this.prisma.user.create({
            data: {
                email,
                name,
                password
            }
        })
       
    }

    public async list() {
       const result = await this.prisma.user.findMany() 
       return result
    }

    public async findId(id) {
        return await this.prisma.user.findUnique({
            where:  {
                id : id
            }
        })
    }

    public async delete(id) {
        const result = this.findId(id)
        if(!result) {
            return 
        }
        return this.prisma.user.delete({
            where: {
                id
            }
        })
    }

    public async update(body, id) {
        const result = this.findId(id)
        if(!result) {
            return 
        }
        if(body.password) {
            let pwt = await bcrypt.hash(body.password,await bcrypt.genSalt())
            body.password = pwt;
        }
        return this.prisma.user.update({
            data:body,
            where: {
                id
            }
        })
    }
}
