import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

import * as express from "express";
import * as path from "path";
import helmet from "helmet";

import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
	const PORT = process.env.PORT || 4000;
	const app = await NestFactory.create(AppModule, {
		logger: ['log', 'warn', 'error', 'debug'],
	});

	const config = new DocumentBuilder()
		.setTitle("Doman")
		.addBearerAuth()
		.build();
	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup("/api/docs", app, document);

	app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));

	const allowedOrigins = (process.env.CORS_ORIGINS || process.env.FRONTEND_URL || "")
		.split(",")
		.map((origin) => origin.trim())
		.filter(Boolean);

	app.enableCors({
		origin: allowedOrigins.length > 0 ? allowedOrigins : true,
		credentials: true,
	});

	app.use("/uploads", express.static(path.resolve(process.cwd(), "uploads")));

	app.useGlobalPipes(
		new ValidationPipe({
			transform: true,
			whitelist: true,
			forbidNonWhitelisted: true
		})
	)

	await app.listen(PORT, () => console.log(`Server started on port = ${PORT}`));
}
bootstrap();
