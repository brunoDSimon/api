import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { FileModule } from 'src/file/file.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entity/user.entity';

@Module({
    imports:[
        JwtModule.register({
            secret: `-{-KwR2q119a*X-35G,£}W,k=Ut\<uk;`
        }),
        forwardRef(()=> UserModule) ,
        FileModule,
        TypeOrmModule.forFeature([User])
        
    ],
    exports: [
        AuthService
    ],
    providers: [
        AuthService
    ],
    controllers: [
        AuthController
    ]
})
export class AuthModule {}
