/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpStatus } from "@nestjs/common";
import { Pagination } from "@utils/interface/response.interface";
import { SERVICE_STATUS } from "./interfaces/serviceStatus.interface";

class HttpResponseInterface {
    code: number;
    status: string;
    serviceCode: string;
    serviceMessage: string;
    data: any;
    meta: Pagination;
}

class ResponseInterface {
    serviceStatus: {
        httpCode: number;
        serviceCode: string;
        message: string;
    };

    data?: Record<string, any> | string;
    meta?: Pagination;
}

export class HttpResponse {
    static res(responseObj: ResponseInterface): HttpResponseInterface {
        const { serviceStatus, data = null, meta = null } = responseObj;

        if (!serviceStatus) {
            return {
                code: HttpStatus.INTERNAL_SERVER_ERROR,
                status: "error",
                serviceCode: SERVICE_STATUS.SERVICE_BAD_UNAVAILABLE.serviceCode,
                serviceMessage: SERVICE_STATUS.SERVICE_BAD_UNAVAILABLE.message,
                data,
                meta,
            };
        }

        const { serviceCode, message: serviceMessage } = serviceStatus;
        const successCode = [200, 201];

        return {
            code: serviceStatus?.httpCode,
            status: successCode.includes(serviceStatus?.httpCode) ? "success" : "error",
            serviceCode,
            serviceMessage,
            data,
            meta,
        };
    }
}
