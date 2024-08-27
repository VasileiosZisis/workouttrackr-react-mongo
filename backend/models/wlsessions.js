import mongoose from 'mongoose';
import slug from 'mongoose-slug-updater';
const { Schema, model } = mongoose;
mongoose.plugin(slug);

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
    // set: [
    //   new Schema({
    //     repetitions: Number,
    //     kilograms: Number,
    //     isHard: {
    //       type: Boolean,
    //       default: false,
    //     },
    //     volume: {
    //       type: Number,
    //       default: function () {
    //         return (this.repetitions * this.kilograms).toFixed(2);
    //       },
    //     },
    //   }),
    // ],
    // totalVolume: {
    //   type: Number,
    //   default: function () {
    //     const result = this.weights.map((a) => a.volume);
    //     if (result.length) {
    //       return result.reduce((acc, cur) => acc + cur, 0);
    //     } else {
    //       return (result = 0);
    //     }
    //   },
    // },
    exercise: {
      type: Schema.Types.ObjectId,
      ref: 'Exercise',
    },
    log: {
      type: Schema.Types.ObjectId,
      ref: 'Log',
    },
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

wlsessionSchema.pre('save', async function () {
  this.createdDateSlug = await this.createdDate.toISOString().slice(0, 10);
});

// wlsessionSchema.post('findOneAndUpdate', async function () {
//   const docToUpdate = await this.model.findOne(this.getQuery());
//   const result = await docToUpdate.weights.map((a) => a.volume);
//   docToUpdate.totalVolume = await result.reduce((acc, cur) => acc + cur, 0);
//   await docToUpdate.save();
// });

const Wlsession = model('Wlsession', wlsessionSchema);

export default Wlsession;
