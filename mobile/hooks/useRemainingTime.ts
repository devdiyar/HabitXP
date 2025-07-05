import { useEffect, useState } from 'react';

export function useRemainingTime(targetDate: string | null) {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(targetDate));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 60 * 1000); // jede Minute neu berechnen

    return () => clearInterval(interval);
  }, [targetDate]);

  return timeLeft;
}

function calculateTimeLeft(targetDate: string | null) {
  if (!targetDate) return null;

  const now = Date.now();
  const end = new Date(targetDate).getTime();
  const diffMs = end - now;

  if (diffMs <= 0) return null;

  const totalMinutes = Math.floor(diffMs / (1000 * 60));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return { hours, minutes };
}
