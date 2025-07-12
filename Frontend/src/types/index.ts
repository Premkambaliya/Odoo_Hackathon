export type UserRole = 'user' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  location?: string;
  photoUrl?: string;
  skillsOffered: Skill[];
  skillsWanted: Skill[];
  availability: string[];
  isPublic: boolean;
  role: UserRole;
  createdAt: string;
}

export interface Skill {
  id: string;
  name: string;
  description: string;
}

export interface SwapRequest {
  id: string;
  requesterId: string;
  providerId: string;
  requesterSkillId: string;
  providerSkillId: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  createdAt: string;
}

export interface Feedback {
  id: string;
  swapId: string;
  fromUserId: string;
  toUserId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
}