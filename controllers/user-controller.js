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
          name: usr.firstName,
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
}

export default new UserController();