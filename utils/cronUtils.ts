
// A simplified cron-to-human-readable converter.
// This is not a full-fledged parser but handles common cases.

export const cronToString = (cron: string): string => {
  const parts = cron.split(' ');
  if (parts.length !== 5) {
    return 'Invalid schedule';
  }

  const [minute, hour, dayOfMonth, month, dayOfWeek] = parts;

  try {
    // Every X minutes
    if (minute.startsWith('*/')) {
      const min = minute.substring(2);
      return `Every ${min} minute${min === '1' ? '' : 's'}`;
    }
    
    // Every hour at X minutes past
    if (hour === '*' && minute !== '*') {
      return `Every hour at ${minute} minute${minute === '1' ? '' : 's'} past the hour`;
    }

    // Daily at a specific time
    if (dayOfMonth === '*' && month === '*' && dayOfWeek === '*') {
      return `Every day at ${hour.padStart(2, '0')}:${minute.padStart(2, '0')}`;
    }

    // Weekly on a specific day and time
    if (dayOfMonth === '*' && month === '*' && dayOfWeek !== '*') {
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      return `Every ${days[parseInt(dayOfWeek)]} at ${hour.padStart(2, '0')}:${minute.padStart(2, '0')}`;
    }
    
    // Monthly on a specific day and time
     if (dayOfMonth !== '*' && month === '*' && dayOfWeek === '*') {
       const suffix = (d: string) => {
         if (d.endsWith('1') && d !== '11') return 'st';
         if (d.endsWith('2') && d !== '12') return 'nd';
         if (d.endsWith('3') && d !== '13') return 'rd';
         return 'th';
       }
      return `On the ${dayOfMonth}${suffix(dayOfMonth)} of every month at ${hour.padStart(2, '0')}:${minute.padStart(2, '0')}`;
    }

  } catch (e) {
    return cron; // Fallback
  }

  return cron; // Fallback for complex schedules
};
