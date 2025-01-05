import { Request } from "express";
import { Logger } from "@nestjs/common";

enum LogLevel {
    INFO = "INFO",
    WARNING = "WARNING",
    DEBUG = "DEBUG",
    ERROR = "ERROR",
}

enum LogType {
    SERVICE = "SERVICE",
    API = "API",
}

export interface LogServiceDataInterface {
    location: string; // function name
    message: string; // custom message
    error: string | null; // exception
    traces?: string;
}

export class LogService {
    static LOG_VERSION = "1";

    static log(logLevel: LogLevel, data: LogServiceDataInterface, httpRequest: Request | null = null) {
        const headers = httpRequest?.headers || {
            "user-agent": null,
            "user-token": null,
            "device-token": null,
        };

        const logMsg = {
            logVersion: this.LOG_VERSION,
            logType: LogType.SERVICE,
            level: logLevel.toLowerCase(),
            host: httpRequest?.hostname || null,
            slug: httpRequest?.baseUrl || null,
            userIp: "",
            userAgent: headers["user-agent"],
            userToken: headers["user-token"],
            deviceToken: headers["device-token"],
            data,
        };

        Logger.log(logMsg);
    }
}
