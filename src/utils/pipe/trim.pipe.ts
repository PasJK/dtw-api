import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";

@Injectable()
export class TrimPipe implements PipeTransform {
    transform(body: unknown | ArrayLike<unknown>, metadata: ArgumentMetadata) {
        const newBody = body;
        if (["custom", "body", "query"].includes(metadata?.type)) {
            Object.entries(body).forEach(item => {
                const property = item[0];
                const value: string | unknown = item[1];
                newBody[property] = typeof value === "string" ? value?.trim() : value;
            });
        }

        return newBody;
    }
}
