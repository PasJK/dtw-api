import { ValidatedUsername } from "@utils/decorator";

export class LoginDto {
    @ValidatedUsername()
    username: string;
}
