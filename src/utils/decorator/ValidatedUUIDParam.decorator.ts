import { Param, ParseUUIDPipe } from "@nestjs/common";
import { ErrorObject } from "@utils/http-services/errorObject";
import { SERVICE_STATUS } from "@utils/http-services/interfaces/serviceStatus.interface";

export const UUIDParam = (paramName: string) => {
    return Param(
        paramName,
        new ParseUUIDPipe({
            version: "4",
            exceptionFactory: () => {
                throw new ErrorObject({
                    ...SERVICE_STATUS.NOT_FOUND,
                });
            },
        }),
    );
};
