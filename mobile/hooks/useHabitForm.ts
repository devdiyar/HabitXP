import { useEffect, useRef, useState } from 'react';
import { NewTask } from '@/types/task';

export function useHabitForm(initialValues: Partial<NewTask> = {}) {
  const initialized = useRef(false);

  const [title, setTitle] = useState(initialValues.title || '');
  const [frequency, setFrequency] = useState(
    initialValues.frequency || 'DAILY',
  );
  const [times, setTimes] = useState((initialValues.times || 1).toString());
  const [durationValue, setDurationValue] = useState(
    initialValues.duration?.replace(/[^\d]/g, '') || '15',
  );
  const [space, setSpace] = useState(initialValues.spaceId || '');

  const getInitialDurationUnit = (duration?: string) => {
    if (!duration) return 'MINUTES';
    if (duration.includes('h')) return 'HOURS';
    if (duration.includes('pcs')) return 'PIECES';
    if (duration.includes('km')) return 'KILOMETERS';
    if (duration.includes('m')) return 'METERS';
    if (duration.includes('l')) return 'LITERS';
    return 'MINUTES';
  };

  const [durationUnit, setDurationUnit] = useState<
    'MINUTES' | 'HOURS' | 'PIECES' | 'METERS' | 'KILOMETERS' | 'LITERS'
  >(getInitialDurationUnit(initialValues.duration));

  useEffect(() => {
    if (initialized.current) return;

    setTitle(initialValues.title || '');
    setFrequency(initialValues.frequency || 'DAILY');
    setTimes((initialValues.times || 1).toString());
    setDurationValue(initialValues.duration?.replace(/[^\d]/g, '') || '15');
    setDurationUnit(getInitialDurationUnit(initialValues.duration));
    setSpace(initialValues.spaceId || '');
    initialized.current = true;
  }, [initialValues]);

  return {
    title,
    setTitle,
    frequency,
    setFrequency,
    times,
    setTimes,
    durationValue,
    setDurationValue,
    durationUnit,
    setDurationUnit,
    space,
    setSpace,
  };
}
