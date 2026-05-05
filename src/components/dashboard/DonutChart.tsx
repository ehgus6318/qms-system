interface Segment {
  label: string;
  value: number;
  percentage: number;
  color: string;
}

interface DonutChartProps {
  title: string;
  total: number | string;
  totalLabel: string;
  segments: Segment[];
  borderless?: boolean;  // 외부에서 border를 감싸는 경우 사용
}

export default function DonutChart({
  title, total, totalLabel, segments, borderless = false,
}: DonutChartProps) {
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const cx = 56;
  const cy = 56;
  const strokeWidth = 16;

  let cumulative = 0;

  const inner = (
    <>
      <h3 className="text-sm font-semibold text-gray-800 mb-3">{title}</h3>
      <div className="flex items-center gap-3">
        {/* Donut SVG */}
        <div className="flex-shrink-0">
          <svg width="112" height="112" viewBox="0 0 112 112">
            {/* Background track */}
            <circle cx={cx} cy={cy} r={radius} fill="none" stroke="#f3f4f6" strokeWidth={strokeWidth} />

            {segments.map((seg, i) => {
              const arcLen = (seg.percentage / 100) * circumference;
              const startOffset = (cumulative / 100) * circumference;
              const dashOffset = circumference - startOffset;
              cumulative += seg.percentage;

              return (
                <circle
                  key={i}
                  cx={cx}
                  cy={cy}
                  r={radius}
                  fill="none"
                  stroke={seg.color}
                  strokeWidth={strokeWidth}
                  strokeDasharray={`${arcLen} ${circumference - arcLen}`}
                  strokeDashoffset={dashOffset}
                  transform={`rotate(-90, ${cx}, ${cy})`}
                  strokeLinecap="butt"
                />
              );
            })}

            {/* Center: 소계 레이블 */}
            <text
              x={cx} y={cy - 8}
              textAnchor="middle" fontSize="9" fill="#9ca3af"
              fontFamily="system-ui, sans-serif"
            >
              {totalLabel}
            </text>
            <text
              x={cx} y={cy + 11}
              textAnchor="middle" fontSize="19" fontWeight="800" fill="#111827"
              fontFamily="system-ui, sans-serif"
            >
              {total}
            </text>
          </svg>
        </div>

        {/* Legend */}
        <div className="flex-1 space-y-2 min-w-0">
          {segments.map((seg, i) => (
            <div key={i} className="flex items-center justify-between gap-1">
              <div className="flex items-center gap-1.5 min-w-0">
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: seg.color }}
                />
                <span className="text-gray-600 truncate text-[11px]">{seg.label}</span>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <span className="text-[12px] font-bold text-gray-800">{seg.value}</span>
                <span className="text-gray-400 text-[10px]">({seg.percentage}%)</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );

  if (borderless) {
    return <div className="p-4 bg-white rounded-xl">{inner}</div>;
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 card-lift">
      {inner}
    </div>
  );
}
