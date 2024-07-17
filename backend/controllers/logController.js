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
  const logs = await Log.find({}).sort({ updatedAt: -1, createdAt: -1 });
  res.json(logs);
});

const getLogBySlug = asyncHandler(async (req, res) => {
  const log = await Log.findOne({ slugLog: req.params.slugLog });

  const logAggregate = await Log.aggregate([
    { $match: { _id: log._id } },
    {
      $lookup: {
        from: 'exercises',
        localField: 'exercises',
        foreignField: '_id',
        as: 'exercises',
      },
    },
    {
      $unwind: '$exercises',
    },
    {
      $sort: { 'exercises._id': -1 },
    },
    // {
    //   $skip: limit * page - limit,
    // },
    // {
    //   $limit: limit,
    // },
  ]);

  if (log) {
    return res.json({ log, logAggregate });
  } else {
    res.status(404);
    throw new Error('Log not found');
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

export { getLogs, getLogBySlug, createLog, deleteLog, getLogById, updateLogId };
