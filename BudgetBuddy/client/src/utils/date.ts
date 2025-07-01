export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('fr-FR');
}

export function formatDateInput(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function getTodayString(): string {
  return formatDateInput(new Date());
}
