import asyncHandler from '../middleware/asyncHandler.js';
import Log from '../models/logs.js';

const createLog = asyncHandler(async (req, res) => {
  const log = new Log(req.body);
  const createdLog = await log.save();
  if (createdLog) {
    res.status(201).json(createdLog);
  } else {
    res.status(404);
    throw new Error('Failed to create the log');
  }
});

const getLogs = asyncHandler(async (req, res) => {
  const logs = await Log.find({});
  res.json(logs);
});

// const getLogById = asyncHandler(async (req, res) => {
//   const log = await Log.findById(req.params.id);
//   if (log) {
//     return res.json(log);
//   } else {
//     res.status(404);
//     throw new Error('Log not found');
//   }
// });

const getLogBySlug = asyncHandler(async (req, res) => {
  const log = await Log.findOne({ slugLog: req.params.slugLog });
  if (log) {
    return res.json(log);
  } else {
    res.status(404);
    throw new Error('Log not found');
  }
});

const updateLog = asyncHandler(async (req, res) => {
  const log = await Log.findOneAndUpdate(
    { slugLog: req.params.slugLog },
    { ...req.body },
    {
      new: true,
    }
  );
  if (log) {
    console.log(req.body);
    res.status(200).json(log);
  } else {
    res.status(404);
    throw new Error('Log not found');
  }
});

const deleteLog = asyncHandler(async (req, res) => {
  const log = await Log.findById(req.params.id);
  if (log) {
    res.status(200).json({ message: 'Log deleted' });
  } else {
    res.status(404);
    throw new Error('Log not found');
  }
});

export { getLogs, getLogBySlug, createLog, updateLog, deleteLog };
