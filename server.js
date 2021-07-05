
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
    this.wallhp = 500;
    this.direction = direction;
    this.max_distance = 21;
    this.nearest_enemy = this.max_distance-1;
    this.farest_army = 0;
    this.army_location = [];
    this.enemy_location = [];
    for(var i=0; i<this.max_distance; i++){
      this.army_location[i] = [];
      this.enemy_location[i] = [];
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
    this.num_of_troop = { //目前記錄城內的兵種數目
        "archer":1 ,
        "armor":0 , 
        "ranger":0 ,
    }
    this.archer = [army.archer];
    this.armor = [];
    this.ranger = [];   
  }
};
function recruit(type){
    if(type=='archer'){
      var archer_team = army.archer;
      Env.wood -= archer_team.cost;
      Env.num_of_troop["archer"] += 1;
      Env.archer.push(archer_team); //len
    }
    else if(type=='armor'){
      var armor_team = army.armor;
      Env.wood -= armor_team.cost;
      Env.num_of_troop["armor"] += 1;
      Env.armor.push(armor_team);
    }
    else if(type=='ranger'){
      var ranger_team = army.ranger;
      Env.wood -= ranger_team.cost;
      Env.num_of_troop["ranger"] += 1;
      Env.ranger.push(ranger_team);
    }
}

function moveArmy(troop_type, direction){

  if(troop_type=="archer"){
    //console.log(Env.roads[direction].army_location);
    Env.roads[direction].army_location[0].push(army.archer);
    Env.num_of_troop["archer"] -= 1;
  }
  else if(troop_type=="armor"){
    Env.roads[direction].army_location[0].push(army.armor);
    Env.num_of_troop["armor"] -= 1;
  }
  else if(troop_type=="ranger"){
    Env.roads[direction].army_location[0].push(army.ranger);
    Env.num_of_troop["ranger"] -= 1;
  }
}


/*
    if(direction=='E')
      this.roads["E"].army_location[0].push(troop_type);
    else if(direction=='S')
      this.roads["S"].army_location[0].push(troop_type);
    else if(direction=='W')
      this.roads["W"].army_location[0].push(troop_type);
    else if(direction=='N')
      this.roads["N"].army_location[0].push(troop_type);
*/


function repairWall(direction, unit){
  Env.roads[direction].wallhp = Math.min(Env.roads[direction].wallhp+unit*100, Env.maxWallhp);
}


 

var Env = null;

function newGame(){
  Env = new Environment();
}

function player_movement_update(action ){
  //console.log(action);
  if(action.type=='recruit')
    recruit(action.troop_type);
  else if(action.type=='move_army')
    moveArmy(action.troop_type, action.direction);
  else if(action.type=='repair_wall')
    repairWall(action.direction, action.unit);
}

function roundCheck(){
  spawnEnemy();
  troopMove();
  enemyMove();

  combat("N");
  combat("E");
  combat("W");
  combat("S");
  Env.round+=1
  console.log(Env.roads);
}

function combat(dir){
  
  if(Env.roads[dir].enemy_location[Env.roads[dir].nearest_enemy].length && Env.roads[dir].army_location[Env.roads[dir].farest_army].length){
    var army_damage = 0;
    var enemy_damage = 0;
    var nearest_enemy_hp = Env.roads[dir].enemy_location[Env.roads[dir].nearest_enemy][0].hp;
    var farest_army_hp = Env.roads[dir].army_location[Env.roads[dir].farest_army][0].hp;
    for(var loc=0; loc<20; loc++){
      var troop_num = Env.roads[dir].army_location[loc].length;
      var enemy_num = Env.roads[dir].enemy_location[loc].length;
      for(var i=0; i<troop_num; i++){
        if(Env.roads[dir].army_location[loc][i].attack_range + loc >= Env.roads[dir].nearest_enemy){
          army_damage += Env.roads[dir].army_location[loc][i].attack;
        }
      }
      for(var i=0; i<enemy_num; i++){
        if(loc - Env.roads[dir].enemy_location[loc][i].attack_range <= Env.roads[dir].farest_army){
          enemy_damage += Env.roads[dir].enemy_location[loc][i].attack;
        }
      }
    }
    //軍隊造成的傷害
    if(army_damage>=nearest_enemy_hp){
      Env.wood += Env.roads[dir].enemy_location[Env.roads[dir].nearest_enemy][0].reward;
      Env.roads[dir].enemy_location[Env.roads[dir].nearest_enemy].splice(0, 1);
    }
    else{
      nearest_enemy_hp -= army_damage;
    }
    //==============
    //樹人造成的傷害
    if(enemy_damage>=farest_army_hp){
      Env.roads[dir].army_location[Env.roads[dir].farest_army].splice(0, 1);
    }
    else{
      farest_army_hp -= enemy_damage;
    }
    //===================
    console.log(army_damage);
    console.log(enemy_damage);
  }
}

