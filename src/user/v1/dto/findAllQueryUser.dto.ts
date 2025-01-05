import { IsEnum, IsOptional, IsString } from "class-validator";
import { ValidateForm } from "@utils/enum";

export class FindAllQueryUserDto {
    @IsOptional()
    @IsString({ message: `limit|1|${ValidateForm.SHOULD_BE_STRING}` })
    limit?: string;

    @IsOptional()
    @IsString({ message: `page|1|${ValidateForm.SHOULD_BE_STRING}` })
    page?: string;

    @IsOptional()
    @IsString({ message: `keyword|1|${ValidateForm.SHOULD_BE_STRING}` })
    keyword?: string;

    @IsOptional()
    @IsEnum(["ASC", "DESC"], { message: `order|1|${ValidateForm.SHOULD_BE_STRING}` })
    order?: "ASC" | "DESC";

    @IsOptional()
    @IsString({ message: `orderBy|1|${ValidateForm.SHOULD_BE_STRING}` })
    orderBy?: string;

    @IsOptional()
    @IsString({ message: `status|1|${ValidateForm.SHOULD_BE_STRING}` })
    @IsEnum(["active", "inactive", "pending"], { message: `status|1|${ValidateForm.SHOULD_BE_STRING}` })
    status?: string;

    @IsOptional()
    @IsString({ message: `role|1|${ValidateForm.SHOULD_BE_STRING}` })
    role?: string;
}
