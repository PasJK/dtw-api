import { ValidatedEmail } from "@utils/decorator";

export class LoginDto {
    @ValidatedEmail()
    email: string;

    password: string;
}
