import mongoose from 'mongoose';
import slug from 'mongoose-slug-updater';
const { Schema, model } = mongoose;
mongoose.plugin(slug);

const setSchema = new Schema({
  repetitions: { type: Number, required: true, required: true },
  kilograms: { type: Number, required: true, required: true },
  volume: {
    type: Number,
    default: function () {
      return (this.repetitions * this.kilograms).toFixed(2);
    },
  },
});

setSchema.pre('save', function (next) {
  this.volume = (this.repetitions * this.kilograms).toFixed(2);
  next();
});

const wlsessionSchema = new Schema(
  {
    createdDate: {
      type: Date,
      default: Date.now,
      required: true,
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
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
  { timestamps: true }
);

wlsessionSchema.pre('save', async function () {
  this.createdDateSlug = await this.createdDate.toISOString().slice(0, 10);
});

const Wlsession = model('Wlsession', wlsessionSchema);

export default Wlsession;
