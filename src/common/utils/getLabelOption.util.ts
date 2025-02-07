export const getLabelOption = <T>(
    value: T | undefined,
    options: Option<T>[]
) => {
    return options.find((option) => option?.value === value)?.value || '';
};
