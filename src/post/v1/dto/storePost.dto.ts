import { IsString } from "class-validator";
import { ValidateForm } from "@utils/enum";

export class StorePostDto {
    @IsString({ message: `community|1|${ValidateForm.SHOULD_BE_STRING}` })
    community: string;

    @IsString({ message: `title|1|${ValidateForm.SHOULD_BE_STRING}` })
    title: string;

    @IsString({ message: `contents|1|${ValidateForm.SHOULD_BE_STRING}` })
    contents: string;
}
