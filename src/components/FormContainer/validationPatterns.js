import * as Yup from 'yup';

export const patterns = {
  email: {
    dataqinc: Yup.string()
      .email('Invalid email format')
      .matches(/^[a-zA-Z0-9._%+-]+@dataqinc\.com$/, 'Email must be @dataqinc.com'),
  },
  phone: {
    tenDigit: Yup.string()
      .matches(/^\d{10}$/, 'Phone number must be exactly 10 digits'),
    international: Yup.string()
      .matches(/^\+\d{1,4}\d{10}$/, 'Must be in international format (e.g., +12345678901)'),
  },
  name: {
    standard: Yup.string()
      .min(3, 'Must be at least 3 characters')
      .max(50, 'Cannot exceed 50 characters'),
  }
};