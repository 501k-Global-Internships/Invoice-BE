import passwordHash from 'password-hash';
import { v4 as uuidv4 } from 'uuid';
import { getErrorMessage, signJsonWebToken, resetPasswordEmail } from '../utils/utils';
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

      res.status(400).send({ message: 'Incorrect password' });
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

  changePassword(req, res) {
    user.findOne({
      where: {
        id: req.user.id,
      },
    }).then((usr) => {
      if (passwordHash.verify(req.body.currentPassword, usr.passwordHash)) {
        if (req.body.currentPassword === req.body.newPassword) {
          return res.status(400).send({
            message: "New password can't be the same as current password",
          });
        }

        user.update(
          {
            passwordHash: passwordHash.generate(req.body.newPassword),
          },
          {
            where: {
              id: req.user.id,
            },
          },
        ).then((changedPassword) => {
          if (changedPassword) {
            return res.status(200).send({
              message: 'Password changed successfully',
            });
          }
        });
      } else {
        return res.status(400).send({
          message: 'Current password is incorrect',
        });
      }
    });
  }

  sendRecoveryPasswordId(req, res, next) {
    const newUuid = uuidv4();
    user.update({
      recoveryPasswordId: newUuid
    },
      { where: { email: req.body.recipientEmail }, returning: true },
    ).then((updated) => {
      req.user = updated[1][0]
      if (updated) {
        return next();
      }
    });
  }

  resetPasswordEmail(req, res) {
    resetPasswordEmail(req, req.body)
      .then((response) => res.status(200).send(response))
      .catch((error) => res.status(404).send({ message: error.message }));
  }

  resetPassword(req, res) {
    const { recoveryPasswordId } = req.query;

    user.findOne({
      where: {
        recoveryPasswordId,
      },
    }).then((usr) => {
      if (usr) {
        user.update(
          {
            passwordHash: passwordHash.generate(req.body.newPassword),
            recoveryPasswordId: null,
          },
          {
            where: {
              id: usr.id,
            },
          },
        ).then((updatedPassword) => {
          if (updatedPassword) {
            return res.status(200).send({
              message: 'Your new Password has been created successfully',
            });
          }
        });
      } else {
        res.status(404).send({ message: 'Invalid or expired password reset link. Please request a new password reset.' });
      }
    });
  }
}

export default new UserController();