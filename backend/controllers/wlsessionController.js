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

const getWlsessionBySlug = asyncHandler(async (req, res) => {
  const log = await Log.findOne({ slugLog: req.params.slugLog });
  if (!log) {
    res.status(404);
    throw new Error('Log not found');
  } else {
    const exercise = await Exercise.findOne({
      slugExercise: req.params.slugExercise,
    });
    if (!exercise) {
      res.status(404);
      throw new Error('Exercise not found');
    } else {
      const wlsession = await Wlsession.findOne({
        slugSession: req.params.slugSession,
      });
      if (wlsession) {
        return res.json({ wlsession });
      } else {
        res.status(404);
        throw new Error('Session not found');
      }
    }
  }
});

const getWlsessionById = asyncHandler(async (req, res) => {
  const log = await Log.findOne({ slugLog: req.params.slugLog });
  if (!log) {
    res.status(404);
    throw new Error('Log not found');
  } else {
    const exercise = await Exercise.findOne({
      slugExercise: req.params.slugExercise,
    });
    if (!exercise) {
      res.status(404);
      throw new Error('Exercise not found');
    } else {
      const wlsession = await Wlsession.findById(req.params.wlsessionId);
      if (wlsession) {
        return res.json(wlsession);
      } else {
        res.status(404);
        throw new Error('Session not found');
      }
    }
  }
});

const updateWlsessionById = asyncHandler(async (req, res) => {
  const log = await Log.findOne({ slugLog: req.params.slugLog });
  if (!log) {
    res.status(404);
    throw new Error('Log not found');
  } else {
    const exercise = await Exercise.findOne({
      slugExercise: req.params.slugExercise,
    });
    if (!exercise) {
      res.status(404);
      throw new Error('Exercise not found');
    } else {
      const wlsession = await Wlsession.findByIdAndUpdate(
        { _id: req.params.wlsessionId },
        { ...req.body },
        {
          new: true,
        }
      );
      const updatedWlsession = await wlsession.save();
      if (updatedWlsession) {
        res.status(200).json(updatedWlsession);
      } else {
        res.status(404);
        throw new Error('Session update failed');
      }
    }
  }
});

const deleteWlsession = asyncHandler(async (req, res) => {
  const log = await Log.findOne({ slugLog: req.params.slugLog });
  if (!log) {
    res.status(404);
    throw new Error('Log not found');
  } else {
    const exercise = await Exercise.findOne({
      slugExercise: req.params.slugExercise,
    });
    if (!exercise) {
      res.status(404);
      throw new Error('Exercise not found');
    } else {
      const wlsession = await Wlsession.findOne({
        slugSession: req.params.slugSession,
      });
      if (wlsession) {
        await Wlsession.findByIdAndDelete(wlsession._id);
        return res.json({ message: 'Session deleted' });
      } else {
        res.status(404);
        throw new Error('Session not found');
      }
    }
  }
});

export {
  createWlsession,
  getWlsessionBySlug,
  getWlsessionById,
  updateWlsessionById,
  deleteWlsession,
};
