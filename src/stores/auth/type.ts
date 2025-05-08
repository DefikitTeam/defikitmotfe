import { EActionStatus } from '../type';

export interface IAuthState {
    errorMessage: string;
    errorCode: string;
    signature: string | null;
    statusLoginWallet: EActionStatus;
    statusLoginTele: EActionStatus;
    statusLoginTwitter: EActionStatus;
    statusLoginDiscord: EActionStatus;
    userInfo: IDataUserLoginResponse | null;
    userTele: ILoginTeleResponse | null;
    userWallet: ILoginWalletResponse | null;
    userTwitter: ILoginTwitterResponse | null;
    userDiscord: ILoginDiscordResponse | null;
    accessToken: string | null;
    refreshToken: string | null;
    openModalInviteBlocker: boolean;
}

export interface IAccount {
    status?: string;
    auth: any;
    botName?: string;
    wallet: {
        address: string;
        chainId: number;
    };
}

export interface ILoginRequest {
    tele?: {
        auth: any;
        botName?: string;
    };
    wallet?: {
        chainId: number | null;
        address: string | null;
        message: string | null;
        signature: string | null;
        refId: string | null;
    };
    twitter?: {
        twitterId: string | null;
        twitterUsername: string | null;
        twitterName: string | null;
        twitterProfileImage: string | null;
    };
    discord?: {
        discordId: string | null;
        discordUsername: string | null;
        discordEmail: string | null;
        discordAvatar: string | null;
        verified: boolean | null;
        globalName: string | null;
        locale: string | null;
    };
    referralCode: string;
}

export interface ILoginResponse {
    user?: IDataUserLoginResponse | null;
    tele?: ILoginTeleResponse | null;
    wallet?: ILoginWalletResponse | null;
    twitter?: ILoginTwitterResponse | null;
    discord?: ILoginDiscordResponse | null;
    accessToken: string | null;
    refreshToken: string | null;
}

export interface IDataUserLoginResponse {
    id: number | null;
    firstName: string | null;
    lastName: string | null;
    username: string | null;
    language: string | null;
    telegramUserId: bigint | null;
    wallet: string | null;
    refId: string | null;
    referrer: string | null;
    chainId: number | null;
    connectedWallet: string | null;
}
export interface ILoginTeleResponse {
    botName: string | null;
    auth: any;
}

export interface ILoginWalletResponse {
    chainId: number | null;
    address: string | null;
    message: string | null;
    signature: string | null;
    refId: string | null;
}

export interface ILoginTwitterResponse {
    twitterId: string | null;
    twitterUsername: string | null;
    twitterName: string | null;
    twitterProfileImage: string | null;
}

export interface ILoginDiscordResponse {
    discordId: string | null;
    discordUsername: string | null;
    discordEmail: string | null;
    discordAvatar: string | null;
}

export interface ISignature {
    signature: string | null;
}

export interface ICheckAccessTokenResponse {
    success: boolean;
    message: string;
}
