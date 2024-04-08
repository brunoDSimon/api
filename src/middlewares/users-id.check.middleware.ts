import { BadRequestException, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";

export class UserIdCheckMiddleware implements NestMiddleware {
    
    use(req: Request, res: Response, next: NextFunction) {
        console.log('chegou')
       if( isNaN(Number(req.params.id)) || Number(req.params.id) <= 0) {
        console.log('error')
            throw new BadRequestException('ID invalido');
       }
       next();
    }
    
}