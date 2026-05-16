export function formatDateTimeToDate(dateTimeString: string): string {
  const date = new Date(dateTimeString);
  return date.toLocaleDateString('fr-CA');
}
