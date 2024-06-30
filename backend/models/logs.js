// const Exercise = require('./exercise');
// const Trsession = require('./trsession');
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
    // author: {
    //   type: Schema.Types.ObjectId,
    //   ref: 'User',
    // },
    // exercises: [
    //   {
    //     type: Schema.Types.ObjectId,
    //     ref: 'Exercise',
    //   },
    // ],
  },
  { timestamps: true }
);

// LogSchema.post('findOneAndDelete', async function (doc) {
//   if (doc) {
//     await Exercise.deleteMany({
//       _id: {
//         $in: doc.exercises,
//       },
//     });
//   }
// });

// LogSchema.virtual('Trsessions', {
//   ref: 'Trsession',
//   localField: '_id',
//   foreignField: 'log',
// });

// LogSchema.post('findOneAndDelete', async function (docTr) {
//   if (docTr) {
//     await Trsession.deleteMany({
//       log: docTr._id,
//     });
//   }
// });

const Log = model('Log', LogSchema);

export default Log;
