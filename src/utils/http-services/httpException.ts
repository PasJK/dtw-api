/* eslint-disable @typescript-eslint/no-unsafe-enum-comparison */
/* eslint-disable @typescript-eslint/no-base-to-string */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Response, Request } from "express";
import { QueryFailedError } from "typeorm";
import { Catch, HttpStatus, ArgumentsHost, ExceptionFilter } from "@nestjs/common";
import { ErrorObject } from "./errorObject";
import { HttpResponse } from "./httpResponse";
import { LogAPI } from "../log/logAPI";
import { LogService, LogServiceDataInterface } from "../log/logService";
import { ServiceStatusInterface, SERVICE_STATUS, NetworkError } from "./interfaces/serviceStatus.interface";

enum LogLevel {
    INFO = "INFO",
    WARNING = "WARNING",
    DEBUG = "DEBUG",
    ERROR = "ERROR",
}

class CustomExceptionInterface<T> {
    serviceStatus?: ServiceStatusInterface<T>;
    data?: string | Record<string, any>;
    httpStatus?: number;
    response?: {
        message: Array<any>;
        statusCode: number;
    };
}

class CustomExceptionHandleError {
    location: string;
    message: string;
}

class HandleErrorTypeInterface<T> {
    data: CustomExceptionHandleError | Array<string> | null;
    httpStatus: number;
    serviceStatus: ServiceStatusInterface<T>;
}

interface ExceptionInterface {
    response: {
        message: string;
        statusCode: number;
    };
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    async handleErrorType(
        exception: CustomExceptionInterface<ExceptionInterface>,
    ): Promise<HandleErrorTypeInterface<ExceptionInterface>> {
        const exceptionServiceStatus: ServiceStatusInterface<ExceptionInterface> = exception?.serviceStatus;
        let data;
        let httpStatus;
        let serviceStatus;
        let isDBConnectionFail = false;

        if (exception instanceof Error) {
            if ((exception as NetworkError)?.address && (exception as NetworkError).port) {
                httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
                serviceStatus = SERVICE_STATUS.DATABASE_FAIL;

                isDBConnectionFail = true;
            }
        }

        if (!isDBConnectionFail) {
            if (exception?.response?.message) {
                const getMessage = exception?.response?.message;

                if (!Array.isArray(getMessage) || !getMessage) {
                    data = {
                        location: "HttpExceptionFilter",
                        message: getMessage,
                    };
                } else {
                    const isValidMessageList = getMessage.map(message => message.split("|").length === 3);

                    if (isValidMessageList.includes(false)) {
                        httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
                        serviceStatus = SERVICE_STATUS.SERVICE_ERROR;
                        data = {
                            location: "HttpExceptionFilter",
                            message: "Validator error.",
                        };
                        return { data, httpStatus, serviceStatus };
                    }

                    data = getMessage
                        .sort((priorityMessage, message) => {
                            const prioritySplitList = priorityMessage.split("|");
                            const messageSplitList = message.split("|");

                            return prioritySplitList[1] - messageSplitList[1];
                        })
                        .reduce((prevMessage: Record<string, any>, message) => {
                            const messageSplitList = message.split("|");
                            const messageKey = messageSplitList[0];
                            let result = {};

                            if (Object.keys(prevMessage).length === 0) {
                                result = { [messageKey]: messageSplitList[2] };
                            } else if (prevMessage[messageKey]) {
                                result = prevMessage;
                            } else {
                                result = {
                                    ...prevMessage,
                                    [messageKey]: messageSplitList[2],
                                };
                            }

                            return result;
                        }, {});
                }

                const statusCode = exception?.response.statusCode || 500;
                httpStatus = statusCode;
                const checkServiceStatus = Object.entries(SERVICE_STATUS)?.find(
                    item => item[1]["httpCode"] === statusCode,
                );
                serviceStatus =
                    checkServiceStatus && checkServiceStatus[0]
                        ? SERVICE_STATUS[checkServiceStatus[0]] || SERVICE_STATUS.SERVICE_BAD_REQUEST
                        : SERVICE_STATUS.SERVICE_BAD_REQUEST;
            } else if (exceptionServiceStatus) {
                data = exceptionServiceStatus.data;
                httpStatus = exceptionServiceStatus?.httpCode ?? HttpStatus.INTERNAL_SERVER_ERROR;
                serviceStatus = exceptionServiceStatus;
            } else if (exception instanceof Promise) {
                const errorResponse = await new Promise(resolve => {
                    resolve(exception);
                });

                let errorMessage = null;
                let statusCode = null;
                let overrideServiceStatus = SERVICE_STATUS.SERVICE_BAD_REQUEST;

                if (errorResponse instanceof ErrorObject) {
                    const errorServiceResponse = errorResponse?.serviceStatus;
                    errorMessage = errorServiceResponse?.data ? { ...errorServiceResponse?.data } : null;
                    statusCode = errorServiceResponse?.httpCode;

                    if (errorServiceResponse.httpCode === HttpStatus.NOT_FOUND) {
                        overrideServiceStatus = SERVICE_STATUS.NOT_FOUND;
                    } else if (errorServiceResponse?.message) {
                        overrideServiceStatus["message"] = errorServiceResponse?.message;
                    }
                }

                data = errorMessage;
                serviceStatus = overrideServiceStatus;
                httpStatus = statusCode;
            } else {
                let exceptionData;
                let serviceStatusObj;

                if (exception instanceof QueryFailedError) {
                    exceptionData = {
                        location: QueryFailedError.name,
                        message: exception?.driverError?.message,
                    };

                    serviceStatusObj = new ErrorObject({
                        ...SERVICE_STATUS.SERVICE_ERROR,
                        message: exception?.driverError?.message,
                        location: QueryFailedError.name,
                    }).serviceStatus;
                } else {
                    exceptionData = {
                        location: "HttpExceptionFilter",
                        message: exception ? exception.toString() : exception,
                    };
                }

                data = exceptionData;
                httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
                serviceStatus = serviceStatusObj;
            }
        }

        return { data, httpStatus, serviceStatus };
    }

    async catch(exception: CustomExceptionInterface<ExceptionInterface>, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const request = ctx.getRequest<Request>();
        const response = ctx.getResponse<Response>();
        const { data, httpStatus, serviceStatus }: HandleErrorTypeInterface<ExceptionInterface> =
            await this.handleErrorType(exception);

        try {
            LogAPI.log(request, {
                response,
                logBodyData: data,
                responseTime: new Date().toISOString(),
            });

            LogService.log(
                LogLevel.ERROR,
                {
                    location: serviceStatus?.location || "HttpExceptionFilter",
                    message: serviceStatus?.message,
                    error: serviceStatus?.serviceCode,
                    traces: serviceStatus?.traces,
                },
                request,
            );
        } catch (error) {
            const logServiceData: LogServiceDataInterface = {
                location: "httpException",
                message: "log api error",
                error,
            };
            LogService.log(LogLevel.ERROR, logServiceData, request);
        }

        response.status(httpStatus).json({
            ...HttpResponse.res({
                serviceStatus,
                data,
            }),
        });
    }
}
