import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { FileModule } from 'src/file/file.module';

@Module({
    imports:[
        JwtModule.register({
            secret: `-{-KwR2q119a*X-35G,£}W,k=Ut\<uk;`
        }),
        forwardRef(()=> UserModule) ,
        PrismaModule,
        FileModule
        
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
