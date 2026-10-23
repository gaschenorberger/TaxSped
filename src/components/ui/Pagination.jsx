import { ChevronLeft, ChevronRight } from 'lucide-react';
import Select from './Select';

export default function Pagination({ total, page, pageSize, onPage, onPageSize }) {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const first = total ? (page - 1) * pageSize + 1 : 0;
  const last = Math.min(total, page * pageSize);
  return (
    <div className="pagination">
      <span>
        Mostrando {first}–{last} de {total} registros
      </span>
      <div>
        <button disabled={page === 1} onClick={() => onPage(page - 1)} aria-label="Página anterior">
          <ChevronLeft />
        </button>
        {Array.from({ length: pages }, (_, index) => index + 1)
          .filter((number) => Math.abs(number - page) < 3 || number === 1 || number === pages)
          .map((number) => (
            <button className={number === page ? 'active' : ''} onClick={() => onPage(number)} key={number}>
              {number}
            </button>
          ))}
        <button disabled={page === pages} onClick={() => onPage(page + 1)} aria-label="Próxima página">
          <ChevronRight />
        </button>
      </div>
      <Select ariaLabel="Registros por página" value={pageSize} onChange={(event) => { onPageSize(Number(event.target.value)); onPage(1); }}>
        <option value="8">8 por página</option>
        <option value="15">15 por página</option>
        <option value="30">30 por página</option>
      </Select>
    </div>
  );
}
