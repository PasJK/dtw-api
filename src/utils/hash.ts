import { createHash } from "crypto";
import * as bcrypt from "bcrypt";
import Config from "@configs/config";

export class Hash {
    static async generateHash(rawText: string): Promise<string> {
        const saltRounds = await bcrypt.genSalt(Config.getInstantConfig().SALT_ROUND);
        return bcrypt.hashSync(rawText, saltRounds);
    }

    static compareHash(rawText: string, hashPassword: string): boolean {
        return bcrypt.compareSync(rawText, hashPassword);
    }

    static async hashHex(id: string): Promise<string> {
        const timestamp = Date.now().toString();
        return createHash("sha256")
            .update(id.toString() + timestamp)
            .digest("hex")
            .slice(0, 8);
    }
}
