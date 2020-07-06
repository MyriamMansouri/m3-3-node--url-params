"use strict";
const express = require("express");

const morgan = require("morgan");

const { top50 } = require("./data/top50");

const PORT = process.env.PORT || 8000;

const app = express();

app.use(morgan("dev"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");

// endpoints here
app.get("/top50", (req, res) => {
  res.status(200);
  res.render("pages/top50", {
    status: 200,
    title: "Top 50 Songs Streamed on Spotify",
    songs: top50,
    path: req.originalUrl,
  });
});

app.get("/top50/popular-artist", (req, res) => {
  res.status(200);
  const countArtists = {};
  const countArtistsArr = [];

  // count artist frequency according to number of songs
  top50.forEach((song) => {
    if (countArtists[song.artist] === undefined) {
      countArtists[song.artist] = 1;
    } else {
      countArtists[song.artist] += 1;
    }
  });

  // rank artist by frequency
  Object.keys(countArtists).forEach((artist) => {
    countArtistsArr.push([artist, countArtists[artist]]);
  });
  countArtistsArr.sort((a, b) => b[1] - a[1]);

  // get artist with max number of song and get song list
  const [ topArtist ] = countArtistsArr;
  const topSongs = top50.filter( song => song.artist === topArtist[0] )

  res.render("pages/top50", {
    status: 200,
    title: "Most Popular Artist",
    songs: topSongs,
    path: req.originalUrl,
  });
});

app.get("/top50/song/:rank", (req, res) => {
  res.status(200);
  const rank = req.params.rank;
  const songObj = {};
  top50.forEach((song) => {
    if (song.rank === rank) songObj = song;
  });
  const song = top50[Object.values(top50)];
  res.render("pages/song-page", {
    status: 200,
    title: `Song #${rank}`,
    song: songObj,
    path: req.originalUrl,
  });
});

// handle 404s
app.get("*", (req, res) => {
  res.status(404);
  res.render("pages/fourOhFour", {
    status: 404,
    title: "I got nothing",
    path: req.originalUrl,
  });
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
