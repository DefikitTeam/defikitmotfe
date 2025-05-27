export interface IRequestBodyAuthTelePayload {
  auth: {
    id: number;
    first_name: string;
    username: string;
    auth_date: number;
    hash: string;
    last_name: string;
  };
  wallet: {
    address: string;
    chainId: number;
  };
}
