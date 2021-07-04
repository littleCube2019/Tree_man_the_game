
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
var army = require('./army.js');
var enemy = require('./enemy.js');


app.get('/', function(req, res){
  res.sendFile(__dirname + '/main.html');
});

http.listen(process.env.PORT || 3000, function(){
  console.log('listening on *:3000');
});

app.use(express.static('public'));

class road{
  constructor(direction){
    this.wallhp = 1000;
    this.direction = direction;
    this.max_distance = 20;
    this.army_location = [[]];
    this.enemy_location = [[]];
    for(var i=0; i<this.max_distance; i++){
      this.army_location = 0;
      this.enemy_location = 0;
    }
  }
  repairWall(repair_unit){
    this.wallhp = Math.max(this.wallhp + repair_unit*100, 1000);
  }
}


// ======= 選角相關變數&function

var player1HasBeenChoosen = false ;
var player2HasBeenChoosen = false; 


function chooseCharacter(id)
{
  if(id==1){
    console.log("player1 has been choosed");
    player1HasBeenChoosen = true;
  }else if(id==-1){
    console.log("player2 has been choosed");
    player2HasBeenChoosen = true;
  }
  io.emit("player_choosed", id);
}




// ========




class Environment {
  //環境變數
  constructor(){
    this.roads = {
        "E":new road("E") ,  
        "S":new road("S") ,
        "W":new road("W") ,
        "N":new road("N") , 
    }
    this.maxWallhp = 1000 ; 
    this.round = 1 ; 
    this.wood = 500 ;
    this.num_of_troop = {
        "archer":0 ,
        "armor":0 , 
        "ranger":0 ,
    }
    this.archer = [];
    this.armor = [];
    this.ranger = [];   
  }

  recuit(type){
    if(type=='archer'){

      var archer_team = army.archer;
      this.wood -= archer_team.cost;
      this.num_of_troop["archer"] = this.archer.push(archer_team);
    }
    else if(type=='armor'){
      var armor_team = army.armor;
      this.wood -= armor_team.cost;
      this.num_of_troop["armor"] = this.armor.push(armor_team);
    }
    else if(type=='ranger'){
      var ranger_team = army.ranger;
      this.wood -= ranger_team.cost;
      this.num_of_troop["ranger"] = this.ranger.push(ranger_team);

    }
  }

  moveArmy(troop_type, direction){
    if(direction=='E')
      this.roads[E].army_location[0].push(troop_type);
    else if(direction=='S')
      this.roads[S].army_location[0].push(troop_type);
    else if(direction=='W')
      this.roads[W].army_location[0].push(troop_type);
    else if(direction=='N')
      this.roads[N].army_location[0].push(troop_type);
  }

  repairWall(direction, unit){


    if(direction=='E')
      this.roads["E"].wallhp = Math.min(this.roads["E"].wallhp+unit*100, this.maxWallhp);
    else if(direction=='S')
      this.roads["S"].wallhp = Math.min(this.roads["S"].wallhp+unit*100, this.maxWallhp);
    else if(direction=='W')
      this.roads["W"].wallhp = Math.min(this.roads["W"].wallhp+unit*100, this.maxWallhp);
    else if(direction=='N')
      this.roads["N"].wallhp = Math.min(this.roads["N"].wallhp+unit*100, this.maxWallhp);

  }
};

 

var Env = null;

function newGame(){
  Env = new Environment();
}

function player_movement_update(action ){

  switch(action.type){

    case('recuit'): Env.recuit(action.recuit);
    case('move_army'): Env.moveArmy(action.troop_type, action.direction);
    case('repair_wall'): Env.repairWall(action.direction, action.unit);
  }
}

io.on('connection', (socket) => {
  newGame();  //初始化
  
  
  
  
  
  
  io.emit("welcome");

  // 選角  =============================================
  socket.on("choose_character", (id)=>{
    chooseCharacter(id);
    if(player1HasBeenChoosen && player2HasBeenChoosen){

      io.emit("start_game");
      io.emit("player_turn");
      //console.log("start game");


      Env.roads["E"].wallhp -= 500;
      io.emit("update_state", Env);
    }
  });
  //  =================================================


 





  console.log('Client connected');
  socket.on('disconnect', () => console.log('Client disconnected'));


 

  //每回合結算玩家的行動並更新環境
  socket.on("action_done", (player_id, action)=>{
    


    if(player_id==1){
      player_movement_update(action);
      io.emit("update_state", Env);
      
      io.emit("player_turn");
    }
    else if(player_id==-1){

      player_movement_update(action);
      io.emit("update_state", Env);
      io.emit("player_turn");
    }
  });
  //===================================================

  /*


   socket.on("test", ()=>{
    console.log("test")
    Env.roads["E"].wallhp +=100;
    io.emit("update_state", Env);

  });

  socket.on("test2", ()=>{
    console.log("test")
    Env.roads["E"].wallhp -=100;
    io.emit("update_state", Env);

  });


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















