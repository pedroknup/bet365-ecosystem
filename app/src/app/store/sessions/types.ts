
export interface Session {
  token: string;
  deviceId: string;
}

export interface ISessionState {
  token: string;
  isLoading: boolean;
  errorMsg: string;
  instagramId?: string;
  facebookId?: string;
  FBToken?: string;
  IGToken?: string;
  email?: string;
  password?: string;
}

export interface SessionGroup {
  startTime: string;
  sessions: Session[];
}
