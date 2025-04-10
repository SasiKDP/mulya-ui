import * as Yup from 'yup';

export const buildValidationSchema = (fields) => {
  const shape = {};
  fields.forEach((field) => {
    let validator;

    // If user provided custom validation schema, use it
    if (field.validation) {
      validator = field.validation;
    } else {
      // Otherwise apply basic defaults
      switch (field.type) {
        case 'text':
        case 'date':
          validator = Yup.string();
          break;
        case 'email':
          validator = Yup.string().email('Invalid email format');
          break;
        case 'number':
          validator = Yup.string().matches(/^\d+$/, 'Must be numeric');
          break;
        case 'checkbox':
          validator = Yup.boolean();
          break;
        default:
          validator = Yup.mixed();
      }

      if (field.required) {
        validator = validator.required(`${field.label} is required`);
      }
    }

    shape[field.name] = validator;
  });

  return Yup.object().shape(shape);
};
