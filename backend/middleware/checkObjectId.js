import { isValidObjectId } from 'mongoose';

function checkObjectId(paramName = 'id') {
  return (req, res, next) => {
    if (!isValidObjectId(req.params[paramName])) {
      res.status(404);
      throw new Error(
        `Invalid ObjectId for parameter '${paramName}': ${req.params[paramName]}`
      );
    }
    next();
  };
}

export default checkObjectId;
