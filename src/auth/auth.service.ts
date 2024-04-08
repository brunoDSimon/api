import { BadRequestException, Injectable, UnauthorizedException, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/service/prisma.service';
import { AuthResetDTO } from './DTO/auth-reset.dto';
import { UserService } from 'src/user/user/user.service';
import { authRegisterDTO } from './DTO/auth-register.dto';
import { AuthGuard } from 'src/guards/auth/auth.guard';
import * as bcrypt from 'bcrypt'
import { MailerService } from '@nestjs-modules/mailer';
@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private prismaService: PrismaService,
        private userService: UserService,
        private mailer: MailerService
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
            let result = await this.prismaService.user.findFirst({
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
            const result = await this.prismaService.user.findFirst({
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
                let user = await this.prismaService.user.update({
                    where: {
                        id: dados.id
                    },
                    data : {
                        password
                    }
                });
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
