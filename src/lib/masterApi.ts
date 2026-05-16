// ─────────────────────────────────────────────────────────────────────────────
// src/lib/masterApi.ts
// 마스터 관리 API 헬퍼 (클라이언트 컴포넌트 전용)
// 각 함수는 API 실패 시 빈 배열을 반환 → 호출부에서 fallback 처리
// ─────────────────────────────────────────────────────────────────────────────

// ── API 응답 타입 ──────────────────────────────────────────────────────────────

export interface ApiDept {
  id: string;
  name: string;
  code: string;
  parentId: string | null;
  isActive: boolean;
  order: number;
}

export interface ApiDocType {
  id: string;
  code: string;
  name: string;
  prefix: string | null;
  description: string | null;
  order: number;
  isActive: boolean;
}

export interface ApiCategory {
  id: string;
  label: string;
  code: string | null;
  parentId: string | null;
  isActive: boolean;
  order: number;
}

export interface ApiCommonCode {
  id: string;
  code: string;
  name: string;
  description: string | null;
  order: number;
  isActive: boolean;
}

export interface ApiTemplateStep {
  id: string;
  stepOrder: number;
  role: string;
  assigneeType: string;
  isRequired: boolean;
}

export interface ApiApprovalTemplate {
  id: string;
  name: string;
  description: string | null;
  isDefault: boolean;
  allowFreeSelection: boolean;
  allowSelfApproval: boolean;
  isActive: boolean;
  steps: ApiTemplateStep[];
}

// ── Fetch 헬퍼 ────────────────────────────────────────────────────────────────

async function safeFetch<T>(url: string): Promise<T[]> {
  try {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return [];
    return (await res.json()) as T[];
  } catch {
    return [];
  }
}

/** 활성 부서 목록 */
export async function fetchDepts(): Promise<ApiDept[]> {
  return safeFetch<ApiDept>('/api/system/organizations?includeInactive=false');
}

/** 활성 문서유형 목록 */
export async function fetchDocTypes(): Promise<ApiDocType[]> {
  return safeFetch<ApiDocType>('/api/system/document-types?includeInactive=false');
}

/** 활성 문서분류 목록 (플랫) */
export async function fetchCategories(): Promise<ApiCategory[]> {
  return safeFetch<ApiCategory>('/api/system/document-categories?includeInactive=false');
}

/** 특정 그룹의 활성 공통코드 목록 */
export async function fetchCommonCodes(groupCode: string): Promise<ApiCommonCode[]> {
  try {
    const res = await fetch(
      `/api/system/common-codes?group=${encodeURIComponent(groupCode)}&includeInactive=false`,
      { cache: 'no-store' },
    );
    if (!res.ok) return [];
    const groups = (await res.json()) as Array<{ codes: ApiCommonCode[] }>;
    return groups[0]?.codes ?? [];
  } catch {
    return [];
  }
}

/** 활성 결재 템플릿 목록 */
export async function fetchApprovalTemplates(): Promise<ApiApprovalTemplate[]> {
  return safeFetch<ApiApprovalTemplate>('/api/system/approval-settings?includeInactive=false');
}

// ── 트리 빌더 ─────────────────────────────────────────────────────────────────

export interface CategoryTreeNode {
  id: string;
  label: string;
  parentId?: string | null;
  children?: CategoryTreeNode[];
}

/**
 * 플랫 분류 목록을 계층 트리로 변환
 * parentId가 없는 항목이 루트, 있는 항목은 해당 루트의 children으로 삽입
 */
export function buildCategoryTree(flat: ApiCategory[]): CategoryTreeNode[] {
  const sorted = [...flat].sort((a, b) => a.order - b.order || a.label.localeCompare(b.label));
  const map: Record<string, CategoryTreeNode> = {};
  const roots: CategoryTreeNode[] = [];

  for (const item of sorted) {
    map[item.id] = { id: item.id, label: item.label, parentId: item.parentId, children: [] };
  }

  for (const item of sorted) {
    if (item.parentId && map[item.parentId]) {
      map[item.parentId].children!.push(map[item.id]);
    } else if (!item.parentId) {
      roots.push(map[item.id]);
    }
  }

  // children 없는 노드는 children 제거
  const cleanup = (node: CategoryTreeNode) => {
    if (!node.children || node.children.length === 0) delete node.children;
    else node.children.forEach(cleanup);
  };
  roots.forEach(cleanup);

  return roots;
}

/** 트리에서 특정 ID의 라벨 경로 찾기 (예: "관리문서 > 절차서") */
export function findCategoryPath(
  tree: CategoryTreeNode[],
  targetId: string,
  prefix = '',
): string {
  for (const node of tree) {
    const current = prefix ? `${prefix} > ${node.label}` : node.label;
    if (node.id === targetId) return current;
    if (node.children) {
      const found = findCategoryPath(node.children, targetId, current);
      if (found) return found;
    }
  }
  return '';
}
