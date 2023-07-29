import { DateTime } from 'luxon';
import { useState, useEffect } from 'react';

export const useTime = (refresh = 1000) => {
  const [now, setNow] = useState(getTime());

  useEffect(() => {
    const intervalId = setInterval(() => setNow(getTime()), refresh);

    return () => clearInterval(intervalId);
  }, [refresh, setNow]);

  return now;
};

const getTime = () => {
  return DateTime.now();
};

export const Clock = ({ time }) => (
  <p>{time.setLocale('pl').toLocaleString(DateTime.DATETIME_SHORT)}</p>
);
