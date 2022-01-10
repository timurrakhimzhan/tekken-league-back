import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { migrate } from "./db/migrate";
import { HttpStatus, ValidationPipe } from "@nestjs/common";
import { HttpExceptionFilter } from "./filters/http-exception.filter";
import { FastifyAdapter } from "@nestjs/platform-fastify";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
async function bootstrap() {
  await migrate();
  const app = await NestFactory.create(AppModule, new FastifyAdapter());
  app.enableCors({
    origin: "*",
  });
  app.setGlobalPrefix("api/");
  app.useGlobalPipes(
    new ValidationPipe({
      errorHttpStatusCode: HttpStatus.BAD_GATEWAY,
      stopAtFirstError: true,
      transform: true,
      enableDebugMessages: true,
    }),
  );
  // app.useGlobalPipes(new FastifySchemaPipe());
  // app.useGlobalInterceptors(new FastifySchemaInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter(app.getHttpAdapter()));
  const config = new DocumentBuilder()
    .setTitle("Tekken league backend")
    .setDescription("Description")
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("/swagger", app, document);
  await app.listen(3001, "0.0.0.0");
}
bootstrap();
