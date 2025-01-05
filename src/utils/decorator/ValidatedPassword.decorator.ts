import { IsNotEmpty, MinLength, MaxLength, Matches } from "class-validator";
import { applyDecorators } from "@nestjs/common";
import { ValidateForm } from "@utils/enum";

export const ValidatedPassword = () => {
    return applyDecorators(
        IsNotEmpty({ message: `password|1|${ValidateForm.SHOULD_NOT_EMPTY}` }),
        MinLength(8, { message: `password|2|${ValidateForm.PASSWORD_MUST_HAVE_AT_LEAST_8_CHAR}` }),
        MaxLength(60, { message: `password|3|${ValidateForm.PASSWORD_NOT_EXCEED_MORE_THAN_60_CHAR}` }),
        Matches(/^(?=.*[a-z])/, { message: `password|4|${ValidateForm.PASSWORD_MUST_HAVE_AT_LEAST_1_LOWER_CASE}` }),
        Matches(/^(?=.*[A-Z])/, { message: `password|5|${ValidateForm.PASSWORD_MUST_HAVE_AT_LEAST_1_UPPER_CASE}` }),
        Matches(/^(?=.*\d)/, { message: `password|6|${ValidateForm.PASSWORD_MUST_HAVE_AT_LEAST_1_NUMBER}` }),
        Matches(/^(?=.*[!@#$%-^&*])/, {
            message: `password|7|${ValidateForm.PASSWORD_MUST_HAVE_AT_LEAST_1_SPECIAL_CHAR}`,
        }),
    );
};
