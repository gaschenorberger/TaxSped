import { useMemo, useState } from 'react';
import { inPeriod } from '../../../utils/dates';

export default function useFiles(files, trash = false) {
  const [search, setSearch] = useState('');
  const [sped, setSped] = useState('Todos');
  const [status, setStatus] = useState('Todos');
  const [type, setType] = useState('Todos');
  const [days, setDays] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const filtered = useMemo(
    () =>
      files.filter(
        (file) =>
          Boolean(file.deleted) === trash &&
          (`${file.name} ${file.protocol} ${file.orderName || ''}`.toLowerCase().includes(search.toLowerCase()) || file.inputs?.some(input => input.name.toLowerCase().includes(search.toLowerCase()))) &&
          (sped === 'Todos' || file.sped === sped) &&
          (status === 'Todos' || file.status === status) &&
          (type === 'Todos' || file.type === type) &&
          inPeriod(file, '', '', days)
      ),
    [files, trash, search, sped, status, type, days]
  );
  const currentPage = Math.min(page, Math.max(1, Math.ceil(filtered.length / pageSize)));
  const visible = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  function clear() {
    setSearch('');
    setSped('Todos');
    setStatus('Todos');
    setType('Todos');
    setDays(0);
    setPage(1);
  }

  return {
    search,
    setSearch,
    sped,
    setSped,
    status,
    setStatus,
    type,
    setType,
    days,
    setDays,
    page: currentPage,
    setPage,
    pageSize,
    setPageSize,
    filtered,
    visible,
    clear
  };
}
