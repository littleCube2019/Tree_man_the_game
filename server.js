
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
const e = require('express');
var express = require('express');
//var missionCard = require("./missioncard.js");
//var itemCard = require("./itemcard.js");
//var mission = require("./mission.js");
//var item = require("./item.js");
//const itemcard = require('./itemcard.js');


//WAH


app.get('/', function(req, res){
  res.sendFile(__dirname + '/main.html');
});

http.listen(process.env.PORT || 3000, function(){
  console.log('listening on *:3000');
});

app.use(express.static('public'));

function addMessage(Text){
  if(num_message>= MAX_MESSAGE){
    $("#message div:nth-child(1)").remove();
  }

  if(num_message %2 ==0){
    $("#message").append("<div style=\"background-color:#F0F8FF\">"+Text+"</div>");
  } 
  else{
    $("#message").append("<div style=\"background-color:#DCDCDC\">"+Text+"</div>");
  }
  num_message+=1;
}
