import { Transform } from "class-transformer";
import { IsNotEmpty, MinLength, MaxLength } from "class-validator";
import { applyDecorators } from "@nestjs/common";
import { ValidateForm } from "@utils/enum";

export const ValidatedUsername = () => {
    return applyDecorators(
        Transform(({ value }) => value?.toLowerCase()),
        IsNotEmpty({ message: `username|1|${ValidateForm.SHOULD_NOT_EMPTY}` }),
        MinLength(4, { message: `username|1|${ValidateForm.NAME_MUST_HAVE_AT_LEAST_4_CHAR}` }),
        MaxLength(50, { message: `username|1|${ValidateForm.NAME_MUST_NOT_EXCEED_THAN_50_CHAR}` }),
    );
};