function troopMove(){
  for(var d=0; d<4; d++){
    var dir;
    if(d==0) dir = "E";
    else if(d==1) dir = "W";
    else if(d==2) dir = "N";
    else if(d==3) dir = "S";
    for(var i=19; i>=0; i--){
      if(Env.roads[dir].army_location[i].length){
        for(var j=0; j<Env.roads[dir].army_location[i].length;){
          var move_to = Math.min(Env.roads[dir].army_location[i][j].move_distance+i, 20); 
          move_to = Math.min(move_to, Env.roads[dir].nearest_enemy-Env.roads[dir].army_location[i][j].attack_range);
          if(move_to!=i){
            Env.roads[dir].army_location[move_to].push(Env.roads[dir].army_location[i][j]);
            Env.roads[dir].army_location[i].splice(j, 1);
          } 
          else j++;
        }
      }
    }
    for(var i=20; i>=0; i--){
      if(Env.roads[dir].army_location[i].length){
        Env.roads[dir].farest_army = i;
        break;
      }
    }
  }
}

function enemyMove(){
  for(var d=0; d<4; d++){
    var dir;
    if(d==0) dir = "E";
    else if(d==1) dir = "W";
    else if(d==2) dir = "N";
    else if(d==3) dir = "S";
    for(var i=0; i<21; i++){
      if(Env.roads[dir].enemy_location[i].length){
        for(var j=0; j<Env.roads[dir].enemy_location[i].length;){
          var move_to = Math.max(i-Env.roads[dir].enemy_location[i][j].move_distance, 0);
          move_to = Math.max(move_to, Env.roads[dir].farest_army + Env.roads[dir].enemy_location[i][j].attack_range); 
          if(move_to!=i){
            Env.roads[dir].enemy_location[move_to].push(Env.roads[dir].enemy_location[i][j]); 
            Env.roads[dir].enemy_location[i].splice(j, 1);
          }
          else j++;
        }

      }
    }
    for(var i=0; i<21; i++){
      if(Env.roads[dir].enemy_location[i].length){
        Env.roads[dir].nearest_enemy = i;
        break;
      }
    }
  }
}

function spawnEnemy(){
  var spawn = Math.floor(Math.random()*2);
  var spawn_direction = Math.floor(Math.random()*4);
  if(spawn){
    if(spawn_direction==0){//E
      Env.roads["E"].enemy_location[20].push(enemy.treeMan);
    }
    else if(spawn_direction==1){//W
      Env.roads["W"].enemy_location[20].push(enemy.treeMan);
    }
    else if(spawn_direction==2){//N
      Env.roads["N"].enemy_location[20].push(enemy.treeMan);
    }
    else if(spawn_direction==3){//S
      Env.roads["S"].enemy_location[20].push(enemy.treeMan);
    }
  }
}

function gameover(){

}

io.on('connection', (socket) => {

  
  
  
  
  
  
  socket.emit("welcome", player1HasBeenChoosen , player2HasBeenChoosen);

  // 選角  =============================================
  socket.on("choose_character", (id)=>{
    chooseCharacter(id);
    if(player1HasBeenChoosen && player2HasBeenChoosen){
      newGame();
      io.emit("start_game");
      io.emit("player_turn");
      //console.log("start game");

      //test
      Env.wood += 5000;
    
      io.emit("update_state", Env);
      io.emit("player_turn");
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
      roundCheck();
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















