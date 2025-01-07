import { IsString } from "class-validator";
import { ValidateForm } from "@utils/enum";

export class CreateCommentDto {
    @IsString({ message: `message|1|${ValidateForm.SHOULD_BE_STRING}` })
    message: string;
}
