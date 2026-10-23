import { useState } from 'react';
import { BarChart3, FileSpreadsheet } from 'lucide-react';
import IconBox from '../../../components/ui/IconBox';
import Select from '../../../components/ui/Select';
import DayChart from './DayChart';
import { inPeriod } from '../../../utils/dates';

const types = ['EFD Contribuições', 'EFD ICMS/IPI', 'ECD', 'ECF', 'A identificar'];
const colors = ['#006645', '#3eae8a', '#6ed099', '#b6ecc7', '#dce9e4'];

export default function Charts({ files }) {
  const [days, setDays] = useState(0);
  const source = files.filter((file) => inPeriod(file, '', '', days));
  let angle = 0;
  const segments = types.map((type, index) => {
    const count = source.filter((file) => file.sped === type).length;
    const start = angle;
    angle += source.length ? (count / source.length) * 100 : 0;
    return `${colors[index]} ${start}% ${angle}%`;
  });
  return (
    <>
      <article className="panel chart-panel">
        <div className="panel-title">
          <div>
            <IconBox>
              <BarChart3 size={21} />
            </IconBox>
            <strong>Conversões ao longo do tempo</strong>
          </div>
          <Select ariaLabel="Período do gráfico" value={days} onChange={(event) => setDays(Number(event.target.value))}>
            <option value="0">Todo o período</option>
            <option value="30">Últimos 30 dias</option>
            <option value="7">Últimos 7 dias</option>
          </Select>
        </div>
        <DayChart files={source} />
      </article>
      <article className="panel donut-panel">
        <div className="panel-title">
          <div>
            <IconBox>
              <FileSpreadsheet size={21} />
            </IconBox>
            <strong>Distribuição por tipo de SPED</strong>
          </div>
        </div>
        <div className="donut-content">
          <div className="donut" style={{ background: source.length ? `conic-gradient(${segments.join(', ')})` : '#e4ece8' }}>
            <div>
              <strong>{source.length}</strong>
              <span>arquivos</span>
            </div>
          </div>
          <div className="legend">
            {types.map((type, index) => {
              const count = source.filter((file) => file.sped === type).length;
              return (
                <p key={type}>
                  <i style={{ background: colors[index] }} />
                  {type}
                  <b>{count}</b>
                  <span>{source.length ? ((count / source.length) * 100).toFixed(1) : 0}%</span>
                </p>
              );
            })}
          </div>
        </div>
      </article>
    </>
  );
}
