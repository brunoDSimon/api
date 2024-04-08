import { IsEmail, IsString, MinLength, isEmail } from "class-validator";

export class authForgetDTO {
    
    @IsEmail()
    email: string;
}