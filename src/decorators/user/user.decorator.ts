import { ExecutionContext, NotFoundException, SetMetadata, createParamDecorator } from '@nestjs/common';

export const User =  createParamDecorator((input: any, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    if(request.user) {

        if(input) {
            request.user[input]
        } else {
            return request.user 
        }
    } else {
        throw new NotFoundException()
    }
})
