export const sanitizePagination = (value: string | number | null, fallbackValue: number, min = 1): number => {
    const parsedValue = Number(value);
    return !isNaN(parsedValue) && parsedValue >= min ? parsedValue : fallbackValue;
}
