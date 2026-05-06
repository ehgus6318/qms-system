'use client';

// ─────────────────────────────────────────────────────────────────────────────
// src/context/AuthContext.tsx
// Mock 인증 컨텍스트 (localStorage 기반)
// 향후 NextAuth useSession()으로 교체 가능하도록 설계
// ─────────────────────────────────────────────────────────────────────────────

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import { useRouter } from 'next/navigation';
import { USERS, getUserById, type User } from '@/lib/usersData';

const STORAGE_KEY = 'qms_current_user_id';
const DEFAULT_USER_ID = 'U001'; // 개발 기본값

// ── 컨텍스트 타입 ────────────────────────────────────────────────────────────

interface AuthContextValue {
  currentUser: User | null;
  isLoading: boolean;
  login: (userId: string) => void;
  logout: () => void;
  /** 향후 NextAuth session으로 교체 시 이 getter만 변경 */
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// ── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /** 앱 시작 시 localStorage에서 사용자 복원 */
  useEffect(() => {
    try {
      const savedId = localStorage.getItem(STORAGE_KEY);
      const id = savedId ?? DEFAULT_USER_ID;
      const user = getUserById(id);
      if (user && user.isActive) {
        setCurrentUser(user);
      } else {
        // 유효하지 않은 ID면 기본 사용자로 폴백
        const fallback = getUserById(DEFAULT_USER_ID);
        setCurrentUser(fallback ?? null);
        localStorage.setItem(STORAGE_KEY, DEFAULT_USER_ID);
      }
    } catch {
      // localStorage 사용 불가 환경 (SSR 등)
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback((userId: string) => {
    const user = getUserById(userId);
    if (!user || !user.isActive) return;
    setCurrentUser(user);
    try {
      localStorage.setItem(STORAGE_KEY, userId);
    } catch { /* ignore */ }
    router.push('/');
  }, [router]);

  const logout = useCallback(() => {
    setCurrentUser(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch { /* ignore */ }
    router.push('/login');
  }, [router]);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isLoading,
        login,
        logout,
        isAuthenticated: currentUser !== null,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ── Hook ─────────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

// ── 편의 export ──────────────────────────────────────────────────────────────

export { USERS };
