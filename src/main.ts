import { readFileSync } from "fs";
import { join } from "path";
import * as cookieParser from "cookie-parser";
import { GlobalAuthGuard } from "@auth/auth.guard";
import Config from "@configs/config";
import { ValidationPipe, VersioningType } from "@nestjs/common";
import { NestFactory, Reflector } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { HttpExceptionFilter } from "@utils/http-services/httpException";
import { TrimPipe } from "@utils/pipe/trim.pipe";
import { AppModule } from "./app.module";

async function bootstrap() {
    const CORS_ORIGIN = process?.env?.CORS_ORIGIN;
    const app = await NestFactory.create<NestExpressApplication>(AppModule, {});

    const reflector = app.get(Reflector);
    app.enableCors({
        origin: CORS_ORIGIN ? CORS_ORIGIN?.split(",") : true,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
        credentials: true,
    });

    app.use(cookieParser());
    app.useBodyParser("json", { limit: "10mb" });
    app.useGlobalGuards(new GlobalAuthGuard(reflector));
    app.useGlobalPipes(new TrimPipe(), new ValidationPipe({ transform: true }));
    app.useGlobalFilters(new HttpExceptionFilter());
    app.enableVersioning({
        type: VersioningType.URI,
    });

    await app.listen(Config.getInstantConfig().PORT);
}
bootstrap();
