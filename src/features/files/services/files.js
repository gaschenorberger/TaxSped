import { download } from '../../../utils/download';

const sources = new Map();
const outputs = new Map();

export function registerFile(protocol, file) {
  sources.set(protocol, file);
}

export function downloadFile(file) {
  const source = sources.get(file.protocol);
  if (!source) return false;
  download(file.name, source, source.type || 'application/octet-stream');
  return true;
}

export function registerOutput(id, file) {
  outputs.set(id, file);
}

export function hasOutput(file) {
  if (outputs.has(file.id)) return true;
  try { return ['https:', 'http:'].includes(new URL(file.downloadUrl, window.location.origin).protocol) && Boolean(file.downloadUrl); } catch { return false; }
}

export function downloadOutput(file) {
  const content = outputs.get(file.id);
  if (content) { download(file.name, content, content.type || 'application/octet-stream'); return true; }
  if (!hasOutput(file)) return false;
  const link = document.createElement('a');
  link.href = new URL(file.downloadUrl, window.location.origin).href;
  link.download = file.name;
  link.rel = 'noopener';
  link.click();
  return true;
}
