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
        default: 0,
      },
      minutes: {
        type: Number,
        default: 0,
      },
      seconds: {
        type: Number,
        default: 0,
      },
    },
    distance: { type: Number, default: 0 },
    pace: {
      type: Number,
      default: function () {
        return this.time.totalMinutes / this.distance || 0;
      },
    },
    paceMinutes: {
      type: Number,
      default: function () {
        return Math.floor(this.pace) || 0;
      },
    },
    paceSeconds: {
      type: Number,
      default: function () {
        return Math.round((this.pace - this.paceMinutes) * 60) || 0;
      },
    },
    speed: {
      type: Number,
      default: function () {
        return this.distance / this.time.totalMinutes || 0;
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
  this.createdDateSlug = this.createdDate.toISOString().slice(0, 10);

  const totalMinutes =
    this.time.hours * 60 + this.time.minutes + this.time.seconds / 60;

  this.pace =
    this.distance > 0
      ? parseFloat((totalMinutes / this.distance).toFixed(3))
      : 0;
  this.paceMinutes = Math.floor(this.pace);
  this.paceSeconds = Math.round((this.pace - this.paceMinutes) * 60);
  this.speed =
    totalMinutes > 0
      ? parseFloat((this.distance / totalMinutes).toFixed(3))
      : 0;
});

const Pasession = model('Pasession', pasessionSchema);

export default Pasession;
