'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { getMenuPermissions, isAdmin } from '@/lib/authUtils';
import { ROLE_LABELS } from '@/lib/usersData';

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

function IconRefresh() {
  return (
    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
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

function IconBook() {
  return (
    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  );
}

function IconClipboard() {
  return (
    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
    </svg>
  );
}

function IconSearch() {
  return (
    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );
}

function IconChart() {
  return (
    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
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

interface SubItem {
  id: string;
  label: string;
  path: string;
  permKey?: string; // getMenuPermissions 결과에서 사용하는 키
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
  permKey?: string;
  children?: SubItem[];
}

export default function Sidebar() {
  const pathname = usePathname();
  const { currentUser, logout } = useAuth();

  const menuPerms = getMenuPermissions(currentUser);
  const admin = isAdmin(currentUser);

  // 권한에 따른 문서관리 서브메뉴 필터링
  const docChildren: SubItem[] = [
    { id: 'doc-list',     label: '문서목록',      path: '/documents',         permKey: 'documentView' },
    { id: 'doc-new',      label: '신규문서 등록', path: '/documents/new',     permKey: 'documentCreate' },
    { id: 'doc-approval', label: '결재문서함',    path: '/documents/approval', permKey: 'documentApprovalInbox' },
    { id: 'doc-mine',     label: '내 문서함',     path: '/documents/my',      permKey: 'documentView' },
  ].filter((item) => !item.permKey || menuPerms[item.permKey as keyof typeof menuPerms]);

  const allMenuItems: (MenuItem & { show: boolean })[] = [
    { id: 'dashboard',   label: '대시보드',   path: '/',           icon: <IconDashboard />, show: true },
    {
      id: 'docs',
      label: '문서관리',
      path: '/documents',
      icon: <IconFolder />,
      show: menuPerms.documentView,
      children: docChildren,
    },
    { id: 'revision',   label: '개정관리',   path: '/revisions',  icon: <IconRefresh />,   show: menuPerms.revisionView },
    { id: 'approval',   label: '승인관리',   path: '/approvals',  icon: <IconShield />,    show: menuPerms.approvalView },
    { id: 'training',   label: '교육훈련',   path: '/training',   icon: <IconBook />,      show: menuPerms.trainingView },
    { id: 'records',    label: '기록관리',   path: '/records',    icon: <IconClipboard />, show: menuPerms.recordsView },
    { id: 'inspection', label: '검사',       path: '/inspection', icon: <IconSearch />,    show: menuPerms.recordsView },
    { id: 'reports',    label: '보고서',     path: '/reports',    icon: <IconChart />,     show: menuPerms.reportsView },
    {
      id: 'system',
      label: '시스템관리',
      path: '/system/users',
      icon: <IconCog />,
      show: menuPerms.systemManage,
      children: [
        { id: 'sys-users', label: '사용자 관리', path: '/system/users', permKey: 'userManage' },
      ].filter((item) => !item.permKey || menuPerms[item.permKey as keyof typeof menuPerms]),
    },
  ];

  const menuItems = allMenuItems.filter((m) => m.show);

  /** 현재 경로에 맞게 초기 확장 항목 설정 */
  const getInitialExpanded = () => {
    const expanded: string[] = [];
    if (pathname.startsWith('/documents')) expanded.push('docs');
    if (pathname.startsWith('/system'))    expanded.push('system');
    return expanded;
  };

  const [expandedItems, setExpandedItems] = useState<string[]>(getInitialExpanded);

  useEffect(() => {
    if (pathname.startsWith('/documents') && !expandedItems.includes('docs')) {
      setExpandedItems((prev) => [...prev, 'docs']);
    }
    if (pathname.startsWith('/system') && !expandedItems.includes('system')) {
      setExpandedItems((prev) => [...prev, 'system']);
    }
  }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    // /system/users 는 /system 계열 전체를 커버
    if (path === '/system/users') return pathname.startsWith('/system');
    return pathname === path || pathname.startsWith(path + '/');
  };

  const isGroupActive = (item: MenuItem) => {
    if (isActive(item.path)) return true;
    return item.children?.some((c) => isActive(c.path)) ?? false;
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
      {/* Logo */}
      <div className="px-4 py-4 border-b border-[#253561]">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-blue-500 rounded-md flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <div className="text-white font-bold text-sm leading-tight">QMS</div>
            <div className="text-blue-300 text-[10px] leading-tight">품질관리시스템</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
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

              {hasChildren && isExpanded && (
                <div className="bg-[#111d30]">
                  {item.children!.map((child) => {
                    const childActive = isActive(child.path);
                    return (
                      <Link
                        key={child.id}
                        href={child.path}
                        className={[
                          'flex items-center gap-2 py-2 pl-[52px] pr-4 transition-all duration-150',
                          childActive
                            ? 'text-blue-300 bg-[#1a2c4a] border-l-[3px] border-blue-400'
                            : 'text-slate-400 hover:text-blue-300 hover:bg-[#1a2c4a] border-l-[3px] border-transparent',
                        ].join(' ')}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${childActive ? 'bg-blue-400' : 'bg-slate-600'}`} />
                        <span className="text-[11px] font-medium">{child.label}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Storage */}
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

      {/* User */}
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
        <p className="text-[9px] text-slate-500 text-center">© 2024 DH2 Co., Ltd.</p>
      </div>
    </aside>
  );
}
