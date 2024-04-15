import { validationResult, param } from 'express-validator';
import jwt from 'jsonwebtoken';

export const validateFormData = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

export function verifyAuthToken(req, res, next) {
  const bearerHeader = req.headers.authorization;
  if (typeof bearerHeader !== 'undefined') {
    const token = bearerHeader.split(' ')[1];
    req.token = token;
    next();
  } else {
    res.status(401).send({
      message: 'You are not authorized to consume this resource. Please sign in',
    });
  }
}

export function validateToken(req, res, next) {
  jwt.verify(req.token, process.env.JWT_SECRET, (err, authData) => {
    if (err) {
      res.status(401).send({
        message: 'You are not authorized to consume this resource. Please sign in',
      });
    } else {
      req.user = authData.data;
      next();
    }
  });
}

export const validParamId = [
  param('id')
    .optional({ nullable: true })
    .isInt()
    .withMessage('wrong id format, must be an integer'),
];