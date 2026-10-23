import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '../../../app/AppContext';
import { registerFile } from '../../files/services/files';

export default function useConversion() {
  const { notify, preferences, setFiles } = useApp();
  const [params] = useSearchParams();
  const [mode, setMode] = useState(params.get('mode') === 'excel' ? 'excel' : 'txt');
  const [selected, setSelected] = useState([]);
  const [sped, setSped] = useState('auto');
  const [validate, setValidate] = useState(preferences.validate);
  const [submitted, setSubmitted] = useState(null);

  function addFiles(list) {
    const accepted = Array.from(list).filter((file) => /\.(txt|xls|xlsx|zip)$/i.test(file.name));
    if (accepted.length !== list.length) notify('Selecione somente arquivos TXT, XLS, XLSX ou ZIP.');
    setSelected((current) => [
      ...current,
      ...accepted.filter((file) => !current.some((item) => item.name === file.name && item.size === file.size))
    ]);
  }

  function start() {
    if (!selected.length || submitted) return;
    const invalid = selected.some((file) => (mode === 'txt' ? !/\.(txt|zip)$/i.test(file.name) : !/\.xlsx?$/i.test(file.name)));
    if (invalid) return notify(mode === 'txt' ? 'Para TXT → Excel, selecione TXT ou ZIP.' : 'Para Excel → TXT, selecione XLS ou XLSX.');
    const protocol = `SPED-${crypto.randomUUID()}`;
    const inputs = selected.map((file, index) => {
      const inputId = `${protocol}/entrada-${index + 1}`;
      registerFile(inputId, file);
      return { protocol: inputId, name: file.name, type: file.name.split('.').pop().toUpperCase(), size: `${(file.size / 1024 / 1024).toFixed(2)} MB` };
    });
    const order = { protocol, name: `Pedido ${protocol.slice(5, 13).toUpperCase()}`, inputs, outputs: [], sped: sped === 'auto' ? 'A identificar' : sped, conversion: mode === 'txt' ? 'TXT → Excel' : 'Excel → TXT', date: new Date().toLocaleString('pt-BR'), status: 'Pendente', validate };
    setFiles(current => [order, ...current]);
    setSubmitted(order);
    setSelected([]);
  }

  return {
    mode,
    setMode,
    selected,
    setSelected,
    sped,
    setSped,
    validate,
    setValidate,
    addFiles,
    start,
    submitted
  };
}
