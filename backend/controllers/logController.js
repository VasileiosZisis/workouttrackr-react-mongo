import asyncHandler from '../middleware/asyncHandler.js';
import Log from '../models/logs.js';

const createLog = asyncHandler(async (req, res) => {
  const log = new Log(req.body);
  log.author = req.user._id;
  const createdLog = await log.save();
  if (createdLog) {
    res.status(201).json(createdLog);
  } else {
    res.status(404);
    throw new Error('Failed to create the log');
  }
});

const getLogs = asyncHandler(async (req, res) => {
  const limit = Number(req.query.limit) || 12;
  const page = Number(req.query.page) || 1;

  const totalItems = await Log.countDocuments({});

  const logs = await Log.find({})
    .sort({ updatedAt: -1, createdAt: -1 })
    .skip(limit * page - limit)
    .limit(limit);

  const totalPages = Math.ceil(totalItems / limit);

  res.json({
    logs,
    pagination: {
      totalPages,
      page,
      limit,
    },
  });
});

const getLogBySlug = asyncHandler(async (req, res) => {
  const log = await Log.findOne({ slugLog: req.params.slugLog });

  if (log) {
    const limit = Number(req.query.limit) || 12;
    const page = Number(req.query.page) || 1;

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
      {
        $skip: limit * page - limit,
      },
      {
        $limit: limit,
      },
    ]);

    const totalDocuments = await Log.aggregate([
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
        $count: 'count',
      },
    ]);

    let totalItems;

    if (totalDocuments.length) {
      totalItems = totalDocuments[0].count;
    } else {
      totalItems = 0;
    }

    const totalPages = Math.ceil(totalItems / limit);

    return res.json({
      log,
      logAggregate,
      pagination: {
        totalPages,
        page,
        limit,
      },
    });
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
    throw new Error('Log update failed');
  }
});

const deleteLog = asyncHandler(async (req, res) => {
  const log = await Log.findOneAndDelete({ slugLog: req.params.slugLog });
  if (log) {
    res.status(200).json({ message: 'Log deleted' });
  } else {
    res.status(404);
    throw new Error('Log deletion failed');
  }
});

export { getLogs, getLogBySlug, createLog, deleteLog, getLogById, updateLogId };
