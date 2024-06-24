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