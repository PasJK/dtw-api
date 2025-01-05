import { IsNotEmpty, IsString, MinLength, MaxLength, Matches } from "class-validator";
import { applyDecorators } from "@nestjs/common";
import { ValidateForm } from "@utils/enum";

export const ValidatedName = (fieldName: string) => {
    return applyDecorators(
        IsNotEmpty({ message: `${fieldName}|1|${ValidateForm.SHOULD_NOT_EMPTY}` }),
        IsString({ message: `${fieldName}|2|${ValidateForm.MUST_BE_CHARACTERS}` }),
        MinLength(4, { message: `${fieldName}|3|${ValidateForm.NAME_MUST_HAVE_AT_LEAST_4_CHAR}` }),
        MaxLength(50, { message: `${fieldName}|4|${ValidateForm.NAME_MUST_NOT_EXCEED_THAN_50_CHAR}` }),
        Matches(/^[A-Za-zก-๙\s]+$/, { message: `${fieldName}|5|${ValidateForm.MUST_BE_CHARACTERS}` }),
    );
};
