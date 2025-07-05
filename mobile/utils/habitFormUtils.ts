export const frequencyOptions = [
  { label: 'Täglich', value: 'DAILY' },
  { label: 'Wöchentlich', value: 'WEEKLY' },
  { label: 'Monatlich', value: 'MONTHLY' },
  { label: 'Keine', value: 'NONE' },
];

export const frequencyLabels: Record<string, string> = {
  DAILY: 'Tag',
  WEEKLY: 'Woche',
  MONTHLY: 'Monat',
};

export const getDurationLabel = (unit: string, value: string) => {
  const v = value === '1' ? '' : 'n';
  switch (unit) {
    case 'HOURS':
      return value === '1' ? 'Stunde' : 'Stunden';
    case 'MINUTES':
      return value === '1' ? 'Minute' : 'Minuten';
    case 'PIECES':
      return 'Stück';
    case 'METERS':
      return 'Meter';
    case 'KILOMETERS':
      return 'Kilometer';
    case 'LITERS':
      return 'Liter';
    default:
      return value;
  }
};

export const getDurationFieldLabel = (unit: string): string => {
  switch (unit) {
    case 'MINUTES':
    case 'HOURS':
      return 'Wie lange?';
    case 'PIECES':
      return 'Wie viele?';
    case 'LITERS':
      return 'Wieviel?';
    case 'KILOMETERS':
    case 'METERS':
      return 'Wie weit?';
    default:
      return 'Wie lange?';
  }
};
