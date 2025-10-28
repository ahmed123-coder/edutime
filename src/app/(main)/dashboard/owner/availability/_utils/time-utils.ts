export const getWeekNumber = (date: Date) => {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
};

export const getTimetableTimeRange = (hours: any) => {
  if (!hours) return { startHour: 8, endHour: 19 };

  let earliestOpen = 24;
  let latestClose = 0;

  Object.values(hours).forEach((dayHours: any) => {
    if (dayHours && !dayHours.closed && dayHours.open && dayHours.close) {
      const openHour = parseInt(dayHours.open.split(':')[0]);
      const closeHour = parseInt(dayHours.close.split(':')[0]);
      if (openHour < earliestOpen) earliestOpen = openHour;
      if (closeHour > latestClose) latestClose = closeHour;
    }
  });

  // If no valid hours found, use default
  if (earliestOpen === 24 || latestClose === 0) {
    return { startHour: 8, endHour: 21 };
  }

  return { startHour: earliestOpen, endHour: latestClose };
};

export const getWeekDays = (date: Date) => {
  const startOfWeek = new Date(date);
  startOfWeek.setDate(date.getDate() - date.getDay() + 1); // Monday
  const days = [];
  for (let i = 0; i < 7; i++) {
    const day = new Date(startOfWeek);
    day.setDate(startOfWeek.getDate() + i);
    days.push(day);
  }
  return days;
};

export const formatWeekRange = (date: Date) => {
  const startOfWeek = new Date(date);
  startOfWeek.setDate(date.getDate() - date.getDay() + 1);
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  return `${startOfWeek.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })} - ${endOfWeek.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}`;
};

export const formatDecimalHour = (decimalHour: number): string => {
  const hours = Math.floor(decimalHour);
  const minutes = Math.round((decimalHour - hours) * 60);
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};