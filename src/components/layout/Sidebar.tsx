'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { getMenuPermissions, isAdmin } from '@/lib/authUtils';
import { ROLE_LABELS } from '@/lib/usersData';

// ── 아이콘 ──────────────────────────────────────────────────────────────────

function IconDashboard() {
  return (
    <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
      <path d="M2 4a1 1 0 011-1h5a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1V4zm8 0a1 1 0 011-1h5a1 1 0 011 1v2a1 1 0 01-1 1h-5a1 1 0 01-1-1V4zm0 7a1 1 0 011-1h5a1 1 0 011 1v5a1 1 0 01-1 1h-5a1 1 0 01-1-1v-5zM2 13a1 1 0 011-1h5a1 1 0 011 1v3a1 1 0 01-1 1H3a1 1 0 01-1-1v-3z" />
    </svg>
  );
}

function IconFolder() {
  return (
    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
    </svg>
  );
}

function IconShield() {
  return (
    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  );
}

function IconRefresh() {
  return (
    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  );
}

function IconTag() {
  return (
    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
    </svg>
  );
}

function IconUsers() {
  return (
    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function IconCog() {
  return (
    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function IconChevronDown({ open }: { open: boolean }) {
  return (
    <svg
      className={`w-3.5 h-3.5 flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      strokeWidth={2.5}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );
}

// ── 타입 ────────────────────────────────────────────────────────────────────

interface SubItem {
  id: string;
  label: string;
  path: string;
  badge?: number;
  permKey?: string;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
  permKey?: string;
  children?: SubItem[];
}

// ── 메인 컴포넌트 ──────────────────────────────────────────────────────────

export default function Sidebar() {
  const pathname = usePathname();
  const { currentUser, logout } = useAuth();

  const menuPerms = getMenuPermissions(currentUser);
  const admin = !!currentUser?.isAdmin;

  // ── 문서관리 서브메뉴 ──────────────────────────────────────────────────
  // 모든 활성 사용자는 신규 등록 포함 문서관리 전체 메뉴 이용 가능
  const docChildren: SubItem[] = [
    { id: 'doc-list',      label: '전체 문서',      path: '/documents' },
    { id: 'doc-new',       label: '신규 문서 등록', path: '/documents/new' },
    { id: 'doc-mine',      label: '내 문서함',      path: '/documents/my' },
    { id: 'doc-favorites', label: '즐겨찾기',       path: '/documents/favorites' },
    { id: 'doc-trash',     label: '휴지통',         path: '/documents/trash' },
  ];

  // ── 결재관리 서브메뉴 ──────────────────────────────────────────────────
  const approvalChildren: SubItem[] = [
    { id: 'apv-waiting',   label: '결재 대기',  path: '/approvals',           badge: 7 },
    { id: 'apv-requested', label: '요청 문서',  path: '/approvals/requested' },
    { id: 'apv-history',   label: '승인 이력',  path: '/approvals/history' },
  ];

  // ── 개정관리 서브메뉴 ──────────────────────────────────────────────────
  const revisionChildren: SubItem[] = [
    { id: 'rev-pending',      label: '개정 대기',   path: '/revisions',              badge: 5 },
    { id: 'rev-in-progress',  label: '개정 진행중', path: '/revisions/in-progress' },
    { id: 'rev-completed',    label: '개정 완료',   path: '/revisions/completed' },
    { id: 'rev-history',      label: '개정 이력',   path: '/revisions/history' },
  ];

  // ── 문서분류 서브메뉴 ──────────────────────────────────────────────────
  const categoryChildren: SubItem[] = [
    { id: 'cat-manage',  label: '문서 분류 관리', path: '/categories' },
    { id: 'cat-folders', label: '폴더 관리',      path: '/categories/folders' },
  ];

  // ── 사용자관리 서브메뉴 ───────────────────────────────────────────────
  const userChildren: SubItem[] = [
    { id: 'usr-list',  label: '사용자 목록', path: '/system/users' },
    { id: 'usr-perms', label: '권한 관리',   path: '/system/permissions' },
  ];

  // ── 시스템설정 서브메뉴 ───────────────────────────────────────────────
  const settingsChildren: SubItem[] = [
    { id: 'sys-orgs',    label: '조직 관리',     path: '/system/organizations' },
    { id: 'sys-dtypes',  label: '문서유형 관리', path: '/system/document-types' },
    { id: 'sys-dcats',   label: '문서분류 관리', path: '/system/document-categories' },
    { id: 'sys-codes',   label: '공통코드 관리', path: '/system/common-codes' },
    { id: 'sys-apv',     label: '결재설정',       path: '/system/approval-settings' },
  ];

  // ── 전체 메뉴 정의 ────────────────────────────────────────────────────
  const allMenuItems: (MenuItem & { show: boolean })[] = [
    {
      id: 'dashboard',
      label: '대시보드',
      path: '/',
      icon: <IconDashboard />,
      show: true,
    },
    {
      id: 'docs',
      label: '문서관리',
      path: '/documents',
      icon: <IconFolder />,
      show: !!currentUser?.isActive,
      children: docChildren,
    },
    {
      id: 'approval',
      label: '결재관리',
      path: '/approvals',
      icon: <IconShield />,
      show: !!currentUser?.isActive,
      children: approvalChildren,
    },
    {
      id: 'revision',
      label: '개정관리',
      path: '/revisions',
      icon: <IconRefresh />,
      show: !!currentUser?.isActive,
      children: revisionChildren,
    },
    {
      id: 'categories',
      label: '문서분류',
      path: '/categories',
      icon: <IconTag />,
      show: !!currentUser?.isAdmin,
      children: categoryChildren,
    },
    {
      id: 'users',
      label: '사용자관리',
      path: '/system/users',
      icon: <IconUsers />,
      show: !!currentUser?.isAdmin,
      children: userChildren,
    },
    {
      id: 'settings',
      label: '시스템설정',
      path: '/system/settings',
      icon: <IconCog />,
      show: !!currentUser?.isAdmin,
      children: settingsChildren,
    },
  ];

  const menuItems = allMenuItems.filter((m) => m.show);

  // ── 초기 확장 그룹 ───────────────────────────────────────────────────
  const getInitialExpanded = () => {
    const expanded: string[] = [];
    if (pathname.startsWith('/documents'))  expanded.push('docs');
    if (pathname.startsWith('/approvals'))  expanded.push('approval');
    if (pathname.startsWith('/revisions'))  expanded.push('revision');
    if (pathname.startsWith('/categories')) expanded.push('categories');
    if (pathname.startsWith('/system/users') || pathname.startsWith('/system/permissions')) {
      expanded.push('users');
    }
    if (
      pathname.startsWith('/system/organizations') ||
      pathname.startsWith('/system/document-types') ||
      pathname.startsWith('/system/document-categories') ||
      pathname.startsWith('/system/common-codes') ||
      pathname.startsWith('/system/approval-settings') ||
      pathname === '/system/settings'
    ) {
      expanded.push('settings');
    }
    return expanded;
  };

  const [expandedItems, setExpandedItems] = useState<string[]>(getInitialExpanded);

  useEffect(() => {
    const autoExpand = (prefix: string, id: string) => {
      if (pathname.startsWith(prefix)) {
        setExpandedItems((prev) => prev.includes(id) ? prev : [...prev, id]);
      }
    };
    autoExpand('/documents', 'docs');
    autoExpand('/approvals', 'approval');
    autoExpand('/revisions', 'revision');
    autoExpand('/categories', 'categories');
    if (pathname.startsWith('/system/users') || pathname.startsWith('/system/permissions')) {
      setExpandedItems((prev) => prev.includes('users') ? prev : [...prev, 'users']);
    }
    if (
      pathname.startsWith('/system/organizations') ||
      pathname.startsWith('/system/document-types') ||
      pathname.startsWith('/system/document-categories') ||
      pathname.startsWith('/system/common-codes') ||
      pathname.startsWith('/system/approval-settings') ||
      pathname === '/system/settings'
    ) {
      setExpandedItems((prev) => prev.includes('settings') ? prev : [...prev, 'settings']);
    }
  }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Active 판단 ──────────────────────────────────────────────────────
  /** 그룹 레벨: 접두사 매칭 */
  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname === path || pathname.startsWith(path + '/');
  };

  /** 자식 아이템: 정확한 경로 매칭 */
  const isChildActive = (childPath: string) => {
    if (childPath === '/') return pathname === '/';
    return pathname === childPath;
  };

  const isGroupActive = (item: MenuItem) => {
    if (!item.children) return isActive(item.path);
    return isActive(item.path) || (item.children?.some((c) => isActive(c.path)) ?? false);
  };

  const toggleExpand = (id: string) => {
    setExpandedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const storageUsed = 152;
  const storageTotal = 500;
  const storagePercent = Math.round((storageUsed / storageTotal) * 100);

  return (
    <aside className="w-[220px] flex-shrink-0 bg-[#1a2744] flex flex-col h-full overflow-hidden">

      {/* ── 로고 ────────────────────────────────────────────────────── */}
      <div className="px-4 py-4 border-b border-[#253561]">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-blue-500 rounded-md flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <div className="text-white font-bold text-sm leading-tight">DMS</div>
            <div className="text-blue-300 text-[10px] leading-tight">전자문서관리시스템</div>
          </div>
        </div>
      </div>

      {/* ── 네비게이션 ─────────────────────────────────────────────── */}
      <nav className="flex-1 overflow-y-auto scrollbar-hide py-2">
        {menuItems.map((item) => {
          const isExpanded = expandedItems.includes(item.id);
          const hasChildren = !!(item.children && item.children.length > 0);
          const active = isGroupActive(item);

          return (
            <div key={item.id}>
              {hasChildren ? (
                <button
                  onClick={() => toggleExpand(item.id)}
                  className={[
                    'w-full flex items-center gap-2.5 py-2.5 text-left transition-all duration-200',
                    active
                      ? 'bg-blue-600 text-white border-l-[3px] border-blue-300 pl-[13px] pr-4'
                      : 'text-slate-300 hover:bg-[#1e3155] hover:text-white border-l-[3px] border-transparent px-4',
                  ].join(' ')}
                >
                  <span className={active ? 'text-white' : 'text-slate-400'}>{item.icon}</span>
                  <span className="flex-1 text-sm font-medium">{item.label}</span>
                  <span className={active ? 'text-blue-200' : 'text-slate-500'}>
                    <IconChevronDown open={isExpanded} />
                  </span>
                </button>
              ) : (
                <Link
                  href={item.path}
                  className={[
                    'flex items-center gap-2.5 py-2.5 transition-all duration-200',
                    active
                      ? 'bg-blue-600 text-white border-l-[3px] border-blue-300 pl-[13px] pr-4'
                      : 'text-slate-300 hover:bg-[#1e3155] hover:text-white border-l-[3px] border-transparent px-4',
                  ].join(' ')}
                >
                  <span className={active ? 'text-white' : 'text-slate-400'}>{item.icon}</span>
                  <span className="flex-1 text-sm font-medium">{item.label}</span>
                </Link>
              )}

              {/* 서브메뉴 */}
              {hasChildren && isExpanded && (
                <div className="bg-[#111d30]">
                  {item.children!.map((child) => {
                    const childActive = isChildActive(child.path);
                    return (
                      <Link
                        key={child.id}
                        href={child.path}
                        className={[
                          'flex items-center gap-2 py-2 pl-[46px] pr-4 transition-all duration-150',
                          childActive
                            ? 'text-blue-300 bg-[#1a2c4a] border-l-[3px] border-blue-400'
                            : 'text-slate-400 hover:text-blue-300 hover:bg-[#1a2c4a] border-l-[3px] border-transparent',
                        ].join(' ')}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${childActive ? 'bg-blue-400' : 'bg-slate-600'}`} />
                        <span className="flex-1 text-[11px] font-medium">{child.label}</span>
                        {child.badge !== undefined && (
                          <span className="min-w-[18px] h-[18px] px-1 bg-orange-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center leading-none">
                            {child.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* ── 저장공간 ─────────────────────────────────────────────────── */}
      <div className="px-4 py-3 border-t border-[#253561]">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs text-slate-400 font-medium">저장공간</span>
          <button className="text-[10px] text-blue-400 hover:text-blue-300">상세보기</button>
        </div>
        <div className="w-full bg-[#253561] rounded-full h-1.5 mb-1">
          <div
            className="bg-blue-500 h-1.5 rounded-full transition-all"
            style={{ width: `${storagePercent}%` }}
          />
        </div>
        <div className="flex justify-between">
          <span className="text-[11px] text-slate-300 font-medium">
            {storageUsed} GB / {storageTotal} GB
          </span>
          <span className="text-[10px] text-slate-400">{storagePercent}% 사용</span>
        </div>
      </div>

      {/* ── 사용자 정보 ───────────────────────────────────────────────── */}
      <div className="px-4 py-3 border-t border-[#253561]">
        <div className="flex items-center gap-2.5 mb-2">
          <div className={`w-8 h-8 rounded-full ${currentUser?.avatarColor ?? 'bg-blue-500'} flex items-center justify-center flex-shrink-0`}>
            <span className="text-white text-xs font-bold">{currentUser?.avatarInitials ?? '?'}</span>
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="text-white text-sm font-medium leading-tight">{currentUser?.name ?? '사용자'}</span>
              {admin && (
                <span className="px-1 py-px text-[8px] font-bold bg-red-500/30 text-red-300 rounded leading-none">ADMIN</span>
              )}
            </div>
            <div className="text-slate-400 text-[10px] leading-tight">
              {currentUser?.departmentName ?? ''} · {currentUser ? ROLE_LABELS[currentUser.role] : ''}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 flex-shrink-0" />
            <span className="text-green-400 text-[10px]">온라인</span>
          </div>
          <button
            onClick={logout}
            className="text-[10px] text-slate-400 hover:text-white transition-colors"
          >
            로그아웃
          </button>
        </div>
      </div>

      <div className="px-4 py-2 border-t border-[#253561]">
        <p className="text-[9px] text-slate-500 text-center">© 2025 DH2 Co., Ltd.</p>
      </div>
    </aside>
  );
}
