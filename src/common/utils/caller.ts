export interface ContractFunction {
    functionName: string;
    args?: any[];
    formatter?: (value: any) => any;
}
export const mapInfoToObject = (arr: Array<string>, values: Array<any>) => {
    arr.reduce((total, item, i) => {
        // @ts-ignore
        total[item] = values[i];
        return total;
    }, {});
};

export const mapStringInforToObject = (
    str: string = '',
    values: Array<any>
) => {
    const arr = str.split(',') as Array<string>;
    return arr.reduce((total, item, i) => {
        // @ts-ignore
        total[item] = values[i];
        return total;
    }, {});
};
