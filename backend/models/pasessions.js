import mongoose from 'mongoose';
import slug from 'mongoose-slug-updater';
const { Schema, model } = mongoose;
mongoose.plugin(slug);

// const paceSchema = new Schema({
//   time: { type: Number, required: true },
//   distance: { type: Number, required: true },
//   result: {
//     type: Number,
//     default: function () {
//       return (this.time / this.distance).toFixed(2);
//     },
//   },
// });

// paceSchema.pre('save', async function (next) {
//   this.result = await (this.time / this.distance).toFixed(2);
//   next();
// });

const pasessionSchema = new Schema(
  {
    createdDate: {
      type: Date,
      default: Date.now,
    },
    createdDateSlug: {
      type: String,
    },
    slugSession: {
      type: String,
      slug: 'createdDateSlug',
      unique: true,
      permanent: true,
    },
    time: { type: Number, required: true },
    distance: { type: Number, required: true },
    pace: {
      type: Number,
      default: function () {
        return (this.time / this.distance).toFixed(2);
      },
    },
    exercise: {
      type: Schema.Types.ObjectId,
      ref: 'Exercise',
    },
    log: {
      type: Schema.Types.ObjectId,
      ref: 'Log',
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
  { timestamps: true }
);

pasessionSchema.pre('save', async function () {
  this.createdDateSlug = await this.createdDate.toISOString().slice(0, 10);
  this.pace = await (this.time / this.distance).toFixed(2);
});

const Pasession = model('Pasession', pasessionSchema);

export default Pasession;
