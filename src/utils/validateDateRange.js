import dayjs from "dayjs";

export const validateDateRange = (startDate, endDate) => {
    const today = dayjs().startOf('day');
    if (startDate && endDate && startDate > endDate) {
      return 'Start date cannot be greater than End date';
    }
    if (!startDate || !endDate) {
      return 'Both Start and End dates are required.';
    }
    if (startDate > today) {
      return 'Start date cannot be in the future.';
    }
    if (endDate > today) {
      return 'End date cannot be in the future.';
    }
    return '';
  };