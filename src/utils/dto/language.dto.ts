import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { ValidateForm } from "@utils/enum";

export class LanguageDto {
    @IsNotEmpty({ message: `th|1|${ValidateForm.SHOULD_NOT_EMPTY}` })
    @IsString({ message: `th|2|${ValidateForm.MUST_BE_CHARACTERS}` })
    th: string;

    @IsOptional()
    @IsNotEmpty({ message: `en|1|${ValidateForm.SHOULD_NOT_EMPTY}` })
    @IsString({ message: `en|2|${ValidateForm.MUST_BE_CHARACTERS}` })
    en?: string;
}
