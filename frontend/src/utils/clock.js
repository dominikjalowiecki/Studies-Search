import { DateTime } from 'luxon';
import { useState, useEffect } from 'react';
import { Text } from '@chakra-ui/react';

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
  <Text>{time.toLocaleString(DateTime.DATETIME_SHORT)}</Text>
);
