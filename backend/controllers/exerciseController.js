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

const getExercises = asyncHandler(async (req, res) => {
  const exercises = await Exercise.find({});
  res.json(exercises);
});

const getExerciseBySlug = asyncHandler(async (req, res) => {
  const exercise = await Exercise.findOne({
    slugExercise: req.params.slugExercise,
  });
  if (exercise) {
    return res.json(exercise);
  } else {
    res.status(404);
    throw new Error('Exercise not found');
  }
});

const getLogById = asyncHandler(async (req, res) => {
  const log = await Log.findById(req.params.id);
  if (log) {
    return res.json(log);
  } else {
    res.status(404);
    throw new Error('Log not found');
  }
});

const updateLogId = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const log = await Log.findByIdAndUpdate(
    id,
    { ...req.body },
    {
      new: true,
    }
  );
  const updatedLog = await log.save();
  if (updatedLog) {
    res.status(200).json(updatedLog);
  } else {
    res.status(404);
    throw new Error('Log not found');
  }
});

const deleteLog = asyncHandler(async (req, res) => {
  const log = await Log.findOneAndDelete({ slugLog: req.params.slugLog });
  if (log) {
    res.status(200).json({ message: 'Log deleted' });
  } else {
    res.status(404);
    throw new Error('Log not found');
  }
});

export { createExercise, getExercises, getExerciseBySlug };
