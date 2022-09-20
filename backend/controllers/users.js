const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const ErrorReqNotFound = require('../errors/errorReqNotFound');
const ErrorBadReq = require('../errors/errorBadReq');
const ErrorExistingUser = require('../errors/errorExistingUser');
const AuthError = require('../errors/authError');

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

const getUser = (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        next(new ErrorReqNotFound('Пользователь с указанным _id не найден'));
      } else {
        res.send(user);
      }
    })
    .catch((err) => {
      next(err);
    });
};

const createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new ErrorExistingUser('Пользователь с таким email уже существует');
      } else {
        bcrypt.hash(password, 10)
          .then((hashedPassword) => {
            User.create({
              name,
              about,
              avatar,
              email,
              password: hashedPassword,
            })
              .then((newUser) => res.send(newUser))
              .catch((err) => {
                if (err.name === 'ValidationError') {
                  throw new ErrorBadReq('Переданы некорректные данные при создании пользователя');
                }
              })
              .catch(next);
          });
      }
    })
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        throw new AuthError('Неправильный пароль или email');
      }
      bcrypt.compare(password, user.password)
        .then((isUserValid) => {
          if (isUserValid) {
            const token = jwt.sign({
              _id: user._id,
            }, 'SECRET');

            res.cookie('jwt', token, {
              expiresIn: '7d',
              httpOnly: true,
              sameSite: true,
            });

            res.send({ data: user.toJSON() });
          } else {
            throw new AuthError('Неправильные почта или пароль');
          }
        })
        .catch(next);
    })
    .catch(next);
};

const getUserById = (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new ErrorReqNotFound('Пользователь с указанным _id не найден');
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ErrorBadReq('Переданы некорректные данные при обновлении профиля'));
      } else {
        next(err);
      }
    });
};

const updateUser = (req, res, next) => {
  const { name, about } = req.body;
  const id = req.user._id;
  User.findByIdAndUpdate(id, { name, about }, {
    new: true,
    runValidators: true,
  })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ErrorBadReq('Переданы некорректные данные при обновлении профиля'));
      } else {
        next(err);
      }
    });
};

function updateAvatar(req, res, next) {
  const { avatar } = req.body;
  const id = req.user._id;
  User.findByIdAndUpdate(id, { avatar }, {
    new: true,
    runValidators: true,
  })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ErrorBadReq('Переданы некорректные данные при обновлении аватара'));
      } else {
        next(err);
      }
    });
}

module.exports = {
  createUser,
  login,
  getUsers,
  getUser,
  getUserById,
  updateUser,
  updateAvatar,
};
