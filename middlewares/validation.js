const Joi = require('joi');
const { celebrate } = require('celebrate');
const isUrl = require('validator/lib/isURL');

const BadRequestError = require('../errors/400-BadRequestError');

const urlValidation = (url) => {
  if (isUrl(url)) return url;
  throw new BadRequestError('Incorrect URL');
};

const IdValidation = (id) => {
  const regex = /^[0-9a-fA-F]{24}$/;
  if (regex.test(id)) return id;
  throw new BadRequestError('Incorrect id');
};

const validationCreateUser = async (req, res, next) => {
  try {
    await celebrate({
      body: Joi.object().keys({
        name: Joi.string().min(2).max(30),
        about: Joi.string().min(2).max(30),
        email: Joi.string().required().email(),
        avatar: Joi.string().custom(urlValidation),
        password: Joi.string().required(),
      }),
    })(req, res, next);
  } catch (error) {
    next(error);
  }
};

const validationCardId = async (req, res, next) => {
  try {
    await celebrate({
      params: Joi.object().keys({
        cardId: Joi.string().required().custom(IdValidation),
      }),
    })(req, res, next);
  } catch (error) {
    next(error);
  }
};

const validationLogin = async (req, res, next) => {
  try {
    await celebrate({
      body: Joi.object().keys({
        email: Joi.string().required().email(),
        password: Joi.string().required(),
      }),
    })(req, res, next);
  } catch (error) {
    next(error);
  }
};

const validationUpdateAvatar = async (req, res, next) => {
  try {
    await celebrate({
      body: Joi.object().keys({
        avatar: Joi.string().required().custom(urlValidation),
      }),
    })(req, res, next);
  } catch (error) {
    next(error);
  }
};

const validationUpdateUser = async (req, res, next) => {
  try {
    await celebrate({
      body: Joi.object().keys({
        name: Joi.string().min(2).max(30).required(),
        about: Joi.string().min(2).max(30).required(),
      }),
    })(req, res, next);
  } catch (error) {
    next(error);
  }
};

const validationCreateCard = async (req, res, next) => {
  try {
    await celebrate({
      body: Joi.object().keys({
        name: Joi.string().min(2).max(30).required(),
        link: Joi.string().required().custom(urlValidation),
      }),
    })(req, res, next);
  } catch (error) {
    next(error);
  }
};

const validationUserId = async (req, res, next) => {
  try {
    await celebrate({
      params: Joi.object().keys({
        userId: Joi.string().required().custom(IdValidation),
      }),
    })(req, res, next);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  validationCreateUser,
  validationCardId,
  validationLogin,
  validationUpdateAvatar,
  validationUpdateUser,
  validationCreateCard,
  validationUserId,
  isUrl,
};
