import { ValidatedEmail } from "@utils/decorator";

export class ForgotPasswordUserDto {
    @ValidatedEmail()
    email: string;
}
