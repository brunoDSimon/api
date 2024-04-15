import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateUserDTO } from './create-user.dto';
import * as bcrypt from 'bcrypt'
import { Repository } from 'typeorm';
import { User } from '../entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>
    ) {

    }
    public async create({email,name,password}:CreateUserDTO) {
        let pwt = await bcrypt.hash(password,await bcrypt.genSalt())
        password = pwt
        return this.usersRepository.create({
            email,
            name,
            password
        })
       
    }

    public async list() {
       const result = await this.usersRepository.find() 
       return result
    }

    public async findId(id) {
        return await this.usersRepository.findOne({
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
        return this.usersRepository.delete({id})
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

         this.usersRepository.update(id,body)
       
    }
}
