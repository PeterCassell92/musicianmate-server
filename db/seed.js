import mongoose from 'mongoose'
import connectToDb from './connectToDb.js'

//* Models
import User from '../models/userModel.js'
import Artist from '../models/artistModel.js'
import Album from '../models/albumModel.js'
import Song from '../models/songModel.js'
import Playlist from '../models/playlistModel.js'
import LyricSheet from '../models/lyricsModel.js'

//* Users
import usersData from './data/userData.js'
import artistData from './data/artistData.js'
import albumData from './data/albumData.js'
import songData from './data/songData.js'


async function seedDatabase() {
  try {
    await connectToDb()
    console.log('🤖 Successfully connected to mongo')
    await mongoose.connection.db.dropDatabase()
    console.log('🤖 Removed all data')


    //* Seeding users
    const users = await User.create(usersData)
    console.log(`🤖 ${users.length} users created!`)


    //* Seeding artists
    const artistDataWithUser = artistData.map((artist) => {
      return { ...artist, user: users[0] }
    })
    const artists = await Artist.create(artistDataWithUser)


    //* Seeding albums
    const albumWithArtistAndUser = albumData.map((album) => {
      return {
        ...album,
        user: users[0],
        artists: artists,
        leadArtist: artists[0]._id,
      }
    })
    const albums = await Album.create(albumWithArtistAndUser)

    //! Initial comment to all songs
    const commentToAdd = {
      username: users[0]._id,
      text: 'A great song, indeed.',
    }

    // Seed lyric sheets
    const lyricSheets = await LyricSheet.create(
      songData.map((song) => ({
        text: `Lyrics for ${song.name}`, // Default or placeholder lyrics
        dateAdded: new Date(),
      }))
    )
    console.log(`🤖 ${lyricSheets.length} lyric sheets created!`)
    
    // Prepare songs with linked lyric sheets
    const songsWithLyricSheets = songData.map((song, index) => ({
      ...song,
      user: users[0]._id,
      singer: artists[0]._id,
      album: (index > songData / 2) ? albums[0]._id : albums[1], // Assume all songs belong to the first album
      officialLyricSheet: lyricSheets[index],
      isDeleted: false,
    }))

    const songs = await Song.create(songsWithLyricSheets)
    console.log(`🤖 ${songs.length} songs created and linked to lyric sheets!`)

    const songsBensound = songs.filter((song) => song.album.toString() === albums[0]._id.toString())
    const songsYesterday = songs.filter((song) => song.album.toString() === albums[1]._id.toString())

    //* Creating a playlist and add songs to it
    // Initial BenSound playlist
    const playlist = await Playlist.create({
      name: 'Bensound Collection',
      text: 'Mix songs from Bensound',
      songs: songsBensound,
      users: users[0],
      user: users[0],
      type: 'public',
    })

    const playlistUser = await User.findById(users[0])
    playlistUser.playlists.push(playlist._id)
    await playlistUser.save()


    //* Adding songs to an album
    const bensoundAlbum = await Album.findById(albums[0]._id)
    const yesterdayAlbum = await Album.findById(albums[1]._id)
    for (let i = 0; i < songsBensound.length; i++) {
      bensoundAlbum.songs.push(songsBensound[i]._id)
    }
    for (let i = 0; i < songsYesterday.length; i++) {
      yesterdayAlbum.songs.push(songsYesterday[i]._id)
    }

    await bensoundAlbum.save()
    await yesterdayAlbum.save()

    //* Adding songs to an artist
    const artistToAddSongsTo = await Artist.findById(artists[0]._id)
    songsYesterday.map((song) => {
      artistToAddSongsTo.songs.push(song._id)
      artistToAddSongsTo.comments.push(commentToAdd)
    })
    songsBensound.map((song) => {
      artistToAddSongsTo.songs.push(song._id)
      artistToAddSongsTo.comments.push(commentToAdd)
    })


    //* Adding albums to an artist
    albums.map((album) => {
      artistToAddSongsTo.albums.push(album)
    })
    await artistToAddSongsTo.save()


    //* Adding a song to user addedSongs
    const userWithSong = await User.findById(users[0]._id)
    songsBensound.map((song) => {
      userWithSong.addedSongs.push(song._id)
    })
    songsYesterday.map((song) => {
      userWithSong.addedSongs.push(song._id)
    })
    await userWithSong.save()
    console.log('Songs added to users addedSongs')

    await mongoose.connection.close()
    console.log('🤖 Disconnected from mongo. All done!')

  } catch (e) {
    console.log('🤖 Something went wrong')
    console.log(e)
    await mongoose.connection.close()
  }
}

seedDatabase()
