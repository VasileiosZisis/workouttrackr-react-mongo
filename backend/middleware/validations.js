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
  title: Joi.string().alphanum().escapeHTML().required(),
});

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
  title: Joi.string().alphanum().escapeHTML().required(),
  session: Joi.string().required().valid('wlsession', 'pasession'),
});

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

const wlsessionSchema = Joi.object({
  createdDate: Joi.date().required(),
  set: Joi.array().items(
    Joi.object({
      isHard: Joi.boolean(),
      repetitions: Joi.number().min(0).required(),
      kilograms: Joi.number().min(0).required(),
    })
  ),
});

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
  set: Joi.array().items(
    Joi.object({
      isHard: Joi.boolean(),
      repetitions: Joi.number().min(0).required(),
      kilograms: Joi.number().min(0).required(),
    })
  ),
});

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

export { validateLog, validateExercise, validateWlsession, validatePasession };
