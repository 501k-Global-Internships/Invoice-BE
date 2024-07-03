import passwordHash from 'password-hash';
import { v4 as uuidv4 } from 'uuid';
import {
  getErrorMessage, signJsonWebToken,
  resetPasswordEmail, signInEmail, signUpEmail,
  changePasswordEmail, passwordResetEmail
} from '../utils/utils';
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
        });

        signUpEmail(usr)
          .then(() => console.log('Sign-up email sent successfully'))
          .catch((error) => console.error('Error sending sign-up email:', error));
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
        res.status(201).send({
          id: usr.id,
          name: usr.name,
          email: usr.email,
          message: 'Sign in successful',
          token: signJsonWebToken(usr),
        });

        signInEmail(usr)
          .then(() => console.log('Sign-in email sent successfully'))
          .catch((error) => console.error('Error sending sign-in email:', error));
      } else {
        res.status(400).send({ message: 'Incorrect password' });
      }
    }).catch((error) => {
      getErrorMessage(error);
    });
  }

  authSignIn(req, res) {
    user.findOne({
      where: {
        email: req.body.email,
      },
    })
      .then((usr) => {
        if (usr) {
          // User found, sign in and return token
          const token = signJsonWebToken(usr);
          res.status(201).json({
            id: usr.id,
            name: usr.name,
            email: usr.email,
            message: 'Sign in successful',
            token,
          });

          // Send sign-in email asynchronously
          signInEmail(usr)
            .then(() => console.log('Sign-in email sent successfully'))
            .catch((error) => console.error('Error sending sign-in email:', error));
        } else {
          // If the user doesn't exist, create a new user
          return user.create({
            name: req.body.name,
            email: req.body.email,
          })
            .then((createdUser) => {
              const token = signJsonWebToken(createdUser);
              res.status(201).json({
                id: createdUser.id,
                name: createdUser.name,
                email: createdUser.email,
                message: 'User created and signed in successfully',
                token,
              });

              // Send sign-up email asynchronously
              signUpEmail(createdUser)
                .then(() => console.log('Sign-up email sent successfully'))
                .catch((error) => console.error('Error sending sign-up email:', error));
            })
            .catch((error) => {
              console.error('Error creating user:', error);
              return res.status(400).json({
                message: 'An error occurred while trying to sign up. Please try again',
              });
            });
        }
      })
      .catch((error) => {
        console.error('Error finding user:', error);
        return res.status(401).json({
          error: getErrorMessage(error),
        });
      });
  }

  checkPasswordSet(req, res) {
    user.findOne({
      where: {
        id: req.user.id,
      },
    }).then((usr) => {
      if (usr && usr.passwordHash) {
        return res.status(200).json({ isPasswordSet: true });
      } else {
        return res.status(200).json({ isPasswordSet: false });
      }
    }).catch((error) => {
      console.error('Error checking password set:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    });
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

            res.status(200).send({
              message: 'Password changed successfully',
            });

            changePasswordEmail(usr)
              .then((response) => res.status(200).send(response))
              .then(() => console.log('Change password email sent successfully'))
              .catch((error) => console.error('Error sending Change password email:', error));
          }
        });
      } else {
        return res.status(400).send({
          message: 'Current password is incorrect',
        });
      }
    });
  }

  sendRecoveryPasswordId(req, res) {
    const newUuid = uuidv4();
    user.update({
      recoveryPasswordId: newUuid
    },
      { where: { email: req.body.recipientEmail }, returning: true },
    ).then((updated) => {
      const user = updated[1][0]
      if (user) {
        passwordResetEmail(user)
          .then(() => {
            res.status(201).send({
              message: 'Reset password email sent successfully',
            });
          }).catch((error) => console.error('Error sending reset password email:', error));

        return;
      }
    });
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
            res.status(200).send({
              message: 'Your new Password has been created successfully',
            });

            resetPasswordEmail(usr)
              .then(() => console.log('Password reset success email sent successfully'))
              .catch((error) => console.error('Error sending password reset success email:', error))
          }
        });
      } else {
        res.status(404).send({ message: 'Invalid or expired password reset link. Please request a new password reset.' });
      }
    });
  }
}

export default new UserController();