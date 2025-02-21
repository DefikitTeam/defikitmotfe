/* eslint-disable */

import { ChainId } from '@/src/common/constant/constance';
import { ConfigService } from '@/src/config/services/config-service';
import { ApiResponse } from '../response.type';
import { instance } from './axios';
import serviceAuth from './backend-server/auth';
type Obj = { [key: string]: any };

instance.interceptors.request.use(
    (config) => {
        const accessToken = serviceAuth.getAccessTokenStorage();
        if (
            !!accessToken &&
            config.headers &&
            !config.headers['Authorization']
        ) {
            config.headers['Authorization'] = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

instance.interceptors.response.use(
    (response) => {
        const { status, data } = response;
        if (status === 200 || status === 201) {
            return data;
        }
        return Promise.reject(data);
    },
    async (error: any) => {
        const prevRequest = error?.config;
        // if (error?.response?.status === 401) {
        //     if (prevRequest.url.includes('refresh-token')) {
        //         store?.dispatch(signOutTelegram());
        //         store?.dispatch(signOutWallet());
        //         return false;
        //     }
        //     const newAccessToken = await serviceAuth.getRefreshToken();
        //     if (!newAccessToken) {
        //         return false;
        //     }
        //     prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        //     return instance(prevRequest);
        // }
        return Promise.reject(error);
    }
);

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
    chainId: ChainId
): Promise<Response> => {
    // const endpoint = ENDPOINT_GRAPHQL_WITH_CHAIN[chainId];
    const config = ConfigService.getInstance();
    const endpoint = config.getApiConfig().endpoints.subgraph[chainId];
    return CallApi(endpoint, query, 'POST');
};

function get<T, R = ApiResponse<T>>(route: string, params?: Obj): Promise<R> {
    return instance.get(route, { params });
}

function post<T, R = ApiResponse<T>>(route: string, payload?: Obj): Promise<R> {
    return instance.post(route, payload);
}

function put<T, R = ApiResponse<T>>(route: string, payload?: Obj): Promise<R> {
    return instance.put(route, payload);
}

function patch<T, R = ApiResponse<T>>(
    route: string,
    payload?: Obj
): Promise<R> {
    return instance.patch(route, payload);
}

function del<T, R = ApiResponse<T>>(route: string): Promise<R> {
    return instance.delete(route);
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
export { del, get, patch, post, put, upload };
