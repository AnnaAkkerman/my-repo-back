import joi from 'joi';

const registerUserSchema = joi.object({
  email: joi
    .string()
    .trim()
    .lowercase()
    .email()
    .pattern(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/)
    .required()
    .messages({
      'string.email':
        'Please fill a valid email address in lowercase. Examples of valid email addresses: john.doe@example.com, john-doe@example.com, john@example.co.uk,john.doe@example.co.in',
      'any.required': 'Email address is required',
    }),
  password: joi.string().min(3).max(32).required().messages({
    'any.required': 'Password is required!',
  }),
});

const loginUserSchema = joi.object({
  email: joi
    .string()
    .trim()
    .lowercase()
    .email()
    .pattern(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/)
    .required()
    .messages({
      'string.email':
        'Please fill a valid email address in lowercase. Examples of valid email addresses: john.doe@example.com, john-doe@example.com, john@example.co.uk,john.doe@example.co.in',
      'any.required': 'Email address is required',
    }),
  password: joi.string().required().messages({
    'any.required': 'Password is required!',
  }),
});

const updateUserSchema = joi.object({
  name: joi.string().min(2).max(32).allow().trim(),
  gender: joi
    .string()
    .valid('woman', 'man')
    .required('Gender is required')
    .messages({
      'any.required': 'Gender is required',
      'string.valid': 'Invalid gender. Valid values are woman or man.',
    }),
  dailyNorma: joi
    .number()
    .allow()
    .positive('Value must be a positive number')
    .precision(1)
    .default(1.8),
  weight: joi.number().required(),
  photoUrl: joi.string().trim(),
  timeInSports: joi.number(),
  email: joi
    .string()
    .allow('')
    .trim()
    .lowercase()
    .email()
    .pattern(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/)
    .required()
    .messages({
      'string.email':
        'Please fill a valid email address in lowercase. Examples of valid email addresses: john.doe@example.com, john-doe@example.com, john@example.co.uk,john.doe@example.co.in',
      'any.required': 'Email address is required',
    }),
});

const requestResetPasswordSchema = joi.object({
  email: joi
    .string()
    .trim()
    .lowercase()
    .email()
    .pattern(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/)
    .required()
    .messages({
      'string.email':
        'Please fill a valid email address in lowercase. Examples of valid email addresses: john.doe@example.com, john-doe@example.com, john@example.co.uk,john.doe@example.co.in',
      'any.required': 'Email address is required',
    }),
});

const resetPwdSchema = joi.object({
  token: joi.string().required().messages({
    'any.required': 'Token is required!',
  }),
  password: joi.string().required().messages({
    'any.required': 'Password is required!',
  }),
});

const loginWithGoogleAuthSchema = joi.object({
  code: joi.string().required().messages({
    'any.required': 'Code is required!',
    'string.code': 'Code must be a string!',
  }),
});

export const auth = {
  registerUserSchema,
  loginUserSchema,
  requestResetPasswordSchema,
  resetPwdSchema,
  loginWithGoogleAuthSchema,
  updateUserSchema,
};
