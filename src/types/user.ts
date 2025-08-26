export type UserRole = 'admin' | 'member';

export interface UserProfile {
  id: string;
  role: UserRole;
}

export interface UserState {
  isAdmin: boolean;
  profile?: UserProfile;
}
