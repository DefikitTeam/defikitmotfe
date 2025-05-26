export interface TwitterUser {
  twitterId: string;
  twitterUsername: string;
  twitterName: string;
  twitterProfileImage: string;
}

export interface TwitterAuthResponse {
  success: boolean;
  twitter?: TwitterUser;
  error?: string;
}

export interface UserState {
  twitter: TwitterUser | null;
  isLoading: boolean;
  error: string | null;
}
