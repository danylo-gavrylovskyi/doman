import { Transform } from "class-transformer";

export const ToNumber = () =>
    Transform(({ value }) => (value !== undefined ? Number(value) : value));

export const ToBoolean = () =>
    Transform(({ value }) => (value !== undefined ? Boolean(value) : value));

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
