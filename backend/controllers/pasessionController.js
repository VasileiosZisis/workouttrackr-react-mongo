import asyncHandler from '../middleware/asyncHandler.js';
import Pasession from '../models/pasessions.js';
import Exercise from '../models/exercises.js';
import Log from '../models/logs.js';

const createPasession = asyncHandler(async (req, res) => {
  const log = await Log.findOne({ slugLog: req.params.slugLog });
  const exercise = await Exercise.findOne({
    slugExercise: req.params.slugExercise,
  });
  const pasession = new Pasession(req.body);
  pasession.exercise = exercise._id;
  pasession.log = log._id;
  const createdPasession = await pasession.save();
  if (createdPasession) {
    res.status(201).json(createdPasession);
  } else {
    res.status(404);
    throw new Error('Failed to create the session');
  }
});

const getPasessionBySlug = asyncHandler(async (req, res) => {
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
      const pasession = await Pasession.findOne({
        slugSession: req.params.slugSession,
      });
      if (pasession) {
        return res.json({ pasession });
      } else {
        res.status(404);
        throw new Error('Session(PA) not found');
      }
    }
  }
});

const getPasessionById = asyncHandler(async (req, res) => {
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
      const pasession = await Pasession.findById(req.params.pasessionId);
      if (pasession) {
        return res.json(pasession);
      } else {
        res.status(404);
        throw new Error('Session not found');
      }
    }
  }
});

const updatePasessionById = asyncHandler(async (req, res) => {
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
      const pasession = await Pasession.findByIdAndUpdate(
        { _id: req.params.pasessionId },
        { ...req.body },
        {
          new: true,
        }
      );
      const updatedPasession = await pasession.save();
      if (updatedPasession) {
        res.status(200).json(updatedPasession);
      } else {
        res.status(404);
        throw new Error('Session update failed');
      }
    }
  }
});

const deletePasession = asyncHandler(async (req, res) => {
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
      const pasession = await Pasession.findOne({
        slugSession: req.params.slugSession,
      });
      if (pasession) {
        await Pasession.findByIdAndDelete(pasession._id);
        return res.json({ message: 'Session deleted' });
      } else {
        res.status(404);
        throw new Error('Session not found');
      }
    }
  }
});

export {
  createPasession,
  getPasessionBySlug,
  getPasessionById,
  updatePasessionById,
  deletePasession,
};
