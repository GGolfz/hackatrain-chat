import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api')
	app.enableCors({
		allowedHeaders: ['Authorization', 'Content-Type'],
		methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH'],
		origin: ['http://localhost:5173', 'http://localhost'],
	})
  const config = new DocumentBuilder()
    .setTitle('API')
    .setDescription('API Specification')
    .setVersion('1.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'JWT',
      description: 'Enter JWT token',
      in: 'header'
    })
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  await app.listen(3000);
}
bootstrap();
