import mongoose from 'mongoose'
import commentSchema from './commentSchema.js'

const songSchema = new mongoose.Schema({
  name: { type: String, required: true },
  genre: { type: String },
  singer: { type: mongoose.Schema.ObjectId, ref: 'Artist', required: true },
  cover: { type: String, default: 'https://image.flaticon.com/icons/png/512/26/26433.png' }, 
  year: { type: Date, required: true },
  source: { type: String },
  musicSrc: { type: String },
  length: { type: Number },
  album: { type: mongoose.Schema.ObjectId, ref: 'Album' },
  artists: [{ type: mongoose.Schema.ObjectId, ref: 'Artist' }],
  comments: [commentSchema],
  likesCount: { type: Number, default: 0 },
  user: { type: mongoose.Schema.ObjectId, ref: 'User' },
  isDeleted: { type: Boolean, default: false, required: true },
  officialLyricSheetId: { type: mongoose.Schema.ObjectId, ref: 'LyricSheet', default: () => new mongoose.Types.ObjectId() }, //MOCK DATA
  //TODO: remove default and set up some initial data where these songs are linked to lyric sheets with ids so that this mocking is not necessary
})

export default mongoose.model('Song', songSchema)