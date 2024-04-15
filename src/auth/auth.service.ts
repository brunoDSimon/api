import { BadRequestException, Injectable, UnauthorizedException, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthResetDTO } from './DTO/auth-reset.dto';
import { UserService } from 'src/user/user/user.service';
import { authRegisterDTO } from './DTO/auth-register.dto';
import { AuthGuard } from 'src/guards/auth/auth.guard';
import * as bcrypt from 'bcrypt'
import { MailerService } from '@nestjs-modules/mailer';
import { User } from 'src/user/entity/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private userService: UserService,
        private mailer: MailerService,
        @InjectRepository(User)
        private usersRepository: Repository<User>
        ) {}

        async createToken(user:User) {
            return {
                acessToken: this.jwtService.sign({
                    id: user.id,
                    name: user.name,
                    email: user.email
                }, {
                    expiresIn: "7 days",
                    subject: String(user.id),
                    issuer: "API TESTE",
                    audience: "users"
                })
            }
            
        }

        checkToken(token) { 
            try {
                return this.jwtService.verifyAsync(token, {
                    issuer: "API TESTE"
                 })
            } catch (error) {
                throw new UnauthorizedException()
            }
         
        }


        async isValidToken(token: string) {
            try {
                this.checkToken(token)
                return true
            } catch (error) {
                return false
            }
        }

        async login(email: string, password:string) {
            let result = await this.usersRepository.findOne({
                where: {
                    email: email
                }
            })
            if(!result) {
                throw new UnauthorizedException('Usuário não autorizado')
            } 
            let pwt = await bcrypt.compare(password, result.password)
            if(pwt) {
                return this.createToken(result);
            } else {
                throw new UnauthorizedException()
            }
        }
        async forget(email:string) {
            const result = await this.usersRepository.findOne({
                where: {
                    email
                }
            })
            if(!result) {
                throw new UnauthorizedException('não existe')
            }
            
            const token =  await this.jwtService.sign({
                id:result.id
            }, {
                expiresIn: "7 days",
                subject: String(result.id),
                issuer: "forget",
                audience: "users"
            })
            console.log(token)
            await this.mailer.sendMail({
                subject: 'teste',
                to: 'brunosimon@ienh.com.br',
                template: 'forget',
                context: {
                    name: result.name,
                    link: token
                }
            })
            return true
        }

        async reset(password:string, token:string) {

            try {
                const dados:any = this.jwtService.verifyAsync(token, {
                    issuer: "forget",
                    audience: "users"
                 })

                 if(isNaN(Number(dados.id))) {
                    throw new BadRequestException('token invalido')
                 }
                 this.usersRepository.update(Number(dados.id),{
                  password
                });
                let user = await this.usersRepository.findOne({where: {
                    id: Number(dados.id)
                }})
                return this.createToken(user)
            } catch (error) {
                throw new BadRequestException()
            }
            
        }

        async register(body: authRegisterDTO) {
            const result = await this.userService.create(body)
            return this.createToken(result)
        }
 }
