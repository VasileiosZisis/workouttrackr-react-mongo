import mongoose from 'mongoose';
import slug from 'mongoose-slug-updater';
const { Schema, model } = mongoose;
mongoose.plugin(slug);

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
    time: {
      hours: {
        type: Number,
      },
      minutes: {
        type: Number,
      },
      seconds: {
        type: Number,
      },
    },
    distance: { type: Number },
    pace: {
      type: Number,
      default: function () {
        return (this.time.totalMinutes / this.distance).toFixed(3);
      },
    },
    paceMinutes: {
      type: Number,
      default: function () {
        return Math.floor(this.pace);
      },
    },
    paceSeconds: {
      type: Number,
      default: function () {
        return Math.round((this.pace - this.paceMinutes) * 60);
      },
    },
    speed: {
      type: Number,
      default: function () {
        return (this.distance / this.time.totalMinutes).toFixed(3);
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

pasessionSchema.virtual('time.totalMinutes').get(function () {
  return this.time.hours * 60 + this.time.minutes + this.time.seconds / 60;
});

pasessionSchema.pre('save', async function () {
  this.createdDateSlug = await this.createdDate.toISOString().slice(0, 10);

  this.pace = await (this.time.totalMinutes / this.distance).toFixed(3);
  this.paceMinutes = await Math.floor(this.pace);
  this.paceSeconds = await Math.round((this.pace - this.paceMinutes) * 60);
  this.speed = await (this.distance / this.time.totalMinutes).toFixed(3);
});

const Pasession = model('Pasession', pasessionSchema);

export default Pasession;
