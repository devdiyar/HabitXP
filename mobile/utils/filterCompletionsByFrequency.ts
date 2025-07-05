import { Completion } from '@/types/completion';
import { isSameDay, isSameMonth, isSameWeek, parseISO } from 'date-fns';
import { de } from 'date-fns/locale';
import { Frequency } from '@/types/task';

export function filterCompletionsByFrequency(
  completions: Completion[],
  frequency: Frequency,
): Completion[] {
  const now = new Date();

  return completions.filter(completion => {
    const timestamp = parseISO(completion.timestamp);
    if (isNaN(timestamp.getTime())) return false;

    switch (frequency) {
      case 'DAILY':
        return isSameDay(timestamp, now);

      case 'WEEKLY': {
        return isSameWeek(timestamp, now, { weekStartsOn: 1, locale: de });
      }

      case 'MONTHLY':
        return isSameMonth(timestamp, now);

      default:
        return true;
    }
  });
}
