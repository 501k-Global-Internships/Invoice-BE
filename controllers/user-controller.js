import passwordHash from 'password-hash';
import { getErrorMessage, signJsonWebToken } from '../utils/utils'
import models from '../models';

const { user } = models;

class UserController {
  signUp(req, res) {
    user.create(
      {
        name: req.body.name,
        email: req.body.email,
        passwordHash: passwordHash.generate(req.body.password),
      }).then((usr) => {
        res.status(201).send({
          id: usr.id,
          name: usr.name,
          email: usr.email,
          message: 'user created successfully',
          token: signJsonWebToken(usr),
        })
      }).catch((error) => {
        if (error.name === 'SequelizeUniqueConstraintError') {
          return res.status(409).send({
            message: `A user with the email '${req.body.email}' already exists`,
          });
        }

        getErrorMessage(error);
      });
  }

  signIn(req, res) {
    user.findOne({
      where: {
        email: req.body.email,
      },
    }).then((usr) => {
      if (usr === null) {
        return res.status(404).send({ message: 'User not found' });
      }

      if (passwordHash.verify(req.body.password, usr.passwordHash)) {
        return res.status(201).send({
          id: usr.id,
          name: usr.name,
          email: usr.email,
          message: 'Sign in successful',
          token: signJsonWebToken(usr),
        });
      }

      res.status(404).send({ message: 'User not found' });
    }).catch((error) => {
      getErrorMessage(error);
    });
  }

  authSignIn(req, res) {
    user.findOne({
      where: {
        email: req.body.email,
      },
    }).then((usr) => {
      if (usr) {
        // User found, sign in and return token
        const token = signJsonWebToken(usr);
        return res.status(201).json({
          id: usr.id,
          name: usr.name,
          email: usr.email,
          message: 'Sign in successful',
          token,
        });
      }

      // If the user doesn't exist, create a new user
      return user.create({
        name: req.body.name,
        email: req.body.email,
      }).then((createdUser) => {
        const token = signJsonWebToken(createdUser);
        res.status(201).json({
          id: createdUser.id,
          name: createdUser.name,
          email: createdUser.email,
          message: 'User created and signed in successfully',
          token,
        });
      }).catch((error) => {
        console.log(error);
        return res.status(400).json({
          message: 'An error occurred while trying to sign up. Please try again',
        });
      });
    }).catch((error) => res.status(401).json({
      error: getErrorMessage(error),
    }))
  }
}

export default new UserController();