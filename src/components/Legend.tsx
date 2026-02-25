interface LegendProps {
  uncertainCount: number;
  acceptedCount: number;
  correctedCount: number;
}

interface LegendItem {
  color: string;
  bg: string;
  label: string;
  count: number;
}

export function Legend({ uncertainCount, acceptedCount, correctedCount }: LegendProps) {
  const items: LegendItem[] = [
    { color: "#ef4444", bg: "rgba(239,68,68,0.15)", label: "Below threshold", count: uncertainCount },
    { color: "#3b82f6", bg: "rgba(59,130,246,0.15)", label: "Accepted",        count: acceptedCount  },
    { color: "#22c55e", bg: "rgba(34,197,94,0.15)",  label: "User-corrected",  count: correctedCount },
  ];

  return (
    <div
      className="flex items-center gap-3 flex-wrap"
      role="status"
      aria-label="Note classification summary"
    >
      {items.map((item) => (
        <div
          key={item.label}
          className="flex items-center gap-1.5 rounded-md px-2.5 py-1"
          style={{
            background: item.bg,
            border: `1px solid ${item.color}66`,
          }}
        >
          <span
            className="inline-block rounded-sm flex-shrink-0"
            style={{ width: 8, height: 8, background: item.color }}
          />
          <span
            style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: "0.7rem",
              color: "rgba(255,255,255,0.7)",
              whiteSpace: "nowrap",
            }}
          >
            {item.label}
          </span>
          <span
            style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: "0.7rem",
              fontWeight: 500,
              color: item.color,
            }}
          >
            {item.count}
          </span>
        </div>
      ))}
    </div>
  );
}
