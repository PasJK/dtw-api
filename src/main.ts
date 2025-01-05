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
    const MODE = process?.env?.MODE || "DEV";
    const SSL_KEY_PATH = process?.env?.SSL_KEY_PATH || undefined;
    const SSL_CERT_PATH = process?.env?.SSL_CERT_PATH || undefined;
    let httpsOptions;

    if (MODE === "PRD" && SSL_KEY_PATH && SSL_CERT_PATH) {
        httpsOptions = {
            key: readFileSync(join(process.cwd(), SSL_KEY_PATH), "utf8"),
            cert: readFileSync(join(process.cwd(), SSL_CERT_PATH), "utf8"),
        };
    }

    const app = await NestFactory.create<NestExpressApplication>(AppModule, httpsOptions ? { httpsOptions } : {});
    const staticAssetDirectories = ["public"];

    staticAssetDirectories.forEach(directory => {
        app.useStaticAssets(join(__dirname, `../${directory}/`), {
            setHeaders: res => {
                res.set("Access-Control-Allow-Origin", "*");
            },
        });
    });
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
