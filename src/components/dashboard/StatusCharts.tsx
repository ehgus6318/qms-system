import DonutChart from './DonutChart';

const docTypes = [
  { label: '품질메뉴얼', count: 23,  color: '#3b82f6' },
  { label: '프로세스',   count: 156, color: '#22c55e' },
  { label: '절차서',     count: 342, color: '#a855f7' },
  { label: '지침서',     count: 289, color: '#f59e0b' },
  { label: '작업표준서', count: 276, color: '#14b8a6' },
  { label: '검사기준서', count: 98,  color: '#ef4444' },
  { label: '기록문서',   count: 45,  color: '#6366f1' },
  { label: '외부문서',   count: 19,  color: '#94a3b8' },
];

const maxCount = Math.max(...docTypes.map((d) => d.count));

export default function StatusCharts() {
  return (
    <div className="grid grid-cols-4 gap-3">
      {/* ① 결재 현황 - 오렌지 강조 테두리 */}
      <div className="rounded-xl border-2 border-orange-300 shadow-sm ring-4 ring-orange-50">
        <div className="flex items-center gap-1.5 px-4 pt-3 pb-1">
          <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse flex-shrink-0" />
          <span className="text-[10px] font-bold text-orange-600 uppercase tracking-wide">긴급 처리 필요</span>
        </div>
        <div className="px-1 pb-1">
          <DonutChart
            title="결재 현황"
            total={7}
            totalLabel="전체"
            borderless
            segments={[
              { label: '결재 대기', value: 3, percentage: 42.9, color: '#f97316' },
              { label: '검토 중',   value: 2, percentage: 28.6, color: '#3b82f6' },
              { label: '승인 대기', value: 1, percentage: 14.3, color: '#22c55e' },
              { label: '반려',      value: 1, percentage: 14.3, color: '#ef4444' },
            ]}
          />
        </div>
      </div>

      {/* ② 개정 현황 */}
      <DonutChart
        title="개정 현황"
        total={5}
        totalLabel="전체"
        segments={[
          { label: '개정 대기', value: 2, percentage: 40,   color: '#f97316' },
          { label: '검토 중',   value: 1, percentage: 20,   color: '#3b82f6' },
          { label: '승인 대기', value: 1, percentage: 20,   color: '#22c55e' },
          { label: '반려',      value: 1, percentage: 20,   color: '#ef4444' },
        ]}
      />

      {/* ③ 문서 상태 현황 - 통합 색상 시스템 (초안=회색) */}
      <DonutChart
        title="문서 상태 현황"
        total="1,248"
        totalLabel="전체"
        segments={[
          { label: '승인',   value: 1020, percentage: 81.7, color: '#22c55e' },  // 녹색
          { label: '초안',   value: 128,  percentage: 10.3, color: '#9ca3af' },  // 회색 (기존 파랑→회색)
          { label: '검토 중', value: 67,  percentage: 5.4,  color: '#3b82f6' },  // 파랑
          { label: '반려',   value: 33,   percentage: 2.6,  color: '#ef4444' },  // 빨강
        ]}
      />

      {/* ④ 문서 유형별 현황 */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
        <h3 className="text-sm font-semibold text-gray-800 mb-3">문서 유형별 현황</h3>
        <div className="space-y-2">
          {docTypes.map((d) => (
            <div key={d.label} className="flex items-center gap-2 group">
              <span className="text-[10px] text-gray-500 w-[4.5rem] flex-shrink-0 text-right group-hover:text-gray-700 transition-colors">
                {d.label}
              </span>
              <div className="flex-1 bg-gray-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className="h-2.5 rounded-full transition-all duration-500"
                  style={{
                    width: `${(d.count / maxCount) * 100}%`,
                    backgroundColor: d.color,
                  }}
                />
              </div>
              <span className="text-[10px] font-semibold text-gray-600 w-6 flex-shrink-0 tabular-nums">
                {d.count}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-3 pt-2.5 border-t border-gray-100 flex justify-between items-center">
          <span className="text-[10px] text-gray-400">전체 유형 합계</span>
          <span className="text-xs font-bold text-gray-700">
            {docTypes.reduce((s, d) => s + d.count, 0).toLocaleString()}건
          </span>
        </div>
      </div>
    </div>
  );
}
