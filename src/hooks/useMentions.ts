
import { useState, useEffect } from 'react';

export interface User {
  id: string;
  name: string;
  avatar: string;
}

// Mock user data - in a real app, this would come from your database
const mockUsers: User[] = [
  { id: '1', name: 'Richie Matthews', avatar: 'RM' },
  { id: '2', name: 'Sarah Johnson', avatar: 'SJ' },
  { id: '3', name: 'Mike Chen', avatar: 'MC' },
  { id: '4', name: 'Lisa Rodriguez', avatar: 'LR' },
  { id: '5', name: 'David Kim', avatar: 'DK' },
  { id: '6', name: 'You', avatar: 'YU' },
];

export const useMentions = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);

  useEffect(() => {
    // In a real app, you would fetch users from your database
    setUsers(mockUsers);
  }, []);

  const filterUsers = (query: string) => {
    if (!query) {
      setFilteredUsers([]);
      return;
    }
    
    const filtered = users.filter(user =>
      user.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  return {
    users,
    filteredUsers,
    filterUsers,
  };
};
