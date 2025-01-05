/* eslint-disable @typescript-eslint/no-explicit-any */
import { IncomingHttpHeaders } from "http";
import { Request } from "express";
import { Logger } from "@nestjs/common";

enum LogType {
    SERVICE = "SERVICE",
    API = "API",
}

class DataResponseInterface {
    logBodyData: Record<string, any> | string;
    responseTime: string;
    response: Record<string, any>;
}

interface LogApiData {
    url: string;
    requestHeader: IncomingHttpHeaders;
    requestBody: string;
    responseHeader: Record<string, any> | string;
    responseBody: Record<string, any> | string;
    responseStatus: string;
    requestTimeStamp: string;
    responseTimeStamp: string;
}

interface LogMessage {
    logVersion: string;
    logType: string;
    correlationId: string;
    appVersion: string; // frontend version
    actionName: string;
    userIp: string;
    userAgent: string;
    userToken: string;
    deviceToken: string;
    data: LogApiData;
}

export class LogAPI {
    static LOG_VERSION = "1";

    static log(request: Request, dataResponse: DataResponseInterface) {
        const requestHeaders: IncomingHttpHeaders = request.headers;
        const { logBodyData, responseTime, response }: DataResponseInterface = dataResponse;
        const data: LogApiData = {
            url: `${request.hostname}${request.url}`,
            requestHeader: requestHeaders,
            requestBody: request?.body,
            responseHeader: response.getHeaders(),
            responseBody: logBodyData,
            responseStatus: response.statusCode, // http status code
            requestTimeStamp: request.headers["request-time"] as string,
            responseTimeStamp: responseTime,
        };

        const logMsg: LogMessage = {
            logVersion: this.LOG_VERSION,
            logType: LogType.API,
            correlationId: requestHeaders["correlation-id"] as string,
            appVersion: requestHeaders["app-version"] as string, // frontend version
            actionName: requestHeaders["action-name"] as string,
            userIp: request.ip,
            userAgent: requestHeaders["user-agent"],
            userToken: requestHeaders["user-token"] as string,
            deviceToken: requestHeaders["device-token"] as string,
            data,
        };

        Logger.log(logMsg);
    }
}
