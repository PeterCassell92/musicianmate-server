
# MusicianMate

Built off the back of 

https://github.com/guykozlovskij/ga-project-3-client By [Guy Kozlovskij](https://github.com/guykozlovskij), [Ali Shan](https://github.com/Aliwebs) and [Steven Saunders](https://github.com/SuperSuperStore).

## Table of Contents

- [Overview](#overview)
- [Brief](#brief)
- [Technologies Used](#technologies)
- [Approach](#approach)
  - [Backend](#backend)
    - [Models](#models)
    - [Controllers for RESTful routes](#controllers)
    - [Middleware](#middleware)
    - [Seeding](#seeding)
  - [Frontend](#frontend)
    - [Song Index](#song-index)
    - [Comments](#comments)
- [Final Thoughts](#final-thoughts)
  - [Wins](#wins)
  - [Challenges](#challenges)
  - [Lessons Learned](#lessons-learned)
  - [Potential Features](#potential-features)

<a name="overview"></a>

## Overview

As I have recently navigated the process of music creation and production through, I noticed a gap in tooling for working collaboratively on creating the music for an entire album. I wanted to develop a tool that could be used to enable musicians / producers to manage their tracks through the production process.

I found the process of exchanging lyrics files, midi, DAW project files by email to be tedious and often meant that I couldn't find the right file when I needed it, ultimately slowing down work on the track itself. I therefore wanted a platform where I could easily navigate the lyrics & DAW project files and be able to access previous versions of these files should there be material from previous iterations that I wanted to use.

If there was one platform where I could store all of our in-process songs, throwaway lyric scraps and our finished productions that are ready to the point of being publishable to other services then I would be satisfied but I could not find another service doing this. Arguably, such a result could be achieved by using a shared drive and each song being represented by it's own git-versioned folder however this seemed inelegant and I wanted to make the User Experience (UX) such that a user can really just tap into the parts of the song they want to work on, exactly when the moment strikes that they want to work on them.

For this purpose, I imagined a web application which tracks the state of progress of your in-progress tracks and handles all of the versioning/ version retrieval behind the scenes neatly. This web application came to be **Musician Mate**

I sourced a starting point application based in React as I figured that the element of 'Listing Songs Grouped by Album' was a problem that had already been solved and I could build my more bespoke features on top of an existing base. Credit to the original authors for their clean React/Express JS basis - it has helped me keeped my code clean too.

![](/readme-img/tour.gif)

<a name="brief"></a>

## Brief

- Build upon the Cloudify full-stack application to enable exchange of lyric, audio and DAW files for tracks easily between musicians.
- Use an Express API to serve our data from a Mongo database
- Consume the API with a frontend built with REACT
- Expand the authorisation model to handle different users of the system not sharing access to their own songs (scoped access tokens)
- Use Express API endpoints to handle git repositories pertaining to songs.

<a name="technologies"></a>

## Technologies Used

- HTML5
- CSS3 and Bulma
- JavaScript (ES6)
- React.js
- Node.js
- Express
- React Jinke Music Player
- Cloudinary
- Mongo and Mongoose
- Git and GitHub
- Google Chrome Dev Tools
- Heroku and Netlify


<a name="models"></a>

#### Models

New Models:
--LyricSheet--
--File--
--MusicianGroup--


<a name="controllers"></a>

#### Controllers for RESTful routes.

New controllers
GitRepo Controller
LyricsText Edit Functionality

```js
//* Creating/uploading a song
async function uploadSong(req, res, next) {
  const artist = await Artist.findById(req.body.singer)
  const album = await Album.findById(req.body.album)
  req.body.user = req.currentUser

  try {
    const newSong = await Song.create(req.body)
    await album.songs.push(newSong._id)
    const hasArtistInAlbum = album.artists.findIndex((savedArtist) =>
      savedArtist.equals(artist._id)
    )

    hasArtistInAlbum === -1 ? await album.artists.push(artist._id) : null
    await album.save()

    await artist.songs.push(newSong._id)
    const hasAlbumInArtist = artist.albums.findIndex((savedAlbum) =>
      savedAlbum.equals(album._id)
    )

    hasAlbumInArtist === -1 ? await artist.albums.push(album._id) : null
    await artist.save()

    res.status(201).json(newSong)
  } catch (e) {
    next(e)
  }
}
```

![](/readme-img/song-create.png)

<a name="middleware"></a>

#### Middleware

Further authorisation features will be needed to support different users on the same system who may not have access to each other's songs.

This will involve scoping access tokens to musician groups (Bands) to allow both visibility of the songs and the ability to access.
```js
function errorHandler(err, req, res, next) {
  console.log('There was an error')
  console.log(err.name)
  console.log(err)

  if (err.name === 'CastError') {
    return res.status(400).json({ message: 'Invalid parameter given' })
  }

  if (err.name === 'NotFound') {
    return res
      .status(err.status)
      .json({ error: { name: err.name, message: err.message } })
  }

  if (err.name === 'NotValid') {
    return res
      .status(err.status)
      .json({ message: 'There was an error, Details provided are not valid' })
  }

  if (err.name === 'NotAuthorized') {
    return res
      .status(err.status)
      .send({ error: { name: err.name, message: err.message } })
  }

  if (err.name === 'ValidationError') {
    const errors = {}
    for (const key in err.errors) {
      errors[key] = err.errors[key].message
    }
    return res.status(422).json({
      message: 'Form Validation Error',
      errors,
    })
  }

  res.sendStatus(500)
  next(err)
}
```

<a name="seeding"></a>

#### Seeding

In addition to the [Bensound](https://www.bensound.com/) //  [Cloudinary](https://cloudinary.com/) seeding I will also need to seed lyrics sheets and DAW files to ensure that a system can be set up easily and worked with.

A future consideration would be making it easy to extract the contents of a system and re-deploy it on another server.


<a name="frontend"></a>

### Frontend

The additional features in the Front End will include a LyricSheet Editor and a suitably elegant way to get to your versioned DAW, Audio Files etc from the SongListItem.
