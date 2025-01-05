import { ValidatedUuid } from "@utils/decorator";
import { ValidatedEmailArray } from "@utils/decorator/ValidatedEmailArray.decorator";

export class InviteUserDto {
    @ValidatedEmailArray()
    emails: string[];

    @ValidatedUuid({ fieldName: "organizationId" })
    organizationId: string;
}
