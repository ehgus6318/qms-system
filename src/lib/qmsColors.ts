/**
 * QMS 통합 상태 색상 시스템
 * 승인→녹색 | 검토→파랑 | 반려→빨강 | 초안→회색
 */

export interface StatusStyle {
  badge: string;   // badge 전체 클래스
  dot: string;     // 상태 dot 색상
  text: string;    // 텍스트 색상
  bg: string;      // 배경색
  ring: string;    // ring 색상 (강조)
}

export const QMS_STATUS: Record<string, StatusStyle> = {
  승인: {
    badge: 'bg-green-100 text-green-700 border border-green-200',
    dot: 'bg-green-500',
    text: 'text-green-700',
    bg: 'bg-green-50',
    ring: 'ring-green-200',
  },
  '검토 중': {
    badge: 'bg-blue-100 text-blue-700 border border-blue-200',
    dot: 'bg-blue-500',
    text: 'text-blue-700',
    bg: 'bg-blue-50',
    ring: 'ring-blue-200',
  },
  검토: {
    badge: 'bg-blue-100 text-blue-700 border border-blue-200',
    dot: 'bg-blue-500',
    text: 'text-blue-700',
    bg: 'bg-blue-50',
    ring: 'ring-blue-200',
  },
  반려: {
    badge: 'bg-red-100 text-red-700 border border-red-200',
    dot: 'bg-red-500',
    text: 'text-red-700',
    bg: 'bg-red-50',
    ring: 'ring-red-200',
  },
  초안: {
    badge: 'bg-gray-100 text-gray-600 border border-gray-200',
    dot: 'bg-gray-400',
    text: 'text-gray-600',
    bg: 'bg-gray-50',
    ring: 'ring-gray-200',
  },
  '결재 대기': {
    badge: 'bg-orange-100 text-orange-700 border border-orange-200',
    dot: 'bg-orange-500',
    text: 'text-orange-700',
    bg: 'bg-orange-50',
    ring: 'ring-orange-200',
  },
  '승인 대기': {
    badge: 'bg-teal-100 text-teal-700 border border-teal-200',
    dot: 'bg-teal-500',
    text: 'text-teal-700',
    bg: 'bg-teal-50',
    ring: 'ring-teal-200',
  },
  '개정 대기': {
    badge: 'bg-purple-100 text-purple-700 border border-purple-200',
    dot: 'bg-purple-500',
    text: 'text-purple-700',
    bg: 'bg-purple-50',
    ring: 'ring-purple-200',
  },
  '검토 요청': {
    badge: 'bg-blue-100 text-blue-700 border border-blue-200',
    dot: 'bg-blue-500',
    text: 'text-blue-700',
    bg: 'bg-blue-50',
    ring: 'ring-blue-200',
  },
  보류: {
    badge: 'bg-yellow-100 text-yellow-700 border border-yellow-200',
    dot: 'bg-yellow-500',
    text: 'text-yellow-700',
    bg: 'bg-yellow-50',
    ring: 'ring-yellow-200',
  },
  '개정 진행 중': {
    badge: 'bg-indigo-100 text-indigo-700 border border-indigo-200',
    dot: 'bg-indigo-500',
    text: 'text-indigo-700',
    bg: 'bg-indigo-50',
    ring: 'ring-indigo-200',
  },
  '개정 완료': {
    badge: 'bg-green-100 text-green-700 border border-green-200',
    dot: 'bg-green-500',
    text: 'text-green-700',
    bg: 'bg-green-50',
    ring: 'ring-green-200',
  },
  '개정 반려': {
    badge: 'bg-red-100 text-red-700 border border-red-200',
    dot: 'bg-red-500',
    text: 'text-red-700',
    bg: 'bg-red-50',
    ring: 'ring-red-200',
  },
  완료: {
    badge: 'bg-green-100 text-green-700 border border-green-200',
    dot: 'bg-green-500',
    text: 'text-green-700',
    bg: 'bg-green-50',
    ring: 'ring-green-200',
  },
  대기: {
    badge: 'bg-gray-100 text-gray-500 border border-gray-200',
    dot: 'bg-gray-400',
    text: 'text-gray-500',
    bg: 'bg-gray-50',
    ring: 'ring-gray-200',
  },
};

export function getStatusStyle(status: string): StatusStyle {
  return (
    QMS_STATUS[status] ?? {
      badge: 'bg-gray-100 text-gray-500 border border-gray-200',
      dot: 'bg-gray-400',
      text: 'text-gray-500',
      bg: 'bg-gray-50',
      ring: 'ring-gray-200',
    }
  );
}
