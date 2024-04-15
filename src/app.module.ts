import { MiddlewareConsumer, Module, NestModule, RequestMethod, forwardRef } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { UserIdCheckMiddleware } from './middlewares/users-id.check.middleware';
import { AuthModule } from './auth/auth.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { FileModule } from './file/file.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/entity/user.entity';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env']
    }),
    forwardRef(()=> UserModule), 
    forwardRef(()=> AuthModule),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
        ignoreUserAgents: [/googlebot/gi],
      },
    ]),
    FileModule,
    MailerModule.forRoot({
      transport: {
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: 'colin.graham0@ethereal.email',
            pass: 'KardUW1Uyg53nn6Yy4'
        }
    },
      defaults: {
        from: '"nest-modules" <modules@nestjs.com>',
      },
      template: {
        dir: __dirname + '/templates',
        adapter: new PugAdapter(),
        options: {
          strict: true,
        },
      },
    }),
    TypeOrmModule.forRoot({
      type: `mysql`,
      host: `localhost`,
      username: `root`, 
      port: 3306,
      database:`api`,
      password: "root",
      
      entities: [User ],
      synchronize: true
    })
  ],
  controllers: [AppController],
  providers: [AppService,
  {provide: APP_GUARD, useClass: ThrottlerGuard}],
  
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(
      UserIdCheckMiddleware
      ).forRoutes({
        method: RequestMethod.ALL,
        path: 'users/:id'
      })
  }
}
