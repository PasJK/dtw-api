import { DataSource } from "typeorm";
import Config from "./config";

export const dataSource = new DataSource({
    type: "postgres",
    host: Config.getInstantConfig().DB_HOST || "localhost",
    port: Config.getInstantConfig().DB_PORT || 5437,
    username: Config.getInstantConfig().DB_USER || "root",
    password: Config.getInstantConfig().DB_PASSWORD || "",
    database: Config.getInstantConfig().DB_NAME || "",
    schema: Config.getInstantConfig().DB_SCHEMA || "public",
    entities: ["dist/**/entities/*.entity.js"],
    migrations: ["dist/configs/migrations/*.js"],
    synchronize: false,
    migrationsTableName: "migrations",
});
