// jshint: version 6

const express = require("express");
const request = require("request");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Database connection
mongoose.connect("mongodb://127.0.0.1/PCB_db", {useNewUrlParser: true});
mongoose.connection
    .once( 'open' ,  () => console.log('Database Connected"')) 
    .on( 'error', (error) => {
        console.log("Your error: "  + error);
    });

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/homePage.html");
});

app.get("/admin", function (req, res) {
  res.sendFile(__dirname + "/admin/login.html");
});

app.get("/players", function(req, res){
  res.send("Hello reached player");
});

app.get("/adminpage", function (req, res) {
  res.sendFile(__dirname + "/admin/adminpage.html");
});

app.post("/adminpage", function (req, res) {
  res.sendFile(__dirname + "/admin/adminpage.html");
});

app.post("/admin", function (req, res) {
  res.sendFile(__dirname + "/admin/login.html");
});


app.listen(3000, function () {
  console.log("Server is running at port 3000");
});
