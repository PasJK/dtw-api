import { Transform } from "class-transformer";
import { IsNotEmpty, IsPhoneNumber } from "class-validator";
import { applyDecorators } from "@nestjs/common";
import { ValidateForm } from "@utils/enum";

export const ValidatedPhone = () => {
    return applyDecorators(
        Transform(({ value }) => {
            if (!value) return "";

            if (!value.startsWith("0")) {
                value = "0" + value;
            }

            return value;
        }),
        IsNotEmpty({ message: `phone|1|${ValidateForm.SHOULD_NOT_EMPTY}` }),
        IsPhoneNumber("TH", { message: `phone|2|${ValidateForm.MUST_BE_PHONE_NUMBER}` }),
    );
};
