import axios from 'axios';
const isProd = process.env.NODE_ENV === 'production';
export const instance = axios.create({
  baseURL: isProd
    ? process.env.NEXT_PUBLIC_API_ENDPOINT_PROD
    : process.env.NEXT_PUBLIC_API_ENDPOINT,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
});
