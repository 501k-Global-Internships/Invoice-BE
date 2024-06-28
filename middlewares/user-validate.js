import { body } from 'express-validator';

export const signUpConstraints = [
  body('name')
    .exists()
    .withMessage('Full name field is required')
    .bail()
    .isLength({ min: 1 })
    .withMessage('Full name field is required')
    .bail()
    .isString()
    .withMessage('The Full name must be a string')
    .trim(),

  body('email')
    .exists()
    .withMessage('email is required')
    .bail()
    .isLength({ min: 1 })
    .withMessage('email is required')
    .bail()
    .isEmail()
    .withMessage('email field must contain a valid email address')
    .trim(),

  body('password')
    .exists()
    .withMessage('password is required')
    .bail()
    .isLength({ min: 1 })
    .withMessage('password is required')
    .bail()
    .isLength({ min: 8 })
    .withMessage('password must contain at least 8 characters'),

  body('passwordConfirmation')
    .exists()
    .withMessage('password confirmation is required')
    .bail()
    .isLength({ min: 1 })
    .withMessage('password confirmation is required')
    .bail()
    .custom((value, { req }) => value === req.body.password)
    .withMessage('password confirmation must match password'),
];

export const signInConstraints = [
  body('email')
    .exists()
    .withMessage('email is required')
    .bail()
    .isLength({ min: 1 })
    .withMessage('email is required')
    .bail()
    .isEmail()
    .withMessage('email field must contain a valid email address')
    .trim(),

  body('password')
    .exists()
    .withMessage('password is required')
    .bail()
    .isLength({ min: 1 })
    .withMessage('password is required')
    .bail()
    .isLength({ min: 8 })
    .withMessage('password must contain at least 8 characters'),
];

export const authSignInConstraints = [
  body('email')
    .exists()
    .withMessage('email is required')
    .bail()
    .isLength({ min: 1 })
    .withMessage('email is required')
    .bail()
    .isEmail()
    .withMessage('email field must contain a valid email address')
    .trim(),

  body('name')
    .exists()
    .withMessage('firstName field is required')
    .bail()
    .isLength({ min: 1 })
    .withMessage('firstName field is required')
    .bail()
    .isString()
    .withMessage('the name must be a string')
    .trim(),
];

export const changePasswordConstraints = [
  body('currentPassword')
    .exists()
    .withMessage('current password field is required')
    .isLength({ min: 1 })
    .withMessage('current password field is required'),

  body('newPassword')
    .exists()
    .withMessage('new password field is required')
    .isLength({ min: 1 })
    .withMessage('new password field is required')
    .isLength({ min: 8 })
    .withMessage('new password field must contain at least 8 characters'),

  body('confirmPassword')
    .exists()
    .withMessage('confirm password field is required')
    .isLength({ min: 1 })
    .withMessage('confirm password field is required')
    .custom((value, { req }) => value === req.body.newPassword)
    .withMessage('confirm password field must match new password'),
];

export const resetPasswordEmail = [
  body('recipientEmail')
    .exists()
    .withMessage('email is required')
    .isLength({ min: 1 })
    .withMessage('email is required')
    .isEmail()
    .withMessage('email field must contain a valid email address')
    .trim(),
];

export const resetPassword = [
  body('newPassword')
    .exists()
    .withMessage('password is required')
    .isLength({ min: 1 })
    .withMessage('password is required')
    .isLength({ min: 8 })
    .withMessage('password must contain at least 8 characters'),

  body('confirmPassword')
    .exists()
    .withMessage('password confirmation is required')
    .isLength({ min: 1 })
    .withMessage('password confirmation is required')
    .custom((value, { req }) => value === req.body.newPassword)
    .withMessage('password confirmation must match newPassword'),
];
