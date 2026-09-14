import { Transform } from "class-transformer";

export const ToNumber = () =>
    Transform(({ value }) => (value !== undefined ? Number(value) : value));

export const ToBoolean = () =>
    Transform(({ value }) => {
        if (value === undefined || typeof value === "boolean") return value;
        // Query strings and multipart fields arrive as "true"/"false", which
        // Boolean() would both coerce to true.
        if (value === "true") return true;
        if (value === "false") return false;
        return Boolean(value);
    });

export const ToJsonArray = <T>() =>
    Transform(({ value }) => {
        if (typeof value === "string") {
            try {
                return JSON.parse(value) as T[];
            } catch {
                return [];
            }
        }
        return value;
    });
