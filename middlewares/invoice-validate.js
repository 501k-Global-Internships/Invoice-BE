import { body } from 'express-validator';

export const invoiceConstraints = [
  body('brandLogo')
    .optional({ nullable: true })
    .custom((value) => isUrl(value))
    .withMessage('image link must be a URL')
    .trim(),

  body('name')
    .exists()
    .withMessage('name field is required')
    .bail()
    .isLength({ min: 1 })
    .withMessage('name field is required')
    .bail()
    .isString()
    .withMessage('the name must be a string')
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

  body('customerName')
    .exists()
    .withMessage('customerName field is required')
    .bail()
    .isLength({ min: 1 })
    .withMessage('customerName field is required')
    .bail()
    .isString()
    .withMessage('the customerName must be a string')
    .trim(),

  body('billingAddress')
    .exists()
    .withMessage('the address field is required')
    .bail()
    .isLength({ min: 1 })
    .withMessage('the address field is required')
    .bail()
    .isString()
    .withMessage('the address field must be a string')
    .trim(),

  body('phoneNumber')
    .exists()
    .withMessage('the phoneNumber field is required')
    .bail()
    .isLength({ min: 1 })
    .withMessage('the phoneNumber field is required')
    .bail()
    .isString()
    .withMessage('the phoneNumber field must be a string')
    .trim(),

  body('customerEmail')
    .exists()
    .withMessage('customerEmail is required')
    .bail()
    .isLength({ min: 1 })
    .withMessage('customerEmail is required')
    .bail()
    .isEmail()
    .withMessage('customerEmail field must contain a valid email address')
    .trim(),

  body('invoiceTitle')
    .exists()
    .withMessage('invoiceTitle field is required')
    .bail()
    .isLength({ min: 1 })
    .withMessage('invoiceTitle field is required')
    .bail()
    .isString()
    .withMessage('the invoiceTitle must be a string')
    .trim(),

  body('paymentCurrency')
    .exists()
    .withMessage('paymentCurrency field is required')
    .bail()
    .isLength({ min: 1 })
    .withMessage('paymentCurrency field is required')
    .bail()
    .isString()
    .withMessage('the paymentCurrency must be a string')
    .trim(),

  body('items')
    .exists()
    .withMessage('items field is required')
    .isArray({ min: 1 })
    .withMessage('Items must be an array with at least one item'),

  body('items.*.itemDescription')
    .exists()
    .withMessage('Item description is required')
    .isString()
    .withMessage('Item description must be a string')
    .trim(),
    
  body('items.*.quantity')
    .exists()
    .withMessage('Item Quantity is required')
    .isInt({ min: 1 })
    .withMessage('Quantity must be an integer greater than 0'),

  body('items.*.price')
    .exists()
    .withMessage('Item Price is required')
    .isNumeric()
    .withMessage('Price must be a numeric value'),

  body('items.*.amount')
    .exists()
    .withMessage('Item Amount is required')
    .isNumeric()
    .withMessage('Amount must be a numeric value'),

  body('additionalInfo')
    .optional({ nullable: true, checkFalsy: true })
    .bail()
    .isString()
    .withMessage('the additionalInfo must be a string')
    .trim(),

  body('accountName')
    .exists()
    .withMessage('accountName field is required')
    .bail()
    .isLength({ min: 1 })
    .withMessage('accountName field is required')
    .bail()
    .isString()
    .withMessage('the accountName must be a string')
    .trim(),

  body('accountNumber')
    .exists()
    .withMessage('the accountNumber field is required')
    .bail()
    .isLength({ min: 1 })
    .withMessage('the accountNumber field is required')
    .bail()
    .isString()
    .withMessage('the accountNumber field must be a string')
    .trim(),

  body('bankName')
    .exists()
    .withMessage('the bankName field is required')
    .bail()
    .isLength({ min: 1 })
    .withMessage('the bankName field is required')
    .bail()
    .isString()
    .withMessage('the bankName field must be a string')
    .trim(),

  body('issueDate')
    .exists()
    .withMessage('the issueDate field is required')
    .custom((value) => {
      if (new Date(value).toString() === 'Invalid Date') {
        throw new Error('The issueDate is not a valid date');
      }
      return true;
    })
    .trim(),

  body('dueDate')
    .exists()
    .withMessage('the dueDate field is required')
    .custom((value, { req }) => {
      if (new Date(value).toString() === 'Invalid Date') {
        throw new Error('The dueDate is not a valid date');
      }

      if (new Date(value) <= new Date(req.body.issueDate)) {
        throw new Error('The dueDate must be after the issueDate');
      }
      return true;
    })
    .trim(),

  body('discount')
    .exists()
    .withMessage('discount field is required')
    .bail()
    .isLength({ min: 1 })
    .withMessage('discount field is required')
    .bail()
    .isString()
    .withMessage('the discount must be a string')
    .trim(),

  body('tax')
    .exists()
    .withMessage('tax field is required')
    .bail()
    .isLength({ min: 1 })
    .withMessage('tax field is required')
    .bail()
    .isString()
    .withMessage('the tax must be a string')
    .trim(),
]