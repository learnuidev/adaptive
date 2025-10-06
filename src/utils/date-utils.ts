export const safeFormatDate = (date: Date | string): string => {
  const d = date instanceof Date ? date : new Date(date);
  // Check if date is valid
  if (isNaN(d.getTime())) {
    return 'Invalid date';
  }
  return d.toLocaleDateString();
};

export const safeParseDate = (date: Date | string): Date => {
  return date instanceof Date ? date : new Date(date);
};
