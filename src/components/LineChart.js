import './LineChart.css';

const CHART_WIDTH = 320;
const CHART_HEIGHT = 168;
const PAD = { top: 16, right: 12, bottom: 32, left: 40 };

function scalePoint(index, count, value, minVal, maxVal, innerW, innerH) {
  const x =
    count <= 1
      ? PAD.left + innerW / 2
      : PAD.left + (index / (count - 1)) * innerW;
  const range = maxVal - minVal || 1;
  const y = PAD.top + innerH - ((value - minVal) / range) * innerH;
  return { x, y };
}

export default function LineChart({
  title,
  subtitle,
  data,
  valueSuffix = '',
  emptyMessage = 'Not enough data yet.',
}) {
  if (!data || data.length === 0) {
    return (
      <section className="line-chart">
        <header className="line-chart__header">
          <h3 className="line-chart__title">{title}</h3>
          {subtitle ? <p className="line-chart__subtitle">{subtitle}</p> : null}
        </header>
        <p className="line-chart__empty">{emptyMessage}</p>
      </section>
    );
  }

  const innerW = CHART_WIDTH - PAD.left - PAD.right;
  const innerH = CHART_HEIGHT - PAD.top - PAD.bottom;
  const values = data.map((d) => d.value);
  const rawMin = Math.min(...values);
  const rawMax = Math.max(...values);
  const padding = rawMax === rawMin ? Math.max(rawMax * 0.1, 1) : 0;
  const minVal = Math.max(0, rawMin - padding);
  const maxVal = rawMax + padding;

  const points = data.map((d, i) =>
    scalePoint(i, data.length, d.value, minVal, maxVal, innerW, innerH)
  );
  const polyline = points.map((p) => `${p.x},${p.y}`).join(' ');
  const areaPath = [
    `M ${points[0].x} ${PAD.top + innerH}`,
    ...points.map((p) => `L ${p.x} ${p.y}`),
    `L ${points[points.length - 1].x} ${PAD.top + innerH}`,
    'Z',
  ].join(' ');

  const yTicks = [minVal, (minVal + maxVal) / 2, maxVal];
  const formatTick = (v) => {
    const rounded = v >= 100 ? Math.round(v) : Math.round(v * 10) / 10;
    return `${rounded}${valueSuffix}`;
  };

  const labelStep = data.length <= 4 ? 1 : Math.ceil(data.length / 4);

  return (
    <section className="line-chart">
      <header className="line-chart__header">
        <h3 className="line-chart__title">{title}</h3>
        {subtitle ? <p className="line-chart__subtitle">{subtitle}</p> : null}
      </header>
      <div className="line-chart__frame">
        <svg
          className="line-chart__svg"
          viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
          role="img"
          aria-label={`${title} line chart`}
        >
          {yTicks.map((tick) => {
            const { y } = scalePoint(
              0,
              1,
              tick,
              minVal,
              maxVal,
              innerW,
              innerH
            );
            return (
              <g key={tick}>
                <line
                  x1={PAD.left}
                  y1={y}
                  x2={CHART_WIDTH - PAD.right}
                  y2={y}
                  className="line-chart__grid"
                />
                <text
                  x={PAD.left - 6}
                  y={y + 4}
                  className="line-chart__tick"
                  textAnchor="end"
                >
                  {formatTick(tick)}
                </text>
              </g>
            );
          })}
          <path d={areaPath} className="line-chart__area" />
          <polyline
            points={polyline}
            className="line-chart__line"
            fill="none"
          />
          {points.map((p, i) => (
            <circle
              key={data[i].date ?? i}
              cx={p.x}
              cy={p.y}
              r={4}
              className="line-chart__dot"
            />
          ))}
          {data.map((d, i) =>
            i % labelStep === 0 || i === data.length - 1 ? (
              <text
                key={`lbl-${d.date ?? i}`}
                x={points[i].x}
                y={CHART_HEIGHT - 8}
                className="line-chart__label"
                textAnchor="middle"
              >
                {d.label}
              </text>
            ) : null
          )}
        </svg>
      </div>
    </section>
  );
}
