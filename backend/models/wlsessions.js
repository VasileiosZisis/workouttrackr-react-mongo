import mongoose from 'mongoose';
import slug from 'mongoose-slug-updater';
const { Schema, model } = mongoose;
mongoose.plugin(slug);

const setSchema = new Schema({
  repetitions: { type: Number, required: true },
  kilograms: { type: Number, required: true },
  volume: {
    type: Number,
    default: function () {
      return (this.repetitions * this.kilograms).toFixed(2);
    },
  },
});

setSchema.pre('save', async function (next) {
  this.volume = await (this.repetitions * this.kilograms).toFixed(2);
  next();
});

const wlsessionSchema = new Schema(
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
    set: [setSchema],
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
  { timestamps: true }
);

wlsessionSchema.pre('save', async function () {
  this.createdDateSlug = await this.createdDate.toISOString().slice(0, 10);
});

const Wlsession = model('Wlsession', wlsessionSchema);

export default Wlsession;
