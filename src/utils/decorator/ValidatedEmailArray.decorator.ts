import { Transform } from "class-transformer";
import { IsNotEmpty, IsEmail, ArrayNotEmpty } from "class-validator";
import { applyDecorators } from "@nestjs/common";
import { ValidateForm } from "@utils/enum";

export const ValidatedEmailArray = () => {
    return applyDecorators(
        Transform(({ value }) => value?.map((email: string) => email?.toLowerCase())),
        IsNotEmpty({ message: `email|1|${ValidateForm.SHOULD_NOT_EMPTY}` }),
        ArrayNotEmpty({ message: `email|2|${ValidateForm.SHOULD_NOT_EMPTY}` }),
        IsEmail({}, { message: `email|3|${ValidateForm.INVALID_EMAIL_FORMAT}`, each: true }),
    );
};
