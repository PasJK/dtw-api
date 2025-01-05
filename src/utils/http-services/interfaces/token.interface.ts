import { HttpStatus } from "@nestjs/common";
import { VerifyToken } from "@utils/enum/token.enum";

export const TOKEN_STATUS = {
    SUCCESS: {
        httpCode: HttpStatus.OK,
        serviceCode: "T200",
        message: VerifyToken.SUCCESS,
        data: null,
    },
    TOKEN_EXPIRED: {
        httpCode: HttpStatus.BAD_REQUEST,
        serviceCode: "T400",
        message: VerifyToken.EXPIRED,
        data: null,
    },
    TEMP_TOKEN_EXPIRED: {
        httpCode: HttpStatus.BAD_REQUEST,
        serviceCode: "T400",
        message: VerifyToken.EXPIRED,
        data: null,
    },
    INVALID_TOKEN: {
        httpCode: HttpStatus.BAD_REQUEST,
        serviceCode: "T400",
        message: VerifyToken.INVALID,
        data: null,
    },
    TOKEN_NOT_FOUND: {
        httpCode: HttpStatus.NOT_FOUND,
        serviceCode: "T404",
        message: VerifyToken.NOT_FOUND,
        data: null,
    },
};
