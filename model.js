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

  
// Player schema for data retrieval
  var playerSchema = new mongoose.Schema({
    name: String,
    shirtNo: Number,
    matchesPlaye: Number,
    totalRuns: Number,
    totalWickets: Number
    });
  var playerModel=mongoose.model('players', playerSchema);

// Squad schema
  var squadSchema = new mongoose.Schema({
    NoOfPlayers: Number,
    type: String,
    players: [{name: String, shirt: Number, matches: Number, runs: Number, score: Number}]
  });
var squadModel=mongoose.model('squads', squadSchema);

// Series Schema
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

// Tournament Schema
var tournamentSchema = new mongoose.Schema({
  startDate: Date,
  endDate: Date,
  matches: [{venue: String, time: String, date: Date}], 
  playerOfTheTournament: String
});
var  tournamentsModel=mongoose.model('tournaments', tournamentSchema);

// Awards Schema
var pcbAwardsSchema = new mongoose.Schema({
  name: String,
  year: Date,
  winner: String
});
var pcbAwardsModel=mongoose.model('pcbAwards', pcbAwardsSchema);

  module.exports  = {
        /*---------Players Disply----------------*/
        diplayPlayers : function(res){
            playerModel.find((err, players) => {
                if (err)
                    console.log(err)
                else
                    console.log(players);
                    res.render("playersD.ejs", {player: players});
            });
        },
        /*--------Player Search-----------------*/
        searchPlayers: function(req, res){
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
        },
        /*---------Squads Disply----------------*/
        diplaySquadds : function(res){
            squadModel.find((err, sqds) => {
                if (err)
                    console.log(err)
                else
                    console.log(sqds);
                    res.render("squadsD.ejs", {squads: sqds});
              });
        },
        /*------------Series Display---------------*/
        displaySeries : function(res){
            seriesModel.find((err, sres) => {
                if (err)
                    console.log(err)
                else
                    console.log(sres);
                    res.render("seriesD.ejs", {series: sres});
              });
        }, 
        displayTournaments : function(res){
            tournamentsModel.find((err, trt) => {
                if (err)
                    console.log(err)
                else
                    console.log(trt);
                    res.render("tournamentsD.ejs", {tournaments: trt});
              });
        }, 
        displayAwards : function(res){
            pcbAwardsModel.find((err, awrd) => {
                if (err)
                    console.log(err)
                else
                    console.log(awrd);
                    res.render("awardsD.ejs", {awards: awrd});
              });
        }, 
        /*-------------ADMIN SIDE FUNCTIONS-------------------*/

        //Authenticate Admin
        authenticateAdmin : function(req, res){
            var e = req.body.email;
            var p = req.body.password;

            if(e === "abdul@pcb.com" && p === "1234"){
              res.sendFile(__dirname + "/admin/adminpage.html");
            }
            else
            res.redirect("/admin");
        }, 

        //Create squad
        createSquad : function(req, res){
            var t = req.body.type;
            var n  = req.body.noOfP; 
            // Validation
            if ( n < 11 || n > 30){
              res.redirect(__dirname + "/admin/squad/addSquad.html")
            }
            var newSquad = new squadModel({ type: t, NoOfPlayers: n});
            newSquad.save(function (err) {
              if (err) 
                return handleError(err);
              else 
                res.send("<h2>Successfully added the new Squad!</h2>");
            });
        }, 
        // Remove Squad
        removeSquad : function(req, res){
            var sq = req.body.type;
            squadModel.deleteOne({ type: sq }, function (err) {
              if(err) console.log(err);
              else
                res.send("<h2>Successfully Deleted</h2>");
            });
        }, 
        //Add player to squad
        addPtoSquad : function(req, res){
            var n = req.body.name;
            var shirt = req.body.shirtNo;
          
            // Validation
            if ( shirt < 1 || shirt > 999){
              res.redirect(__dirname + "/admin/squad/addPlayerSquad.html")
            }
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
        }, 
        // Remove player from Squad
        removePfromSquad : function(req, res){
            var n = req.body.name;
            var shirt = req.body.shirtNo;
            var sqd = req.body.squad;
            //var p = {name:n, shirtNo: shirt }
          
            squadModel.findOneAndUpdate(
              { type: sqd }, 
              { $pull: { players: {name: n, shirtNo: shirt} } },
             function (error, success) {
                   if (error) {
                       console.log(error);
                   } else {
                       console.log(success);
                       res.send("<h2>Susccessfully Removed the Player</h2>");
                   }
               });
        }, 

        /*----------Manage Serires--------------------*/

        // Add series
        addSeries : function(req, res){
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
        }, 

        // Add match to series
        addMtoSeries : function(req, res){
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
        }, 
        // Delete Series
        removeSeries : function(req, res){
            var f = req.body.format;
            var h = req.body.host;
            var sd = req.body.sDate;
            seriesModel.deleteOne({ format: f, host: h, startDate: sd }, function (err) {
              if(err) console.log(err);
              else
                res.send("<h2>Successfully Deleted</h2>");
            });
        }, 

        /*---------Manage Tournaments--------------------*/
        // Add tournament
        addTournament : function(req, res){
            var sd = req.body.sDate;
            var ed = req.body.eDate;
            var newTournament = new tournamentsModel({ startDate: sd, endDate: ed});
            newTournament.save(function (err) {
              if (err) 
                return handleError(err);
              else 
                res.send("<h2>Successfully added the new Tournament!</h2>");
            });
        }, 
        // Remove Tournament
        removeTournament : function(req, res){
            var sd = req.body.sDate;
            var ed = req.body.eDate;
            tournamentsModel.deleteOne({  startDate: sd, endDate: ed }, function (err) {
              if(err) console.log(err);
              else
                res.send("<h2>Successfully Deleted</h2>");
            });
        }, 

        //Add Match to tournament
        addMtoTournament : function(req, res){
            var sd = req.body.tsd;
            var ed = req.body.ted;
            var mVenue = req.body.venue;
            var mDate = req.body.mDate;
            var mt = req.body.mTime;
          
            var m = {venue: mVenue, time: mt, date: mDate}
          
            tournamentsModel.findOneAndUpdate(
              { stardDate: sd, endDate: ed }, 
              { $push: { matches: m } },
             function (error, success) {
                   if (error) {
                       console.log(error);
                   } else {
                       console.log(success);
                       res.send("<h2>Susccessfully Added the Match!</h2>");
                   }
               });
        }, 
        /*--------------------Manage Players Categories--------------------*/

        // Create Category
        createCategory : function(req, res){
            var name = req.body.catName;
            var salary = req.body.salary;
            console.log(name);
            console.log(salary);
            
            res.send("<h2>CATEGORY HAS BEEN CREATED.</h2>");
        }, 
        // // Remove category
        // removeCategory : function(req, res){
        //     res.send("<h2>CATEGORY HAS BEEN REMOVED.</h2>");
        // },
        // // Allocate category
        // allocateCategory : function(req, res){
        //     res.send("<h2>CATEGORY HAS BEEN ALLOCATED TO THE PLAYER.</h2>");
        // }, 
        // // REmove player from category
        // removePfromCategory : function(req, res){
        //     res.send("<h2>PLAYER HAS BEEN REMOVED FROM THE CATEGORY.</h2>");
        // }
  };





