import { JsonWebTokenError } from "@nestjs/jwt";
import { TokenExpiredError } from "@nestjs/jwt";
import { TokenType } from "@utils/enum/token.enum";

export interface AccessTokenPayload {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    lastLogin: Date;
    inActivityLimit: number;
    tokenType: TokenType.ACCESS;
}

export interface SignUpTokenData {
    domain: string;
    method: string;
}

export interface DecodedToken {
    exp: number;
}

export type JwtErrorResponse = JsonWebTokenError | TokenExpiredError | Error;
