import { IsOptional } from "class-validator";
import { ValidatedEmail, ValidatedName, ValidatedPassword, ValidatedPhone } from "@utils/decorator";

export class CreateUserDto {
    @ValidatedEmail()
    email: string;

    @ValidatedPassword()
    password: string;

    @ValidatedName("firstNameEN")
    firstNameEN: string;

    @ValidatedName("lastNameEN")
    lastNameEN: string;

    @ValidatedName("firstNameTH")
    firstNameTH: string;

    @ValidatedName("lastNameTH")
    lastNameTH: string;

    @ValidatedPhone()
    phone: string;

    @IsOptional()
    departmentTH?: string;

    @IsOptional()
    departmentEN?: string;

    @IsOptional()
    jobTitleTH?: string;

    @IsOptional()
    jobTitleEN?: string;
}
