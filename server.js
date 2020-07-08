"use strict";
const express = require("express");

const morgan = require("morgan");

const { top50 } = require("./data/top50");
const { books } = require("./data/books");

const PORT = process.env.PORT || 8000;

const app = express();

app.use(morgan("dev"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");

const handleError = (req, res) => {
  res.status(404);
  res.render("pages/fourOhFour", {
    status: 404,
    title: "I got nothing",
    path: req.originalUrl,
  });
};

// endpoints here

app.get("/library", (req, res) => {
  res.status(200);
  res.render("pages/library", {
    status: 200,
    title: "My books",
    books: books,
    path: req.originalUrl,
  });
});

app.get("/library/book/:id", (req, res) => {

  const id = req.params.id;

  if (books.filter((book) => book.id === parseInt(id)).length === 0) {
    handleError(req, res);
    return
  }

  res.status(200);

  let bookObj = {};

  books.forEach((book) => {
    if (book.id ===  parseInt(id)) bookObj = book;
  });

  res.render("pages/bookPage", {
    status: 200,
    title: `Book #${id}`,
    book: bookObj,
    path: req.originalUrl,
  });
});

app.get("/library/:type", (req, res) => {

  const type = req.params.type;

  if (books.filter((book) => book.type === type).length === 0) {
    handleError(req, res);
    return
  }

  res.status(200);

  let bookArr = [];

  books.forEach((book) => {
    if (book.type ===  type) bookArr.push(book);
  });

  res.render("pages/library", {
    status: 200,
    title: `Books by genre: ${type}`,
    books: bookArr,
    path: req.originalUrl,
  });
});


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
  const [topArtist] = countArtistsArr;
  const topSongs = top50.filter((song) => song.artist === topArtist[0]);

  res.render("pages/top50", {
    status: 200,
    title: "Most Popular Artist",
    songs: topSongs,
    path: req.originalUrl,
  });
});

app.get("/top50/song/:rank", (req, res) => {
  const rank = req.params.rank;

  if (top50.filter((song) => song.rank === parseInt(rank)).length === 0) {
    handleError(req, res);
    return
  }

  res.status(200);

  let songObj = {};

  top50.forEach((song) => {
    if (song.rank === parseInt(rank)) songObj = song;
  });

  res.render("pages/songPage", {
    status: 200,
    title: `Song #${rank}`,
    song: songObj,
    path: req.originalUrl,
  });
});

// handle 404s
app.get("*", handleError);

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
