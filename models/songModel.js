import mongoose from 'mongoose'
import commentSchema from './commentSchema.js'
//import lyricsModel from './lyricsModel.js'

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
  officialLyricSheet: { type: mongoose.Schema.ObjectId, ref: 'LyricSheet', default: () => new mongoose.Types.ObjectId() },
})

export default mongoose.model('Song', songSchema)