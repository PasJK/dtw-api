import { UserAgent } from "@utils/interface/userAgent.interface";

export const prepareUserAgent = async (userAgent: UserAgent): Promise<string> => {
    return Object.entries(userAgent)
        .map(([key, value]: [string, string]) => (value ? `${key}:${value.toString().replace(/\s/g, "")}` : null))
        .filter((info): info is string => info !== null)
        .join(";");
};
