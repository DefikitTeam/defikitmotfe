export interface DiscordUser {
  discordId: string;
  discordUsername: string;
  discordName: string;
  discordProfileImage: string;
  discordAvatar: string;
  discordEmail: string;
  verified: string;
  globalName: string;
  locale: string;
}

export interface DiscordAuthResponse {
  success: boolean;
  discord?: DiscordUser;
  error?: string;
}

export interface DiscordUserState {
  discord: DiscordUser | null;
  isLoading: boolean;
  error: string | null;
}
