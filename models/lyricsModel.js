import mongoose from 'mongoose'

const lyricSchema = new mongoose.Schema({
  text: { type: String, required: true, default: 'Hey now yeah now,/r Hey now woah now/r' },
  /**lyrics may be associated with only one song however each song may have many versions of the the lyrics for works
     in progress etc. songId connects the lyrics to the song whilst officialLyricSheetId in Song links the master lyrics copy
     TODO: develop the UI for editing different lyrics versions
     - either create own editor or be smart and utilise other text edit/ lyrics editor tools within the page.
    **/  
  songId: { type: mongoose.Schema.ObjectId , default: () => new mongoose.Types.ObjectId() },
})

export default mongoose.model('LyricSheet', lyricSchema)
