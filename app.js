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

// Database connection
mongoose.connect("mongodb://127.0.0.1/PCB_db", { useNewUrlParser: true });
mongoose.connection
  .once("open", () => console.log('Database Connected"'))
  .on("error", (error) => {
    console.log("Your error: " + error);
  });

// homepage
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/homePage.html");
});

/*---------Players Displya and Search----------------*/

// Player schema for data retrieval
var playerSchema = new mongoose.Schema({
  name: String,
  shirtNo: Number,
  matchesPlaye: Number,
  totalRuns: Number,
  totalWickets: Number
  });

var playerModel=mongoose.model('players', playerSchema);

app.get("/players", function(req, res){
  // create an schema

  playerModel.find((err, players) => {
    if (err)
        console.log(err)
    else
        console.log(players);
        res.render("playersD.ejs", {player: players});
  });
});

app.get("/searchPlayer", function(req, res){
  res.sendFile(__dirname + "/user/searchPlayer.html");
});

app.post("/searchPlayer", function (req, res) {

  var name = req.body.name;
  var shirtNo = req.body.shirtNo;
  var region = req.body.region;

  console.log(name);
  console.log(shirtNo);
  console.log(region);
 
  let p = {};

  if(name){
    p['name'] = name;
  }
  if(shirtNo){
    p['shirtNo'] = shirtNo;
  }
  if(region){
    p['region'] = region;
  }

  console.log("p object",p)

  playerModel.find( p, (err, players) => {
      if (err)
          console.log(err)
      else
        // res.json(players);
        //console.log(players);
        res.render("searchPlayerD.ejs", {player: players});
    });

});

/*--------------Squads Display------------------------*/

var squadSchema = new mongoose.Schema({
    NoOfPlayers: Number,
    type: String,
    players: [{name: String, shirt: Number, matches: Number, runs: Number, score: Number}]
  });

var squadModel=mongoose.model('squads', squadSchema);

app.get("/squads", function(req, res){

  squadModel.find((err, sqds) => {
    if (err)
        console.log(err)
    else
        console.log(sqds);
        res.render("squadsD.ejs", {squads: sqds});
  });
});

/*--------------Series Display------------------*/
var seriesSchema = new mongoose.Schema({
  format: String,
  host: String,
  result: String, 
  manOfTheSeries: String,
  startDate:  Date, 
  endDate: Date,
  matches: [{venue: String, time: String, date: Date}]
});

var seriesModel=mongoose.model('series', seriesSchema);
app.get("/series", function(req, res){
  seriesModel.find((err, sres) => {
    if (err)
        console.log(err)
    else
        console.log(sres);
        res.render("seriesD.ejs", {series: sres});
  });
});

/*------------------Tournament Display---------------------*/
var tournamentSchema = new mongoose.Schema({
  startDate: Date,
  endDate: Date,
  matches: [{venue: String, time: String, date: Date}], 
  playerOfTheTournament: String
});
var  tournamentsModel=mongoose.model('tournaments', tournamentSchema);
app.get("/tournaments", function(req, res){
  tournamentsModel.find((err, trt) => {
    if (err)
        console.log(err)
    else
        console.log(trt);
        res.render("tournamentsD.ejs", {tournaments: trt});
  });
});

/*-----------Display PCB Awards------------------*/
var pcbAwardsSchema = new mongoose.Schema({
  name: String,
  year: Date,
  winner: String
});
var pcbAwardsModel=mongoose.model('pcbAwards', pcbAwardsSchema);
app.get("/awards", function(req, res){
  pcbAwardsModel.find((err, awrd) => {
    if (err)
        console.log(err)
    else
        console.log(awrd);
        res.render("awardsD.ejs", {awards: awrd});
  });
});

/*------------------Admin Side-----------------*/

app.get("/admin", function (req, res) {
  res.sendFile(__dirname + "/admin/login.html");
});

app.post("/adminpage", function (req, res) {
  var e = req.body.email;
  var p = req.body.password;
  

  if(e === "abdul@pcb.com" && p === "1234"){
    res.sendFile(__dirname + "/admin/adminpage.html");
  }
  else
  res.redirect("/admin");
  
});


/*---------------------Manage Squads----------------------*/
app.get("/create-squad", function (req, res) {
  res.sendFile(__dirname + "/admin/squad/addSquad.html");
});


app.post("/create-squad", function (req, res) {
  var t = req.body.type;
  var n  = req.body.noOfP;

  var newSquad = new squadModel({ type: t, NoOfPlayers: n});
  newSquad.save(function (err) {
    if (err) 
      return handleError(err);
    else 
      res.send("<h2>Successfully added the new Squad!</h2>");
  });
});

