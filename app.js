// jshint: version 6

const express = require("express");
const request = require("request");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/homePage.html");
});

app.get("/admin", function (req, res) {
  res.sendFile(__dirname + "/admin/login.html");
});

app.get("/adminpage", function (req, res) {
  res.sendFile(__dirname + "/admin/adminpage.html");
});

app.post("/admin", function (req, res) {
  res.sendFile(__dirname + "/admin/login.html");
});

app.post("/adminpage", function (req, res) {
  res.sendFile(__dirname + "/admin/adminpage.html");
});
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



app.listen(3000, function () {
  console.log("Server is running at port 3000");
});
