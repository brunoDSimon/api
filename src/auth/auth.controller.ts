import { BadRequestException, Body, Controller, FileTypeValidator, MaxFileSizeValidator, ParseFilePipe, Post, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthLoginDTO } from './DTO/auth-login.dto';
import { authRegisterDTO } from './DTO/auth-register.dto';
import { authForgetDTO } from './DTO/auth-forget.dto';
import { AuthResetDTO } from './DTO/auth-reset.dto';
import { UserService } from 'src/user/user/user.service';
import { AuthService } from './auth.service';
import { AuthGuard } from 'src/guards/auth/auth.guard';
import { User } from 'src/decorators/user/user.decorator';
import { FileFieldsInterceptor, FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { FileService } from 'src/file/file.service';


@Controller('auth')
export class AuthController {
    constructor(
        private userService: UserService,
        private authService: AuthService,
        private fileService: FileService
    ) {

    }
    @Post('login')
    async login(@Body() body: AuthLoginDTO) {
        return this.authService.login(body.email, body.password)
    }

    @Post('register') 
    async register(@Body() body: authRegisterDTO) {
        return this.authService.register(body)
    }

    @Post('forget')
    async  forget(@Body() {email}:authForgetDTO) {
        console.log(email)
        return this.authService.forget(email)
    }
     @Post('reset')
     async reset(@Body() body: AuthResetDTO) {
        return this.authService.reset(body.password, body.token)
     }

     @UseInterceptors(FileInterceptor('file'))
     @UseGuards(AuthGuard)
     @Post('photo') 
     async upload(@User() user, @UploadedFile(
        new ParseFilePipe({
            validators: [
                new FileTypeValidator({fileType: 'image/png'}),
                new MaxFileSizeValidator({maxSize:30000})
            ]

         })
     ) photo: Express.Multer.File) {
        
        const path = join(__dirname, '..', '..', 'storage', `photos-${user.id}.png`)
        try {
            this.fileService.upload(photo, path)
        } catch (error) {
            throw new BadRequestException(error)
        }
        return {teste: 'ok'}
     }


     @UseInterceptors(FilesInterceptor('files'))
     @UseGuards(AuthGuard)
     @Post('files') 
     async uploadFiles(@User() user, @UploadedFiles(new ParseFilePipe({
        validators: [
            new FileTypeValidator({fileType: 'image/png'})
        ]
     })) files: Express.Multer.File[]) {
        
        const path = join(__dirname, '..', '..', 'storage', 'photo', `photos-${user.id}.png`)
       
     }

     @UseInterceptors(FileFieldsInterceptor([
        {
            name: 'photo',
            maxCount: 1
        },
        {
            name: 'documents',
            maxCount: 10
        }
     ]))
     @UseGuards(AuthGuard)
     @Post('files-fields') 
     async uploadFilesFields(@User() user, @UploadedFiles() files:{ photo: Express.Multer.File, documents:Express.Multer.File[]}) {
        return files.documents
       
     }
 }
