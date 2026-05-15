'use client';

// ─────────────────────────────────────────────────────────────────────────────
// src/components/auth/LoginClient.tsx
// 기업용 DMS 로그인 화면 (Mock Auth)
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { USERS, ROLE_LABELS, ROLE_COLORS, type User } from '@/lib/usersData';

export default function LoginClient() {
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedQuickUser, setSelectedQuickUser] = useState<string | null>(null);

  // ── 폼 로그인 ────────────────────────────────────────────────────────────

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    await new Promise((r) => setTimeout(r, 600)); // 실제 API 느낌

    const user = USERS.find((u) => u.email === email.trim() && u.isActive);
    if (!user) {
      setError('이메일 또는 비밀번호가 올바르지 않습니다.');
      setIsLoading(false);
      return;
    }
    // Mock: 비밀번호 검증 생략 (password123 으로 통일)
    if (password !== 'password123') {
      setError('이메일 또는 비밀번호가 올바르지 않습니다.');
      setIsLoading(false);
      return;
    }

    login(user.id);
  };

  // ── 빠른 사용자 선택 ─────────────────────────────────────────────────────

  const handleQuickLogin = async (user: User) => {
    setSelectedQuickUser(user.id);
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    login(user.id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center p-4">
      {/* 배경 장식 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-600/20 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* 로고 & 헤더 */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-600 rounded-2xl shadow-xl shadow-blue-900/50 mb-4">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white">DMS 전자문서관리시스템</h1>
          <p className="text-blue-300/70 text-sm mt-1">Document Management System</p>
        </div>

        {/* 로그인 카드 */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 shadow-2xl">
          <h2 className="text-lg font-semibold text-white mb-6">로그인</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* 이메일 */}
            <div>
              <label className="block text-xs font-medium text-blue-200/70 mb-1.5">
                이메일
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="이메일 주소 입력"
                required
                className="w-full px-3.5 py-2.5 bg-white/10 border border-white/20 rounded-lg text-sm text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
              />
            </div>

            {/* 비밀번호 */}
            <div>
              <label className="block text-xs font-medium text-blue-200/70 mb-1.5">
                비밀번호
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="비밀번호 입력"
                  required
                  className="w-full px-3.5 py-2.5 pr-10 bg-white/10 border border-white/20 rounded-lg text-sm text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                >
                  {showPassword ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* 에러 메시지 */}
            {error && (
              <div className="flex items-center gap-2 px-3 py-2.5 bg-red-500/20 border border-red-500/30 rounded-lg">
                <svg className="w-4 h-4 text-red-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span className="text-xs text-red-300">{error}</span>
              </div>
            )}

            {/* 로그인 버튼 */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition-colors shadow-lg shadow-blue-900/50 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  로그인 중...
                </>
              ) : (
                '로그인'
              )}
            </button>
          </form>

          {/* 구분선 */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-white/30">테스트 계정으로 빠른 접속</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* 테스트 사용자 빠른 선택 */}
          <div className="space-y-2">
            {USERS.filter((u) => u.isActive).map((user) => (
              <button
                key={user.id}
                onClick={() => handleQuickLogin(user)}
                disabled={isLoading}
                className={[
                  'w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg border transition-all text-left',
                  selectedQuickUser === user.id
                    ? 'border-blue-500/60 bg-blue-600/30'
                    : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20',
                  isLoading ? 'opacity-60 cursor-not-allowed' : '',
                ].join(' ')}
              >
                {/* 아바타 */}
                <div
                  className={`w-8 h-8 rounded-full ${user.avatarColor} flex items-center justify-center flex-shrink-0 shadow`}
                >
                  <span className="text-white text-xs font-bold">{user.avatarInitials}</span>
                </div>

                {/* 사용자 정보 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-white">{user.name}</span>
                    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${ROLE_COLORS[user.role]}`}>
                      {ROLE_LABELS[user.role]}
                    </span>
                  </div>
                  <div className="text-[11px] text-white/40 truncate">
                    {user.departmentName} · {user.position} · {user.email}
                  </div>
                </div>

                {/* 선택 아이콘 */}
                {selectedQuickUser === user.id ? (
                  <svg className="w-4 h-4 text-blue-400 flex-shrink-0 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 text-white/20 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                )}
              </button>
            ))}
          </div>

          {/* 힌트 */}
          <p className="mt-5 text-center text-[11px] text-white/25">
            폼 로그인 시 비밀번호: <span className="text-white/40 font-mono">password123</span>
          </p>
        </div>

        {/* 푸터 */}
        <p className="text-center text-[11px] text-white/20 mt-6">
          © 2025 DH2 Co., Ltd. · DMS v1.0
        </p>
      </div>
    </div>
  );
}
