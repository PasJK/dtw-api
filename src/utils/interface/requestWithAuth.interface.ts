import { Request } from "express";
import { AccessTokenPayload } from "./jwtToken";

export type RequestUser = AccessTokenPayload & { accessToken: string };
export type RequestWithCookie = Request & { cookies: { token: string } };
export interface RequestWithAuth extends Request {
    user: RequestUser;
}
