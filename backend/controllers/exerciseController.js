import asyncHandler from '../middleware/asyncHandler.js';
import Exercise from '../models/exercises.js';
import Log from '../models/logs.js';

const createExercise = asyncHandler(async (req, res) => {
  const log = await Log.findOne({ slugLog: req.params.slugLog });
  const exercise = new Exercise(req.body);
  log.exercises.push(exercise);
  const createdExercise = await Promise.all([exercise.save(), log.save()]);
  if (createdExercise) {
    res.status(201).json(createdExercise);
  } else {
    res.status(404);
    throw new Error('Failed to create the exercise');
  }
});

const getExerciseBySlug = asyncHandler(async (req, res) => {
  const log = await Log.findOne({ slugLog: req.params.slugLog });
  if (!log) {
    res.status(404);
    throw new Error('Log not found');
  } else {
    const exercise = await Exercise.findOne({
      slugExercise: req.params.slugExercise,
    });
    const exerciseAggregate = await Exercise.aggregate([
      { $match: { _id: exercise._id } },
      {
        $lookup: {
          from: 'wlsessions',
          localField: '_id',
          foreignField: 'exercise',
          as: 'wlsessions',
        },
      },
      {
        $unwind: '$wlsessions',
      },
      {
        $sort: { 'wlsessions._id': -1 },
      },
      // {
      //   $skip: limit * page - limit,
      // },
      // {
      //   $limit: limit,
      // },
    ]);
    if (exercise) {
      return res.json({ exercise, exerciseAggregate });
    } else {
      res.status(404);
      throw new Error('Exercise not found');
    }
  }
});

const getExerciseById = asyncHandler(async (req, res) => {
  const log = await Log.findOne({ slugLog: req.params.slugLog });
  if (!log) {
    res.status(404);
    throw new Error('Log not found');
  } else {
    const exercise = await Exercise.findById(req.params.exerciseId);
    if (exercise) {
      return res.json(exercise);
    } else {
      res.status(404);
      throw new Error('Exercise not found');
    }
  }
});

const updateExerciseId = asyncHandler(async (req, res) => {
  const log = await Log.findOne({ slugLog: req.params.slugLog });
  if (!log) {
    res.status(404);
    throw new Error('Log not found');
  } else {
    const exercise = await Exercise.findByIdAndUpdate(
      { _id: req.params.exerciseId },
      { ...req.body },
      {
        new: true,
      }
    );
    const updatedExercise = await exercise.save();
    if (updatedExercise) {
      res.status(200).json(updatedExercise);
    } else {
      res.status(404);
      throw new Error('Exercise update failed');
    }
  }
});

const deleteExercise = asyncHandler(async (req, res) => {
  console.log(req.params);
  const log = await Log.findOne({ slugLog: req.params.slugLog });
  if (!log) {
    res.status(404);
    throw new Error('Log not found');
  } else {
    const exercise = await Exercise.findOne({
      slugExercise: req.params.slugExercise,
    });
    if (exercise) {
      await Log.findByIdAndUpdate(log._id, {
        $pull: {
          exercises: exercise._id,
        },
      });
      await Exercise.findByIdAndDelete(exercise._id);
      res.json({ message: 'Exercise deleted' });
    } else {
      res.status(404);
      throw new Error('Exercise deletion failed');
    }
  }
});

export {
  createExercise,
  getExerciseBySlug,
  getExerciseById,
  updateExerciseId,
  deleteExercise,
};