app.get("/remove-squad", function (req, res) {
  res.sendFile(__dirname + "/admin/squad/removeSquad.html");
});
app.post("/remove-squad", function (req, res) {
  var sq = req.body.type;
  squadModel.deleteOne({ type: sq }, function (err) {
    if(err) console.log(err);
    else
      res.send("<h2>Successfully Deleted</h2>");
  });

});

app.get("/add-player-squad", function (req, res) {
  res.sendFile(__dirname + "/admin/squad/addPlayerSquad.html");
});
app.post("/add-player-squad", function (req, res) {
  var n = req.body.name;
  var shirt = req.body.shirtNo;
  var sqd = req.body.squad;
  var p = {name:n, shirtNo: shirt }

  squadModel.findOneAndUpdate(
    { type: sqd }, 
    { $push: { players: p } },
   function (error, success) {
         if (error) {
             console.log(error);
         } else {
             console.log(success);
             res.send("<h2>Susccessfully Added the new Player</h2>");
         }
     });
});

app.get("/remove-player-squad", function (req, res) {
  res.sendFile(__dirname + "/admin/squad/removePlayerSquad.html");
});
app.post("/remove-player-squad", function (req, res) {
  var n = req.body.name;
  var shirt = req.body.shirtNo;
  var sqd = req.body.squad;
  //var p = {name:n, shirtNo: shirt }

  squadModel.findOneAndUpdate(
    { type: sqd }, 
    { $pull: { players: {shirtNo: shirt} } },
   function (error, success) {
         if (error) {
             console.log(error);
         } else {
             console.log(success);
             res.send("<h2>Susccessfully Removed the Player</h2>");
         }
     });
});

/*-------------------------Manage Series--------------------*/

app.get("/add-series", function (req, res) {
  res.sendFile(__dirname + "/admin/series/addSeries.html");
});
app.post("/add-series", function (req, res) {
  var f = req.body.format;
  var h = req.body.host;
  var sd = req.body.sDate;
  var ed = req.body.eDate;
  var newSeries = new seriesModel({ format: f, host: h, startDate: sd, endDate: ed});
  newSeries.save(function (err) {
    if (err) 
      return handleError(err);
    else 
      res.send("<h2>Successfully added the new Series!</h2>");
  });
});

app.get("/add-match-to-series", function (req, res) {
  res.sendFile(__dirname + "/admin/series/addMatchToSeries.html");
});
app.post("/add-match-to-series", function (req, res) {
  var f = req.body.format;
  var sd = req.body.sDate;
  var mVenue = req.body.venue;
  var mDate = req.body.mDate;
  var mt = req.body.mTime;

  var m = {venue: mVenue, time: mt, date: mDate}

  seriesModel.findOneAndUpdate(
    { format: f, startDate: sd }, 
    { $push: { matches: m } },
   function (error, success) {
         if (error) {
             console.log(error);
         } else {
             console.log(success);
             res.send("<h2>Susccessfully Added the Match!</h2>");
         }
     });
});

app.get("/delete-series", function (req, res) {
  res.sendFile(__dirname + "/admin/series/deleteSeries.html");
});

app.post("/delete-series", function (req, res) {
  var f = req.body.format;
  var h = req.body.host;
  var sd = req.body.sDate;
  seriesModel.deleteOne({ format: f, host: h, startDate: sd }, function (err) {
    if(err) console.log(err);
    else
      res.send("<h2>Successfully Deleted</h2>");
  });

});

/*--------------------Manage Players Categories--------------------*/

app.get("/create-category", function (req, res) {
  res.sendFile(__dirname + "/admin/categories/createCategory.html");
});

app.post("/create-category", function (req, res) {
  var name = req.body.catName;
  var salary = req.body.salary;
  console.log(name);
  console.log(salary);
  
  res.send("<h2>CATEGORY HAS BEEN CREATED.</h2>");
});

app.get("/remove-category", function (req, res) {
  res.sendFile(__dirname + "/admin//categories/removeCategory.html");
});
app.post("/remove-category", function (req, res) {


  res.send("<h2>CATEGORY HAS BEEN REMOVED.</h2>");
});

app.get("/allocate-category", function (req, res) {
  res.sendFile(__dirname + "/admin//categories/allocateCategory.html");
});
app.post("/allocate-category", function (req, res) {


  res.send("<h2>CATEGORY HAS BEEN ALLOCATED TO THE PLAYER.</h2>");
});

app.get("/remove-player-category", function (req, res) {
  res.sendFile(__dirname + "/admin//categories/removePlayerCategory.html");
});
app.post("/remove-player-category", function (req, res) {


  res.send("<h2>PLAYER HAS BEEN REMOVED FROM THE CATEGORY.</h2>");
});

app.listen(3000, function () {
  console.log("Server is running at port 3000");
});
