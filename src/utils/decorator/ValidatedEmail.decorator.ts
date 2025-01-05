import { Transform } from "class-transformer";
import { IsNotEmpty, IsEmail } from "class-validator";
import { applyDecorators } from "@nestjs/common";
import { ValidateForm } from "@utils/enum";

export const ValidatedEmail = () => {
    return applyDecorators(
        Transform(({ value }) => value?.toLowerCase()),
        IsNotEmpty({ message: `email|1|${ValidateForm.SHOULD_NOT_EMPTY}` }),
        IsEmail({}, { message: `email|2|${ValidateForm.INVALID_EMAIL_FORMAT}` }),
    );
};
