import { ConfigService } from '@/src/config/services/config-service';
import axios from 'axios';
const config = ConfigService.getInstance();

const serviceNotification = {
    getAllNotifications: async (address: string, chainId: string) => {
        let res;
        try {
            res = await axios.get(
                `${config.getApiConfig().baseUrl}/c/${chainId}/notification/t/${address}`
            );
        } catch (error) {
            // console.log('=========== GET faucet error: ', error);
        }
        if (res && res.status === 200) {
            return res.data;
        }
        return '';
    },
    markNotificationAsRead: async (chainId: string, notificationId: number) => {
        let res;
        try {
            res = await axios.post(
                `${config.getApiConfig().baseUrl}/c/${chainId}/n/${notificationId}`
            );
        } catch (error) {
            // console.log('=========== GET faucet error: ', error);
        }
        if (res && res.status === 200) {
            return res.data;
        }
        return '';
    },
    markAllNotificationAsRead: async (address: string, chainId: string) => {
        let res;
        try {
            res = await axios.post(
                `${config.getApiConfig().baseUrl}/c/${chainId}/notification/t/${address}`
            );
        } catch (error) {
            // console.log('=========== GET faucet error: ', error);
        }
        if (res && res.status === 200) {
            return res.data;
        }
        return '';
    }
};

export default serviceNotification;
