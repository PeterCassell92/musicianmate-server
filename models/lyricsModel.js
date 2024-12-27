import mongoose from 'mongoose'

const lyricSchema = new mongoose.Schema({
  text: { type: String, required: true, default: 'Hey now yeah now,/r Hey now woah now/r' },
  songId: { type: mongoose.Schema.ObjectId , default: () => new mongoose.Types.ObjectId() },
})

export default mongoose.model('LyricSheet', lyricSchema)
