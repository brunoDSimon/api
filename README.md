npm i class-validator class-transformer <- para validar os DTO
npm i @nestjs/mapped-types <- parcial types para DTO
npm i -D prisma <- prima 4.8.0

npx prisma generate <- sempre que o banco mudar
npx prisma init <- para criar a base do prisma


npm i  @nestjs/jwt para usar o JWT e criar um modulo jwt

npm i bcrypt  >= caso precise fazer encrypt e decrypt de senhas

npm i -d @types/bcrypt >= types para evitar erros de TS

npm i @nestjs/throttler >= para ratelimit

    @SkipThrottle() para ignorar em uma rota
    Throttle()     dar novos valores a uma rota


$ npm i --save @nestjs/config >= environments 


npm i -d @types/multer  >= types para arquivos


https://nest-modules.github.io/mailer/docs/mailer  >= enviar emails