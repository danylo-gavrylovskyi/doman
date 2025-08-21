import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

import * as express from "express";
import * as path from "path";
import * as session from "express-session";
import * as passport from "passport";

import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
	const PORT = process.env.PORT || 4000;
	const app = await NestFactory.create(AppModule, {
		logger: ['log', 'warn', 'error', 'debug'],
	});

	const config = new DocumentBuilder().setTitle("Doman").build();
	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup("/api/docs", app, document);

	app.enableCors();

	app.use("/uploads", express.static(path.resolve(process.cwd(), "uploads")));

	app.use(
		session({
			secret: process.env.PRIVATE_KEY,
			resave: false,
			saveUninitialized: false,
		})
	);

	app.useGlobalPipes(
		new ValidationPipe({
			transform: true,
			whitelist: true,
			forbidNonWhitelisted: true
		})
	)

	app.use(passport.initialize());
	app.use(passport.session());

	await app.listen(PORT, () => console.log(`Server started on port = ${PORT}`));
}
bootstrap();
