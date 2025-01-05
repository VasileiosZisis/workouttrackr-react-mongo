import asyncHandler from '../middleware/asyncHandler.js';
import Log from '../models/logs.js';
import Exercise from '../models/exercises.js';
import Wlsession from '../models/wlsessions.js';
import Pasession from '../models/pasessions.js';

const isLogAuthor = asyncHandler(async (req, res, next) => {
  const log = await Log.findOne({ slugLog: req.params.slugLog });
  if (!log) {
    res.status(404);
    throw new Error('Log not found');
  }
  if (!log.author.equals(req.user._id)) {
    res.status(403);
    throw new Error('You do not have permission to do that');
  }
  next();
});

const isExerciseAuthor = asyncHandler(async (req, res, next) => {
  const log = await Log.findOne({ slugLog: req.params.slugLog });
  const exercise = await Exercise.findOne({
    slugExercise: req.params.slugExercise,
  });
  if (!log) {
    res.status(404);
    throw new Error('Log not found');
  }
  if (!log.author.equals(req.user._id)) {
    res.status(403);
    throw new Error('You do not have permission to do that');
  }
  if (!exercise) {
    res.status(404);
    throw new Error('Exercise not found');
  }
  if (!exercise.author.equals(req.user._id)) {
    res.status(403);
    throw new Error('You do not have permission to do that');
  }
  next();
});

const isWlsessionAuthor = asyncHandler(async (req, res, next) => {
  const log = await Log.findOne({ slugLog: req.params.slugLog });
  const exercise = await Exercise.findOne({
    slugExercise: req.params.slugExercise,
  });
  const wlsession = await Wlsession.findOne({
    slugSession: req.params.slugSession,
  });
  if (!log) {
    res.status(404);
    throw new Error('Log not found');
  }
  if (!log.author.equals(req.user._id)) {
    res.status(403);
    throw new Error('You do not have permission to do that');
  }
  if (!exercise) {
    res.status(404);
    throw new Error('Exercise not found');
  }
  if (!exercise.author.equals(req.user._id)) {
    res.status(403);
    throw new Error('You do not have permission to do that');
  }
  if (!wlsession) {
    res.status(404);
    throw new Error('Session(WL) not found');
  }
  if (!wlsession.author.equals(req.user._id)) {
    res.status(403);
    throw new Error('You do not have permission to do that');
  }
  next();
});

const isPasessionAuthor = asyncHandler(async (req, res, next) => {
  const log = await Log.findOne({ slugLog: req.params.slugLog });
  const exercise = await Exercise.findOne({
    slugExercise: req.params.slugExercise,
  });
  const pasession = await Pasession.findOne({
    slugSession: req.params.slugSession,
  });
  if (!log) {
    res.status(404);
    throw new Error('Log not found');
  }
  if (!log.author.equals(req.user._id)) {
    res.status(403);
    throw new Error('You do not have permission to do that');
  }
  if (!exercise) {
    res.status(404);
    throw new Error('Exercise not found');
  }
  if (!exercise.author.equals(req.user._id)) {
    res.status(403);
    throw new Error('You do not have permission to do that');
  }
  if (!pasession) {
    res.status(404);
    throw new Error('Session(PA) not found');
  }
  if (!pasession.author.equals(req.user._id)) {
    res.status(403);
    throw new Error('You do not have permission to do that');
  }
  next();
});

export { isLogAuthor, isExerciseAuthor, isWlsessionAuthor, isPasessionAuthor };
