const model = require("./model");
var tools = require("./model")
// jshint: version 6

const express = require("express");
const request = require("request");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const { json } = require("express/lib/response");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set('view engine', 'ejs');

// homepage
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/homePage.html");
});

// Display Players
app.get("/players", function(req, res){
  tools.diplayPlayers(res);
});

// Search Player
app.get("/searchPlayer", function(req, res){
  res.sendFile(__dirname + "/user/searchPlayer.html");
});

app.post("/searchPlayer", function (req, res) {
  tools.searchPlayers(req, res);
});

// Display Squads
app.get("/squads", function(req, res){
  tools.diplaySquadds(res);
});

//Display Series
app.get("/series", function(req, res){
  tools.displaySeries(res);
});

// Display Tournaments
app.get("/tournaments", function(req, res){
  model.displayTournaments(res);
});

// Display Awards
app.get("/awards", function(req, res){
  tools.displayAwards(res);
});

// /*------------------Admin Side-----------------*/

// Authenticate Admin
app.get("/admin", function (req, res) {
  res.sendFile(__dirname + "/admin/login.html");
});

app.post("/adminpage", function (req, res) {
  tools.authenticateAdmin(req, res);
});

/*------------Manage Squads--------------*/
// create Squad
app.get("/create-squad", function (req, res) {
  res.sendFile(__dirname + "/admin/squad/addSquad.html");
});

app.post("/create-squad", function (req, res) {
  tools.createSquad(req, res);
});

// Remove squad
app.get("/remove-squad", function (req, res) {
  res.sendFile(__dirname + "/admin/squad/removeSquad.html");
});
app.post("/remove-squad", function (req, res) {
  tools.removeSquad(req, res);
});

//Add Player to Squad
app.get("/add-player-squad", function (req, res) {
  res.sendFile(__dirname + "/admin/squad/addPlayerSquad.html");
});
app.post("/add-player-squad", function (req, res) {
  tools.addPtoSquad(req, res);
});

// Remove player from squad
app.get("/remove-player-squad", function (req, res) {
  res.sendFile(__dirname + "/admin/squad/removePlayerSquad.html");
});
app.post("/remove-player-squad", function (req, res) {
  tools.removePfromSquad(req, res);
});

// /*-------------------------Manage Series--------------------*/

// Add series
app.get("/add-series", function (req, res) {
  res.sendFile(__dirname + "/admin/series/addSeries.html");
});
app.post("/add-series", function (req, res) {
  tools.addSeries(req, res);
});

// Add match to series
app.get("/add-match-to-series", function (req, res) {
  res.sendFile(__dirname + "/admin/series/addMatchToSeries.html");
});
app.post("/add-match-to-series", function (req, res) {
  tools.addMtoSeries(req, res);
});

// Delete Series
app.get("/delete-series", function (req, res) {
  res.sendFile(__dirname + "/admin/series/deleteSeries.html");
});

app.post("/delete-series", function (req, res) {
tools.removeSeries(req, res);

});

// /*------------------Manage Tournaments----------------------------*/

// Add tournament
app.get("/add-tournament", function (req, res) {
  res.sendFile(__dirname + "/admin/tournaments/addTournament.html");
});

app.post("/add-tournament", function (req, res) {
  tools.addTournament(req, res);
});

// Remove tournament
app.get("/remove-tournament", function (req, res) {
  res.sendFile(__dirname + "/admin//tournaments/removeTournament.html");
});
app.post("/remove-tournament", function (req, res) {
  tools.removeTournament(req,res);
});

// Add match to tournament
app.get("/add-match-to-tournament", function (req, res) {
  res.sendFile(__dirname + "/admin/tournaments/addMatchToTournament.html");
});
app.post("/add-match-to-tournament", function (req, res) {
  tools.addMtoTournament(req, res);
});


/*--------------------Manage Players Categories--------------------*/

// Create Category
app.get("/create-category", function (req, res) {
  res.sendFile(__dirname + "/admin/categories/createCategory.html");
});

app.post("/create-category", function (req, res) {
  tools.createCategory(req, res);
});

// Remove category
app.get("/remove-category", function (req, res) {
  res.sendFile(__dirname + "/admin//categories/removeCategory.html");
});
app.post("/remove-category", function (req, res) {
  tools.removeCategory(req, res);
});

// Allocate Category to player
app.get("/allocate-category", function (req, res) {
  res.sendFile(__dirname + "/admin//categories/allocateCategory.html");
});
app.post("/allocate-category", function (req, res) {
  tools.allocateCategory(req, res);
});

// Remove player from category
app.get("/remove-player-category", function (req, res) {
  res.sendFile(__dirname + "/admin//categories/removePlayerCategory.html");
});
app.post("/remove-player-category", function (req, res) {
 tools.removePfromCategory(req, res);
});

app.listen(3000, function () {
  console.log("Server is running at port 3000");
});
