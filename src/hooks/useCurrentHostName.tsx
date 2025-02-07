/* eslint-disable */
'use client'
import { hostNames } from '../common/constant/constance';
export interface IHostNameInfo {
    name: string;
    url: string;
}

const useCurrentHostNameInformation = (): IHostNameInfo => {
    if (typeof window === 'undefined') {
        return hostNames[0];
    }

    const currentHostName = window.location.hostname;

    const matchingHost = hostNames.find((host) => host.url === currentHostName);

    return matchingHost || hostNames[0];
};
export default useCurrentHostNameInformation;
