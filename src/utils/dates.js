export function parseDate(value) {
  const [day, month, year] = value.split(/[\s,]+/)[0].split('/');
  return new Date(Number(year), Number(month) - 1, Number(day));
}

export function inPeriod(file, start, end, days) {
  const date = parseDate(file.date);
  const first = start ? new Date(`${start}-01T00:00:00`) : null;
  const last = end ? new Date(Number(end.slice(0, 4)), Number(end.slice(5, 7)), 0, 23, 59, 59) : null;
  if ((first && date < first) || (last && date > last)) return false;
  if (!days) return true;
  const limit = new Date();
  limit.setDate(limit.getDate() - days);
  limit.setHours(0, 0, 0, 0);
  return date >= limit;
}
