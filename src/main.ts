import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
    // Enable CORS for all origins
  app.enableCors({
    origin: 'http://localhost:4200', // allow only this origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // allow cookies or other credentials
  });
  await app.listen(3000);
}
bootstrap();
