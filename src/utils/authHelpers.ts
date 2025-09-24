import { User } from '@/services/api';

export interface Profile {
  id: string;
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
}

// Helper function to create profile from user data
export const createProfileFromUser = (user: User): Profile => {
  return {
    id: user.id,
    user_id: user.id,
    display_name: user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.email.split('@')[0],
    avatar_url: null
  };
};
