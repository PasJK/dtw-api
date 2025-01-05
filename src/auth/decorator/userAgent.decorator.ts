import * as DeviceDetector from "device-detector-js";
import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { UserAgent } from "@utils/interface/userAgent.interface";

const defaultUserAgent: UserAgent = {
    type: "-",
    name: "-",
    device: "-",
    brand: "-",
    model: "-",
};

export const UserAgentInfo = createParamDecorator((data: unknown, ctx: ExecutionContext): UserAgent => {
    const request = ctx.switchToHttp().getRequest();
    const userAgent: string = request.headers["user-agent"];

    try {
        const deviceDetector = new DeviceDetector();
        const info = deviceDetector.parse(userAgent);

        return {
            type: info.client?.type,
            name: info.client?.name,
            device: info?.device?.type || null,
            brand: info?.device?.brand || null,
            model: info?.device?.model || null,
        };
    } catch (error) {
        console.error("Failed to parse user agent:", error);
        return defaultUserAgent;
    }
});
