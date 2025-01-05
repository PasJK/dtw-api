export function extractToken(req): string | null {
    let reqToken = null;
    const getToken = req?.rawHeaders?.find((item) => item.includes("token"));
    if (req.rawHeaders && (req.rawHeaders.length > 0) && getToken) {
        const tokenMatch = getToken.match(/token=([^;]+)/);
        if (tokenMatch && tokenMatch[1]) {
            reqToken = tokenMatch[1];
        }
    } else if (req.cookies && "token" in req.cookies && req.cookies.token.length > 0) {
        reqToken = req.cookies.token;
    }
    return reqToken;
}