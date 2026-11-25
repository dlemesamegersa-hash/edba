export const formatBytes = (n) => {
  if (!n) return '-';
  const u = ['B', 'KB', 'MB', 'GB']; let i = 0;
  while (n >= 1024 && i < 3) { n /= 1024; i++; }
  return `${n.toFixed(i ? 1 : 0)} ${u[i]}`;
};
export const formatDate = (iso) => (iso ? new Date(iso).toLocaleString() : 'Never');
