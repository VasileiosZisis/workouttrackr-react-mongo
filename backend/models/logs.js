import Exercise from './exercises.js';
// import Wlsession from './wlsessions.js';
import mongoose from 'mongoose';
import slug from 'mongoose-slug-updater';
const { Schema, model } = mongoose;
mongoose.plugin(slug);

const LogSchema = new Schema(
  {
    title: {
      type: String,
      unique: true,
    },
    slugLog: { type: String, slug: 'title', unique: true },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    exercises: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Exercise',
      },
    ],
  },
  { timestamps: true }
);

LogSchema.post('findOneAndDelete', async function (doc) {
  if (doc) {
    await Exercise.deleteMany({
      _id: {
        $in: doc.exercises,
      },
    });
  }
});

// LogSchema.virtual('Wlsessions', {
//   ref: 'Wlsession',
//   localField: '_id',
//   foreignField: 'log',
// });

// LogSchema.post('findOneAndDelete', async function (doc) {
//   if (doc) {
//     await Wlsession.deleteMany({
//       log: doc._id,
//     });
//   }
// });

const Log = model('Log', LogSchema);

export default Log;
