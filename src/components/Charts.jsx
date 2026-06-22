
// Custom SVG Line Chart for Revenue Trends - Organic Luxury Theme
export const RevenueLineChart = ({ data = [30000, 45000, 35000, 60000, 72000, 85000], labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"] }) => {
  const width = 500;
  const height = 200;
  const padding = 30;

  const maxVal = Math.max(...data) * 1.1;
  const minVal = 0;
  
  const points = data.map((val, i) => {
    const x = padding + (i * (width - padding * 2)) / (data.length - 1);
    const y = height - padding - ((val - minVal) * (height - padding * 2)) / (maxVal - minVal);
    return { x, y, val };
  });

  const pathD = points.reduce((acc, p, i) => {
    return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
  }, "");

  const areaD = points.length > 0 
    ? `${pathD} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`
    : "";

  return (
    <div style={{ width: '100%', overflow: 'hidden' }}>
      <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
        <defs>
          <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--accent-gold)" stopOpacity="0.18" />
            <stop offset="100%" stopColor="var(--accent-gold)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
          const y = padding + ratio * (height - padding * 2);
          return (
            <line
              key={idx}
              x1={padding}
              y1={y}
              x2={width - padding}
              y2={y}
              stroke="var(--border-light)"
              strokeWidth={1}
            />
          );
        })}

        {/* Area fill */}
        <path d={areaD} fill="url(#lineGrad)" />

        {/* Line stroke */}
        <path d={pathD} fill="none" stroke="var(--accent-gold)" strokeWidth={2} strokeLinecap="round" />

        {/* Data points */}
        {points.map((p, idx) => (
          <g key={idx}>
            <circle
              cx={p.x}
              cy={p.y}
              r={4}
              fill="var(--bg-secondary)"
              stroke="var(--accent-gold)"
              strokeWidth={2}
              style={{ cursor: 'pointer', transition: 'all 0.2s' }}
            />
            <text
              x={p.x}
              y={p.y - 10}
              textAnchor="middle"
              fill="var(--text-secondary)"
              fontSize={9}
              fontWeight="500"
              fontFamily="var(--font-display)"
            >
              ₹{Math.round(p.val / 1000)}k
            </text>
          </g>
        ))}

        {/* X Axis Labels */}
        {labels.map((lbl, idx) => {
          const x = padding + (idx * (width - padding * 2)) / (labels.length - 1);
          return (
            <text
              key={idx}
              x={x}
              y={height - 8}
              textAnchor="middle"
              fill="var(--text-muted)"
              fontSize={10}
              fontWeight="500"
              fontFamily="var(--font-display)"
            >
              {lbl}
            </text>
          );
        })}
      </svg>
    </div>
  );
};

// Custom SVG Bar Chart - Organic Luxury Theme
export const RetentionBarChart = ({ data = [65, 70, 78, 85, 82, 90], labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"] }) => {
  const width = 500;
  const height = 200;
  const padding = 30;

  const maxVal = 100;
  const barWidth = 24;

  return (
    <div style={{ width: '100%', overflow: 'hidden' }}>
      <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
          const y = padding + ratio * (height - padding * 2);
          return (
            <line
              key={idx}
              x1={padding}
              y1={y}
              x2={width - padding}
              y2={y}
              stroke="var(--border-light)"
              strokeWidth={1}
            />
          );
        })}

        {/* Bars */}
        {data.map((val, idx) => {
          const x = padding + (idx * (width - padding * 2)) / (data.length - 1) - barWidth / 2;
          const barHeight = (val / maxVal) * (height - padding * 2);
          const y = height - padding - barHeight;

          return (
            <g key={idx}>
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                rx={2}
                fill="rgba(197, 168, 128, 0.4)"
                stroke="var(--accent-gold)"
                strokeWidth={1}
                style={{ transition: 'all 0.25s', cursor: 'pointer' }}
                onMouseEnter={(e) => { e.target.setAttribute('fill', 'rgba(195, 151, 151, 0.5)'); e.target.setAttribute('stroke', 'var(--accent-rose)'); }}
                onMouseLeave={(e) => { e.target.setAttribute('fill', 'rgba(197, 168, 128, 0.4)'); e.target.setAttribute('stroke', 'var(--accent-gold)'); }}
              />
              <text
                x={x + barWidth / 2}
                y={y - 8}
                textAnchor="middle"
                fill="var(--text-primary)"
                fontSize={9}
                fontWeight="500"
                fontFamily="var(--font-display)"
              >
                {val}%
              </text>
            </g>
          );
        })}

        {/* Labels */}
        {labels.map((lbl, idx) => {
          const x = padding + (idx * (width - padding * 2)) / (labels.length - 1);
          return (
            <text
              key={idx}
              x={x}
              y={height - 8}
              textAnchor="middle"
              fill="var(--text-muted)"
              fontSize={10}
              fontWeight="500"
              fontFamily="var(--font-display)"
            >
              {lbl}
            </text>
          );
        })}
      </svg>
    </div>
  );
};

// Customer Distribution visual rows - Organic Luxury Theme
export const BookingProgressList = ({ items = [
  { name: 'Bridal Makeup', count: 42, color: 'var(--accent-rose)' },
  { name: 'Hair Balayage', count: 35, color: 'var(--accent-gold)' },
  { name: 'Nail Acrylics', count: 28, color: 'var(--text-secondary)' },
  { name: 'HydraFacial', count: 15, color: 'var(--text-primary)' }
] }) => {
  const total = items.reduce((sum, item) => sum + item.count, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {items.map((item, idx) => {
        const pct = Math.round((item.count / total) * 100);
        return (
          <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: '500', fontFamily: 'var(--font-display)' }}>
              <span style={{ color: 'var(--text-primary)' }}>{item.name}</span>
              <span style={{ color: 'var(--text-secondary)' }}>{item.count} bookings ({pct}%)</span>
            </div>
            <div style={{ height: '4px', width: '100%', backgroundColor: 'var(--bg-primary)', borderRadius: '2px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${pct}%`, backgroundColor: item.color, borderRadius: '2px', transition: 'width 0.8s ease-out' }}></div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
