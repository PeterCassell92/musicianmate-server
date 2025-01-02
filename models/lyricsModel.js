import mongoose from 'mongoose'

const lyricSchema = new mongoose.Schema({
  text: { type: String, required: true }, // needed for now but will not be needed once moved to git repos with .txt / other file type backing.
  fileLocation: { type: String },
  gitCommitHash: { type: String }, //Created pre-emptively not yet in use TODO: implement simple-git
  gitRepoUrl: { type: String }, //Created pre-emptively not yet in use TODO: implement simple-git
  dateAdded: { type: Date, required: true },
})

export default mongoose.model('LyricSheet', lyricSchema)
