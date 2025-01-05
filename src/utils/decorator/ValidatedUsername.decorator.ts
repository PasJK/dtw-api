import { Transform } from "class-transformer";
import { IsNotEmpty } from "class-validator";
import { applyDecorators } from "@nestjs/common";
import { ValidateForm } from "@utils/enum";

export const ValidatedUsername = () => {
    return applyDecorators(
        Transform(({ value }) => value?.toLowerCase()),
        IsNotEmpty({ message: `username|1|${ValidateForm.SHOULD_NOT_EMPTY}` }),
    );
};
