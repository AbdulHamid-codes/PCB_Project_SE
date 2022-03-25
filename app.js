// jshint: version 6

const express = require("express");
const request = require("request");
// const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Database connection
// mongoose.connect("mongodb://127.0.0.1/PCB_db", { useNewUrlParser: true });
// mongoose.connection
//   .once("open", () => console.log('Database Connected"'))
//   .on("error", (error) => {
//     console.log("Your error: " + error);
//   });

// homepage
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/homePage.html");
});

//admin login
app.get("/admin", function (req, res) {
  res.sendFile(__dirname + "/admin/login.html");
});

app.post("/admin", function (req, res) {
  res.sendFile(__dirname + "/admin/login.html");
});

//admin page
app.get("/adminpage", function (req, res) {
  res.sendFile(__dirname + "/admin/adminpage.html");
});

app.post("/adminpage", function (req, res) {
  res.sendFile(__dirname + "/admin/adminpage.html");
});

//players page
app.get("/players", function (req, res) {
  res.send("Hello reached player");
});

//category
app.get("/create-category", function (req, res) {
  res.sendFile(__dirname + "/admin/createCategory.html");
});
app.post("/create-category", function (req, res) {
  res.send("<h2>CATEGORY HAS BEEN CREATED.</h2>");
});

app.get("/remove-category", function (req, res) {
  res.sendFile(__dirname + "/admin/removeCategory.html");
});
app.post("/remove-category", function (req, res) {
  res.send("<h2>CATEGORY HAS BEEN REMOVED.</h2>");
});

app.get("/allocate-category", function (req, res) {
  res.sendFile(__dirname + "/admin/allocateCategory.html");
});
app.post("/allocate-category", function (req, res) {
  res.send("<h2>CATEGORY HAS BEEN ALLOCATED TO THE PLAYER.</h2>");
});

app.get("/remove-player-category", function (req, res) {
  res.sendFile(__dirname + "/admin/removePlayerCategory.html");
});
app.post("/remove-player-category", function (req, res) {
  res.send("<h2>PLAYER HAS BEEN REMOVED FROM THE CATEGORY.</h2>");
});

//squad
app.get("/create-squad", function (req, res) {
  res.sendFile(__dirname + "/admin/squad/addSquad.html");
});
app.post("/create-squad", function (req, res) {
  res.send("<h2>SQUAD HAS BEEN CREATED.</h2>");
});

app.get("/remove-squad", function (req, res) {
  res.sendFile(__dirname + "/admin/squad/removeSquad.html");
});
app.post("/remove-squad", function (req, res) {
  res.send("<h2>SQUAD HAS BEEN REMOVED.</h2>");
});

app.get("/add-player-squad", function (req, res) {
  res.sendFile(__dirname + "/admin/squad/addPlayerSquad.html");
});
app.post("/add-player-squad", function (req, res) {
  res.send("<h2>PLAYER HAS BEEN ADDED TO THE SQUAD.</h2>");
});

app.get("/remove-player-squad", function (req, res) {
  res.sendFile(__dirname + "/admin/squad/removePlayerSquad.html");
});
app.post("/remove-player-squad", function (req, res) {
  res.send("<h2>PLAYER HAS BEEN REMOVED FROM THE SQUAD.</h2>");
});

//series
app.get("/add-series", function (req, res) {
  res.sendFile(__dirname + "/admin/series/addSeries.html");
});
app.post("/add-series", function (req, res) {
  res.send("<h2>A NEW SERIES HAS BEEN ADDED.</h2>");
});

app.get("/add-match-to-series", function (req, res) {
  res.sendFile(__dirname + "/admin/series/addMatchToSeries.html");
});
app.post("/add-match-to-series", function (req, res) {
  res.send("<h2>MATCH HAS BEEN ADDED TO THE SERIES.</h2>");
});

app.get("/delete-series", function (req, res) {
  res.sendFile(__dirname + "/admin/series/deleteSeries.html");
});
app.post("/delete-series", function (req, res) {
  res.send("<h2>THE SERIES HAS BEEN DELETED.</h2>");
});

app.listen(3000, function () {
  console.log("Server is running at port 3000");
});
