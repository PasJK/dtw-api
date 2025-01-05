import { IsBoolean, IsEnum, IsOptional, IsString } from "class-validator";
import { ValidateForm } from "@utils/enum";

export class FindAllPostDto {
    @IsOptional()
    @IsString({ message: `perPage|1|${ValidateForm.SHOULD_BE_STRING}` })
    perPage?: string;

    @IsOptional()
    @IsString({ message: `page|1|${ValidateForm.SHOULD_BE_STRING}` })
    page?: string;

    @IsOptional()
    @IsString({ message: `search|1|${ValidateForm.SHOULD_BE_STRING}` })
    search?: string;

    @IsOptional()
    @IsString({ message: `communityType|1|${ValidateForm.SHOULD_BE_STRING}` })
    communityType?: string;

    @IsOptional()
    @IsBoolean({ message: `ourPost|1|${ValidateForm.MUST_BE_BOOLEAN}` })
    ourPost?: boolean;

    @IsOptional()
    @IsEnum(["ASC", "DESC"], { message: `order|1|${ValidateForm.SHOULD_BE_STRING}` })
    order?: "ASC" | "DESC";

    @IsOptional()
    @IsString({ message: `orderBy|1|${ValidateForm.SHOULD_BE_STRING}` })
    orderBy?: string;
}
