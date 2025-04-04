import { useState, useCallback } from 'react';

interface AdminHook {
  isAdmin: boolean;
  isModalOpen: boolean;
  error: string | null;
  openModal: () => void;
  closeModal: () => void;
  verifyPassword: (password: string) => Promise<boolean>;
  logout: () => void;
}

const ADMIN_PASSWORD = 'rkdtks34?'; // 실제 구현시 환경 변수나 서버에서 관리
const ADMIN_TOKEN_KEY = 'adminToken';

export function useAdmin(): AdminHook {
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    const token = localStorage.getItem(ADMIN_TOKEN_KEY);
    return token === 'true';
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openModal = useCallback(() => {
    setIsModalOpen(true);
    setError(null);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setError(null);
  }, []);

  const verifyPassword = useCallback(async (password: string): Promise<boolean> => {
    try {
      if (password === ADMIN_PASSWORD) {
        localStorage.setItem(ADMIN_TOKEN_KEY, 'true');
        setIsAdmin(true);
        setError(null);
        closeModal();
        return true;
      } else {
        setError('잘못된 비밀번호입니다.');
        return false;
      }
    } catch (error) {
      console.error('관리자 인증 중 오류 발생:', error);
      setError('인증 중 오류가 발생했습니다.');
      return false;
    }
  }, [closeModal]);

  const logout = useCallback(() => {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    setIsAdmin(false);
  }, []);

  return {
    isAdmin,
    isModalOpen,
    error,
    openModal,
    closeModal,
    verifyPassword,
    logout
  };
}

export default useAdmin; 