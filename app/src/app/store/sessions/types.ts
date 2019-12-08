
export interface Session {
  token: string;
  deviceId: string;
}

export interface SessionState {
  token: string;
  deviceId: string;
  isLoading: boolean;
  errorMsg: string;
  instagramId?: string;
  facebookId?: string;
  FBToken?: string;
  IGToken?: string;
  passwordSession?: string;
}

export interface SessionGroup {
  startTime: string;
  sessions: Session[];
}
