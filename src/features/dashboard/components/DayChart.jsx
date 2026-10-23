import { useState } from 'react';
import { parseDate } from '../../../utils/dates';

export default function DayChart({ files }) {
  const [hovered, setHovered] = useState(null);
  const groups = files.reduce((result, file) => { const day = file.date.split(/[ ,]/)[0]; result[day] = (result[day] || 0) + 1; return result; }, {});
  const entries = Object.entries(groups).sort(([first], [last]) => parseDate(first) - parseDate(last));
  const max = Math.max(1, ...Object.values(groups));

  return (
    <>
      <div className="bar-chart">
        <div className="axis"><span>{max}</span><span>{Math.round(max / 2)}</span><span>0</span></div>
        <div className="bars daily-bars">
          {entries.map(([day, count]) => (
            <div className="day-bar-column" key={day}>
              <button type="button" className={`day-bar ${hovered === day ? 'hovered' : ''}`} aria-label={`${day}: ${count} ${count === 1 ? 'conversão' : 'conversões'}`} onMouseEnter={() => setHovered(day)} onMouseLeave={() => setHovered(null)} onFocus={() => setHovered(day)} onBlur={() => setHovered(null)} onClick={() => setHovered(hovered === day ? null : day)}>
                <span className="day-bar-fill" style={{ height: `${count / max * 85}%` }} />
              </button>
              {hovered === day && <div className="chart-tooltip" role="tooltip" style={{ bottom: `${count / max * 85 + 5}%` }}><span>{day}</span><strong>{count} {count === 1 ? 'conversão' : 'conversões'}</strong></div>}
            </div>
          ))}
        </div>
      </div>
      <div className="chart-dates">{entries.map(([day]) => <span key={day}>{day.slice(0, 5)}</span>)}</div>
      {!files.length && <p className="chart-empty">Sem conversões neste período.</p>}
    </>
  );
}
