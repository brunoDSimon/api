import { IsEmail, IsJWT, IsString, MinLength, isEmail } from "class-validator";

export class AuthResetDTO {
    
    @IsString()
    @MinLength(6)
    password:string;


    @IsJWT()
    token: string
}