export function download(name, content, type = 'text/plain;charset=utf-8') {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const link = document.createElement('a');
  link.href = url;
  link.download = name;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function exportOrders(files) {
  const columns = ['Número do pedido', 'Nome do pedido', 'Arquivos enviados', 'Tipo de SPED', 'Conversão', 'Data', 'Status'];
  const rows = files.map(file => [file.protocol, file.name, file.inputs?.length || 1, file.sped, file.conversion, file.date, file.status]);
  const csv = [columns, ...rows].map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(';')).join('\r\n');
  download('pedidos-taxsped.csv', '\uFEFF' + csv, 'text/csv;charset=utf-8');
}
