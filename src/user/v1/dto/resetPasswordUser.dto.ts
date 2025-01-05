import { IsNotEmpty } from "class-validator";
import { ValidatedPassword } from "@utils/decorator";
import { ValidateForm } from "@utils/enum";

export class ResetPasswordUserDto {
    @IsNotEmpty({ message: `token|1|${ValidateForm.SHOULD_NOT_EMPTY}` })
    token: string;

    @ValidatedPassword()
    password: string;
}
