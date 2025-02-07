import {
    ChainId,
    ENDPOINT_GRAPHQL_WITH_CHAIN
} from '@/src/common/constant/constance';
import { instance } from './axios';
import { ApiResponse } from '../response.type';
type Obj = { [key: string]: any };
export async function CallApi(
    url: string,
    query: any | null,
    method: string,
    header?: HeadersInit
): Promise<Response> {
    return await fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            ...header
        },
        body: JSON.stringify(query)
    });
}

export const querySubGraph = (
    query: any,
    chainId: ChainId = ChainId.BARTIO
): Promise<Response> => {
    const endpoint = ENDPOINT_GRAPHQL_WITH_CHAIN[chainId];
    return CallApi(endpoint, query, 'POST');
};
export function get<T, R = ApiResponse<T>>(
    route: string,
    params?: Obj
): Promise<R> {
    return instance.get(route, { params });
}

function post<T, R = ApiResponse<T>>(route: string, payload?: Obj): Promise<R> {
    return instance.post(route, payload);
}
function upload<T, R = ApiResponse<T>>(
    router: string,
    payload: Obj
): Promise<R> {
    const formData = new FormData();
    function appendFormData(nameInput: string, array: Array<any>): void {
        for (let i = 0; i < array.length; i++) {
            formData.append(nameInput, array[i]);
        }
    }
    const keysData = Object.keys(payload);
    if (keysData.length > 0) {
        for (let i = 0; i < keysData.length; i++) {
            const keyItem = keysData[i];
            if (Array.isArray(payload[keyItem])) {
                appendFormData(keyItem, payload[keyItem]);
            } else {
                formData.append(keyItem, payload[keyItem]);
            }
        }
    }
    return instance.post(router, formData);
}
export { post, upload };
