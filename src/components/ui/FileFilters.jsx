import { Search } from 'lucide-react';
import Select from './Select';

export default function FileFilters({ filters, orders = false }) {
  return (
    <article className={`panel ${orders ? 'filters orders-filters' : 'file-filters'}`}>
      {orders && (
        <label className="orders-search">
          <span>Buscar por arquivo ou protocolo</span>
          <div className="search-input">
            <Search />
            <input value={filters.search} onChange={(event) => filters.setSearch(event.target.value)} placeholder="Digite para buscar..." />
          </div>
        </label>
      )}
      <Select label="Tipo de SPED" value={filters.sped} onChange={(event) => filters.setSped(event.target.value)}>
        <option>Todos</option>
        <option>EFD ICMS/IPI</option>
        <option>EFD Contribuições</option>
        <option>ECD</option>
        <option>ECF</option>
      </Select>
      {!orders && (
        <Select label="Tipo de arquivo" value={filters.type} onChange={(event) => filters.setType(event.target.value)}>
          <option>Todos</option>
          <option>TXT</option>
          <option>XLSX</option>
          <option>XLS</option>
          <option>ZIP</option>
        </Select>
      )}
      <Select label="Status" value={filters.status} onChange={(event) => filters.setStatus(event.target.value)}>
        <option>Todos</option>
        <option>Concluído</option>
        <option>Processando</option>
        <option>Pendente</option>
        <option>Erro</option>
        <option>Expirado</option>
        <option>Cancelado</option>
      </Select>
      {orders ? (
        <>
          <button className="btn clear-filters" onClick={filters.clear}>
            Limpar filtros
          </button>
        </>
      ) : (
        <Select label="Período" value={filters.days} onChange={(event) => filters.setDays(Number(event.target.value))}>
          <option value="0">Todo o período</option>
          <option value="7">Últimos 7 dias</option>
          <option value="30">Últimos 30 dias</option>
          <option value="365">Último ano</option>
        </Select>
      )}
    </article>
  );
}
