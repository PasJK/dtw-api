import { IsBoolean, IsIn, IsOptional, IsString, ValidateIf } from "class-validator";
import { ValidatedEmail, ValidatedName, ValidatedPhone } from "@utils/decorator";
import { ValidateForm } from "@utils/enum";

export class UpdateUserDto {
    @IsOptional()
    @ValidatedEmail()
    email: string;

    @IsOptional()
    @ValidatedName("firstNameEN")
    firstNameEN: string;

    @IsOptional()
    @ValidatedName("lastNameEN")
    lastNameEN: string;

    @IsOptional()
    @ValidatedName("firstNameTH")
    firstNameTH: string;

    @IsOptional()
    @ValidatedName("lastNameTH")
    lastNameTH: string;

    @IsOptional()
    @ValidatedPhone()
    phone: string;

    @IsOptional()
    @IsString({ message: `departmentTH|1|${ValidateForm.SHOULD_BE_STRING}` })
    departmentTH?: string;

    @IsOptional()
    @IsString({ message: `departmentEN|1|${ValidateForm.SHOULD_BE_STRING}` })
    departmentEN?: string;

    @IsOptional()
    @IsString({ message: `jobTitleTH|1|${ValidateForm.SHOULD_BE_STRING}` })
    jobTitleTH?: string;

    @IsOptional()
    @IsString({ message: `jobTitleEN|1|${ValidateForm.SHOULD_BE_STRING}` })
    jobTitleEN?: string;

    @ValidateIf((dto: UpdateUserDto) => !!dto.status)
    @IsBoolean({ message: `isActive|1|${ValidateForm.MUST_BE_BOOLEAN}` })
    isActive?: boolean;

    @ValidateIf((dto: UpdateUserDto) => dto.isActive !== undefined)
    @IsIn(["active", "inactive"], { message: `status|1|${ValidateForm.MISMATCH}` })
    status?: string;

    @IsOptional()
    @IsString({ message: `roleKey|1|${ValidateForm.SHOULD_BE_STRING}` })
    roleKey?: string;
}
