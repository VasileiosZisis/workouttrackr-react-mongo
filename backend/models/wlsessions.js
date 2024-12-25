import mongoose from 'mongoose';
import slug from 'mongoose-slug-updater';
const { Schema, model } = mongoose;
mongoose.plugin(slug);

const setSchema = new Schema({
  repetitions: { type: Number },
  kilograms: { type: Number },
  isHard: { type: Boolean, default: false },
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
    totalVolume: {
      type: Number,
      default: function () {
        const result = this.set.map((a) => a.volume);
        if (result.length) {
          return result.reduce((acc, cur) => acc + cur, 0);
        } else {
          return (result = 0);
        }
      },
    },
    junkVolume: {
      type: Number,
      default: function () {
        const result = this.set.map((x) => {
          if (x.isHard === false) {
            return x.volume;
          } else return 0;
        });
        if (result.length) {
          return result.reduce((acc, cur) => acc + cur, 0);
        } else {
          return (result = 0);
        }
      },
    },
    workingVolume: {
      type: Number,
      default: function () {
        const result = this.set.map((v) => {
          if (v.isHard === true) {
            return v.volume;
          } else return 0;
        });
        if (result.length) {
          return result.reduce((acc, cur) => acc + cur, 0);
        } else {
          return (result = 0);
        }
      },
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
