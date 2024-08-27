import asyncHandler from '../middleware/asyncHandler.js';
import Wlsession from '../models/wlsessions.js';
import Exercise from '../models/exercises.js';
import Log from '../models/logs.js';

const createWlsession = asyncHandler(async (req, res) => {
  const log = await Log.findOne({ slugLog: req.params.slugLog });
  const exercise = await Exercise.findOne({
    slugExercise: req.params.slugExercise,
  });
  const wlsession = new Wlsession(req.body);
  wlsession.exercise = exercise._id;
  wlsession.log = log._id;
  const createdWlsession = await wlsession.save();
  if (createdWlsession) {
    res.status(201).json(createdWlsession);
  } else {
    res.status(404);
    throw new Error('Failed to create the session');
  }
});

export { createWlsession };
