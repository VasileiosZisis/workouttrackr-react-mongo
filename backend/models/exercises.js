// const Trsession = require('./trsession');
import mongoose from 'mongoose';
import slug from 'mongoose-slug-updater';
const { Schema, model } = mongoose;
mongoose.plugin(slug);

const exerciseSchema = new Schema(
  {
    title: {
      type: String,
      unique: true,
    },
    slugExercise: { type: String, slug: 'title', unique: true },
    // author: {
    //   type: Schema.Types.ObjectId,
    //   ref: 'User',
    // },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
  { timestamps: true }
);

// exerciseSchema.virtual('Trsessions', {
//   ref: 'Trsession',
//   localField: '_id',
//   foreignField: 'exercise',
// });

// exerciseSchema.post('findOneAndDelete', async function (doc) {
//   if (doc) {
//     await Trsession.deleteMany({
//       exercise: doc._id,
//     });
//   }
// });

const Exercise = model('Exercise', exerciseSchema);

export default Exercise;
