
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
const e = require('express');
var express = require('express');
const { env } = require('process');
//var missionCard = require("./missioncard.js");
//var itemCard = require("./itemcard.js");
//var mission = require("./mission.js");
//var item = require("./item.js");
//const itemcard = require('./itemcard.js');





app.get('/', function(req, res){
  res.sendFile(__dirname + '/main.html');
});

http.listen(process.env.PORT || 3000, function(){
  console.log('listening on *:3000');
});

app.use(express.static('public'));




class Environment {
  //環境變數
  constructor(){
        this.wallHp = {
            "E":1000 ,  
            "S":1000 ,
            "W":1000 ,
            "N":1000 , 

        }
        this.round = 1 ; 
        this.wood = 500 ;
        this.num_of_troop = {
            "archer":1 ,
            "armor":0 , 
            "ranger":0 ,
        } 
  }
};


var Env = null;

function newGame(){
   Env = new Environment();
}





io.on('connection', (socket) => {
  newGame();  //初始化
  io.emit("welcome");
  console.log('Client connected');
  socket.on('disconnect', () => console.log('Client disconnected'));

  //test 
  Env.round+=1;

  io.emit("update_state", Env);



  /*

  //============================================================任務控制==============================================================
  socket.on("mission_control", (id, type)=>{ 
    if(id==1){
      missionAction(type, player1, player2);
    }else if(id==2){
      missionAction(type, player2, player1);
    }
    console.log(id + " " + player1.mission + " " + player2.mission);
  })
    //==================================================================================================================================

  //============================================================完成行動==============================================================

  socket.on("choose_card_result",(playerId,cardId)=>{
      var me ={} ;
      var enemy={};
      if(playerId == 1){
        me=player1;
        enemy=player2;
      }
      else if(playerId == 2){
        me=player2;
        enemy=player1;
      }
      if(cardId<20000){
        me.mission = missionIdToIndex[cardId];
        mission[me.mission].mission_start(me, enemy);
        io.emit("mission_state", me, missionCard[me.mission], "start");
        console.log(me.id + " " + cardId);
        me.actionReady.mission = true;
      }else if(cardId>=20000){
        me.item = cardId-20000;
        io.emit("item_state", me, itemCard[me.item], "get");
      }
      me.actionReady.mission = true;
  })

  //結算回合
  socket.on("action_done", (playerId, basic_act, item_act, card_act)=>{
    if(playerId==1 && !player1.actionReady.basic){
      player1.getAction(basic_act, item_act, card_act);
      player1.actionReady.basic = true;
      console.log("player1 done");
    }else if(playerId==2 && !player2.actionReady.basic){
      player2.getAction(basic_act, item_act, card_act);
      player2.actionReady.basic = true;
      console.log("player2 done");
    }
     //================================================================================================================================

    //==================================================回合結算======================================================================
    if((player1.actionReady.basic || player1.state.stun) && (player2.actionReady.basic || player2.state.stun)){
      var p1top2, p2top1;
      
    //===================================================狀態:小偷===================================================================
    isThief(player1, player2);
    isThief(player2, player1);

      //======================================================道具結算=================================================================
      itemAction(player1.action.item, player1, player2);
      itemAction(player2.action.item, player2, player1);
       //================================================================================================================================

      //=======================================================行動結算 && 精靈結算====================================================
      if(!player1.state.stun){
        player1.totalDamage();
        p1top2 = player1.realDamage(player2);
        player2.takeDamage(p1top2);
        
      }
      if(!player2.state.stun){
        player2.totalDamage();
        p2top1 = player2.realDamage(player1);
        player1.takeDamage(p2top1);
      }
      //========================================================傷害結算===============================================================
      
     
      //血量判定
      io.emit("dmg", p1top2, p2top1, player1.action.basic, player2.action.basic);
     

      //=======================================================判斷輸贏================================================================
      if(!isGameOver(player1, player2)){
        //=====================================================任務檢查====================================================================
        missionAction("check", player1, player2);
        missionAction("check", player2, player1);
        console.log("p1 mission remain: " + player1.remaining + " p2 mission remain: " + player2.remaining);

        //=====================================================狀態還原====================================================
        player1.actionReady.basic = player1.actionReady.mission = player1.state.stun = false;
        player2.actionReady.basic = player2.actionReady.mission = player2.state.stun = false;

//====================================================狀態:stun, snail, canpray======================================================================
        playerStun(player1, player2);
        playerStun(player2, player1);  
        io.emit("player_state", player1.id, player1.state.stun, player1.state.sprite_snail, player1.state.canPray);
        io.emit("player_state", player2.id, player2.state.stun, player2.state.sprite_snail, player2.state.canPray);
        //==================================================================================================================================

        //====================================================狀態:bless====================================================================
        if(player1.action.basic=="pray"){
          bless(player1, "start");
        }
        if(player2.action.basic=="pray"){
          bless(player2, "start");
        }
        
        bless(player1, "check");
        bless(player2, "check");
        //==================================================================================================================

        //====================================================狀態:seconditem===============================================
        if(player1.state.secondItem){
          io.emit("second_item_show", player1.id);
        }
        if(player2.state.secondItem){
          io.emit("second_item_show", player2.id);
        }
        //==================================================================================================================
         io.emit("next_round", player1, player2);
        //=====================================================狀態總結======================================================
        console.log(player1);
        console.log(player2);
      }

    }
  })
  */
})















