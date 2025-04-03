import { useState, useEffect } from 'react';
import { User } from '../types';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = (password: string): Promise<boolean> => {
    return new Promise((resolve) => {
      // 실제 구현에서는 서버에서 검증해야 합니다
      if (password === 'admin') {
        const user: User = {
          id: 'admin',
          isAdmin: true
        };
        localStorage.setItem('currentUser', JSON.stringify(user));
        setUser(user);
        resolve(true);
      } else {
        resolve(false);
      }
    });
  };

  const logout = () => {
    localStorage.removeItem('currentUser');
    setUser(null);
  };

  const isOwner = (userId: string) => {
    return user?.id === userId || user?.isAdmin;
  };

  return {
    user,
    login,
    logout,
    isOwner,
    isLoggedIn: !!user
  };
} 