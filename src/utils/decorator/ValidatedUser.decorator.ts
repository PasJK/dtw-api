import { IsNotEmpty, IsUUID } from "class-validator";
import { applyDecorators } from "@nestjs/common";
import { ValidateForm } from "@utils/enum";

interface ValidatedUuidProps {
    fieldName: string;
}

export const ValidatedUuid = ({ fieldName }: ValidatedUuidProps) => {
    return applyDecorators(
        IsNotEmpty({ message: `${fieldName}|1|${ValidateForm.SHOULD_NOT_EMPTY}` }),
        IsUUID(4, { message: `${fieldName}|2|${ValidateForm.MUST_BE_UUID}` }),
    );
};
