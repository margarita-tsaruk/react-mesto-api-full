const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { NODE_ENV, JWT_SECRET } = process.env;

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

  bcrypt.hash(password, 10)
    .then((hashedPassword) => User.create({
      name, about, avatar, email, password: hashedPassword,
    }))
    .then((newUser) => res.send(newUser))
    .catch((err) => {
      if (err.code === 11000) {
        next(new ErrorExistingUser('Пользователь с таким email уже существует'));
      } else if (err.name === 'ValidationError') {
        next(new ErrorBadReq('Переданы некорректные данные при создании пользователя'));
      } else {
        next(err);
      }
    });
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
            }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');

            res.cookie('jwt', token, {
              expiresIn: '7d',
              httpOnly: true,
              sameSite: false,
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

function logout(req, res, next) {
  try {
    if (!req.cookies) {
      next(new ErrorReqNotFound('Пользователь с указанным _id не найден'));
      return;
    }
    res.clearCookie('jwt').send({ message: 'Ok' }).end();
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createUser,
  login,
  getUsers,
  getUser,
  getUserById,
  updateUser,
  updateAvatar,
  logout,
};
