import { parseDate } from '../../../utils/dates';

function sizeInMb(value) {
  const text = String(value ?? '').trim();
  const size = Number.parseFloat(text.replace(',', '.'));
  if (!Number.isFinite(size) || size < 0) return 0;
  if (/GB/i.test(text)) return size * 1024;
  if (/KB/i.test(text)) return size / 1024;
  if (/\d\s*B$/i.test(text)) return size / (1024 * 1024);
  return size;
}

export function getUsage(files, now = new Date()) {
  const active = files.filter(file => !file.deleted);
  const count = active.filter(file => { const date = parseDate(file.date || ''); return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear(); }).length;
  const attachments = active.flatMap(file => [...(Array.isArray(file.inputs) ? file.inputs : [file]), ...(file.outputs || [])]).filter(file => !file.deleted);
  const used = attachments.reduce((total, file) => total + sizeInMb(file.size), 0);
  return { count, used, total: attachments.length };
}
