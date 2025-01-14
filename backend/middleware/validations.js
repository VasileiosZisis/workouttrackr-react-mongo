import BaseJoi from 'joi';
import sanitizeHtml from 'sanitize-html';

const extension = (joi) => ({
  type: 'string',
  base: joi.string(),
  messages: {
    'string.escapeHTML': '{{#label}} must not include HTML!',
  },
  rules: {
    escapeHTML: {
      validate(value, helpers) {
        const clean = sanitizeHtml(value, {
          allowedTags: [],
          allowedAttributes: {},
        });
        if (clean !== value)
          return helpers.error('string.escapeHTML', { value });
        return clean;
      },
    },
  },
});

const Joi = BaseJoi.extend(extension);

const logSchema = Joi.object({
  title: Joi.string()
    .pattern(/^[a-z]+$/)
    .escapeHTML()
    .required(),
}).options({ allowUnknown: true });

const validateLog = (req, res, next) => {
  const { error } = logSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(',');
    res.status(404);
    throw new Error(msg);
  } else {
    next();
  }
};

const exerciseSchema = Joi.object({
  title: Joi.string()
    .pattern(/^[a-z]+$/)
    .escapeHTML()
    .required(),
  session: Joi.string().required().valid('wlsession', 'pasession'),
}).options({ allowUnknown: true });

const exerciseEditSchema = Joi.object({
  title: Joi.string()
    .pattern(/^[a-z]+$/)
    .escapeHTML()
    .required(),
  session: Joi.string().valid('wlsession', 'pasession'),
}).options({ allowUnknown: true });

const validateExercise = (req, res, next) => {
  const { error } = exerciseSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(',');
    res.status(404);
    throw new Error(msg);
  } else {
    next();
  }
};

const validateUpdateExercise = (req, res, next) => {
  const { error } = exerciseEditSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(',');
    res.status(404);
    throw new Error(msg);
  } else {
    next();
  }
};

const wlsessionSchema = Joi.object({
  createdDate: Joi.date().required(),
  set: Joi.array().items(
    Joi.object({
      _id: Joi.string().escapeHTML(),
      volume: Joi.number(),
      isHard: Joi.boolean(),
      repetitions: Joi.number().min(0).required(),
      kilograms: Joi.number().min(0).required(),
    })
  ),
}).options({ allowUnknown: true });

const validateWlsession = (req, res, next) => {
  const { error } = wlsessionSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(',');
    res.status(404);
    throw new Error(msg);
  } else {
    next();
  }
};

const pasessionSchema = Joi.object({
  createdDate: Joi.date().required(),
  time: Joi.object({
    hours: Joi.number().min(0).required(),
    minutes: Joi.number().min(0).required(),
    seconds: Joi.number().min(0).required(),
  }),
  distance: Joi.number().min(0).required(),
}).options({ allowUnknown: true });

const validatePasession = (req, res, next) => {
  const { error } = pasessionSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(',');
    res.status(404);
    throw new Error(msg);
  } else {
    next();
  }
};

const userSchema = Joi.object({
  username: Joi.string().required().escapeHTML(),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .escapeHTML(),
  password: Joi.string().min(6).required().escapeHTML(),
});

const userEditSchema = Joi.object({
  username: Joi.string().required().escapeHTML(),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .escapeHTML(),
  password: Joi.string().min(6).allow('').escapeHTML(),
});

const validateRegisterUser = (req, res, next) => {
  const { error } = userSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(',');
    res.status(404);
    throw new Error(msg);
  } else {
    next();
  }
};

const validateUpdateUser = (req, res, next) => {
  const { error } = userEditSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(',');
    res.status(404);
    throw new Error(msg);
  } else {
    next();
  }
};

export {
  validateLog,
  validateExercise,
  validateUpdateExercise,
  validateWlsession,
  validatePasession,
  validateRegisterUser,
  validateUpdateUser,
};
