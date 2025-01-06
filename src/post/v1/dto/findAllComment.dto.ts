import { IsOptional, IsString } from "class-validator";
import { ValidateForm } from "@utils/enum";

export class FindAllCommentDto {
    @IsOptional()
    @IsString({ message: `perPage|1|${ValidateForm.SHOULD_BE_STRING}` })
    perPage?: string;

    @IsOptional()
    @IsString({ message: `page|1|${ValidateForm.SHOULD_BE_STRING}` })
    page?: string;
}
