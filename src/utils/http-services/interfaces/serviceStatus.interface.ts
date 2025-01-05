import { HttpStatus } from "@nestjs/common";

export const SERVICE_STATUS = {
    SUCCESS: {
        httpCode: HttpStatus.OK,
        serviceCode: "S200",
        message: "Success",
        data: null,
    },
    CREATED: {
        httpCode: HttpStatus.CREATED,
        serviceCode: "S201",
        message: "Success",
        data: null,
    },
    FORBIDDEN: {
        httpCode: HttpStatus.FORBIDDEN,
        serviceCode: "E403",
        message: "You do not have permission to access this resource.",
        data: null,
    },
    SERVICE_BAD_UNAVAILABLE: {
        httpCode: HttpStatus.SERVICE_UNAVAILABLE,
        serviceCode: "E503",
        message: "Service Unavailable",
        data: null,
    },
    SERVICE_BAD_REQUEST: {
        httpCode: HttpStatus.BAD_REQUEST,
        serviceCode: "E400",
        message: "Bad Request",
        data: null,
    },
    NOT_FOUND: {
        httpCode: HttpStatus.NOT_FOUND,
        serviceCode: "E404",
        message: "Not Found",
        data: null,
    },
    RESOURCE_NOT_FOUND: {
        httpCode: HttpStatus.NOT_FOUND,
        serviceCode: "S404",
        message: "Resource Not Found",
        data: null,
    },
    UNAUTHORIZED: {
        httpCode: HttpStatus.UNAUTHORIZED,
        serviceCode: "E401",
        message: "Unauthorized",
        data: null,
    },
    SESSION_EXPIRED: {
        httpCode: HttpStatus.UNAUTHORIZED,
        serviceCode: "E440",
        message: "Session Expired",
        data: null,
    },
    SERVICE_ERROR: {
        httpCode: HttpStatus.INTERNAL_SERVER_ERROR,
        serviceCode: "E500",
        message: "Service error",
        data: null,
    },
    DATABASE_ERROR: {
        httpCode: HttpStatus.INTERNAL_SERVER_ERROR,
        serviceCode: "D500",
        message:
            "We're currently unable to store some information due to a technical issue. Please try again in a few minutes.",
        data: null,
    },
    DATABASE_FAIL: {
        httpCode: HttpStatus.INTERNAL_SERVER_ERROR,
        serviceCode: "D501",
        message: "Database Connection Fail",
        data: null,
    },
    DATABASE_TIMEOUT: {
        httpCode: HttpStatus.REQUEST_TIMEOUT,
        serviceCode: "D502",
        message: "Database connection timeout",
        data: null,
    },
    CONNECTION_FAIL: {
        httpCode: HttpStatus.INTERNAL_SERVER_ERROR,
        serviceCode: "C501",
        message: "Connection Fail",
        data: null,
    },
};

export interface NetworkError extends Error {
    errno?: number;
    code?: string;
    syscall?: string;
    address?: string;
    port?: number;
}

export interface ServiceStatusInterface<T> {
    httpCode: number;
    serviceCode: string;
    message: string;
    data: T | null;
    location?: string;
    traces?: string;
}
