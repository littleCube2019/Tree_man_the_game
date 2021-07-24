// ========================== header start ========================================//
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
const e = require('express');
var express = require('express');
const { env } = require('process');

//var army = require('./army.js');
//var enemy = require('./enemy.js');


app.get('/', function(req, res){
  res.sendFile(__dirname + '/main.html');
});

http.listen(process.env.PORT || 3000, function(){
  console.log('listening on *:3000');
});

app.use(express.static('public'));

// ========================== header end ========================================// 




// ========================== 環境 ========================================//  
/*
   維護所有遊戲資訊都記錄在這裡
   roads :  object array ， 紀錄四條路線上的情況
   maxWallhp: int , 城牆最大血量
   round : int , 回合數 (天數)
   wood :  int , 當前樹木量
   num_of_troop : object ， 目前記錄 城內 的兵種數目
   defence_army_direction: object，記錄防禦部隊面朝方向
   
   樣板區:  紀錄每種單位的基本數值，未來升級可以調整這裡

*/
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
        "archer":1 ,
        "armor":0 , 
        "ranger":0 ,
    }
    this.defence_army_direction = {"archer":""}; 
    
    // ========== 樣板區 start =====================
    this.archer = new defence("archer", 1000, 100, 3);
    this.armor = new army("armor", 500, 1000, 50, 0, 1);
    this.ranger = new army("ranger", 2000, 500, 300, 0, 3);  
    this.tree_man = new enemy("tree man", 600, 250, 0, 1, 2000);
    // ========== 樣板區 end =====================





  }
};
// ========================== 環境 end========================================//  


// ========================== 路 start========================================//   
class road{
  constructor(direction){
    this.wallhp = 500;  //城牆血量
    this.direction = direction; //路的方向
    this.max_distance = 10;
    this.nearest_enemy = -1;
    this.farest_army = -1; 
    this.army_location = [];  //二維陣列，紀錄各位置上有多少部隊or敵人
    this.enemy_location = [];
    for(var i=0; i<this.max_distance; i++){
      this.army_location[i] = [];
      this.enemy_location[i] = [];
    }
  }
}
// ========================== 路 end========================================// 

// 單位"種類"樣版區 ， 以class為單位start ========================================// 
class army{
  constructor(type, cost, hp, attack, attack_range, move_distance){
      this.type = type;
      this.cost = cost;
      this.hp = hp;
      this.attack = attack;
      this.attack_range = attack_range;
      this.move_distance = move_distance;
  }
}

class defence{
  constructor(type, cost, attack, attack_range){
      this.type = type;
      this.cost = cost;
      this.attack = attack;
      this.attack_range = attack_range;
  }
}

class enemy{
  constructor(type, hp, attack, attack_range, move_distance, reward){
      this.type = type;
      this.hp = hp;
      this.attack = attack;
      this.attack_range = attack_range;
      this.move_distance = move_distance;
      this.reward = reward;
  }
}

// 單位"種類"樣版區 ， 以class為單位start ========================================//













// =======  main 區  ~ 結束 ==============================================//

/*  (0.0)
可以代表一個流程 

welcome :剛進遊戲的時候，初始化選角畫面

player_choosed : 選角，回傳角色id
start_game : 回傳遊戲開始訊號

while loop
  socket.on(action_done) : 接收回家選擇行動與其選項  
  [
    scout_report : 回傳偵查情報
    combat_report : 回傳處理過後的戰報 ，為一string array
    player_msg : 回傳"訊息"給兩位玩家
  ]
  player_turn: 玩家其中一位結束操作時，發出的訊號


  turn_end : 回傳回合結束訊號， 並給一個機率值決定(每日結尾)事件

  update_state: env 資訊更新到前端



gameover : 回傳遊戲結束訊號， 前端自己切換結束畫面
*/



// player有沒有被選取
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





//=========玩家操作=================
//招募部隊
function recruit(type){
    if(type=='archer'){
      Env.wood -= Env.archer.cost;
      Env.num_of_troop["archer"] += 1;
    }
    else if(type=='armor'){
      Env.wood -= Env.armor.cost;
      Env.num_of_troop["armor"] += 1;
    }
    else if(type=='ranger'){
      Env.wood -= Env.ranger.cost;
      Env.num_of_troop["ranger"] += 1;
    }
}

//派出部隊前往指定方向
function deployArmy(army_type, dir){
  if(army_type=="archer"){
    Env.defence_army_direction["archer"] = dir;
  }
  else if(army_type=="armor"){
    Env.roads[dir].army_location[0].push(new army("armor", 500, 1000, 50, 0, 1));
    Env.num_of_troop["armor"] -= 1;
  }
  else if(army_type=="ranger"){
    Env.roads[dir].army_location[0].push(new army("ranger", 2000, 500, 300, 0, 3));
    Env.num_of_troop["ranger"] -= 1;
  }
}

//修牆
function repairWall(direction, unit){
  Env.wood -= unit*100;
  Env.roads[direction].wallhp = Math.min(Env.roads[direction].wallhp+unit*100, Env.maxWallhp);
}


//偵查該方向最接近的敵人的位置和種類
function scout(dir){
  var nearest_enemy = Env.roads[dir].nearest_enemy;
  if(nearest_enemy!=-1){
    io.emit("scout_report", dir, nearest_enemy, Env.roads[dir].enemy_location[nearest_enemy][0].type);
    //console.log("偵察了" + dir + "方向的敵人" + nearest_enemy + Env.roads[dir].enemy_location[nearest_enemy][0].type);
  }
  else{
    io.emit("scout_report", dir, -1);
    //console.log("方向"+dir+"沒有敵人");
  }
} 
//=======================================



var Env = null;

//============遊戲開始========
function newGame(){
  Env = new Environment();
}
//============================


//============接收玩家操作指令===============
function player_movement_update(action){
  console.log(action);
  if(action.type=='recruit')
    recruit(action.troop_type);
  else if(action.type=='move_army'){
    deployArmy(action.troop_type, action.direction);
  }
  else if(action.type=='repair_wall')
    repairWall(action.direction, action.unit);
  else if(action.type=='scout')
    scout(action.scout_dir);
}
//===========================================


// 機率決定 
function roll_the_dice(range=100){
  // Math.floor(Math.random() * 10) returns a random integer between 0 and 9 (both included):
  return (Math.floor(Math.random() * range)+1);
  
}





//==========回合結束判定======================
//回合結束會傳戰報(一天分，每條路獨立計算)
function roundCheck(){
  var combat_report = [];
  var dir = ["N", "E", "W", "S"];
  for(var d=0; d<dir.length; d++){
    spawnEnemy(dir[d]);
    armyMove(dir[d]);
    enemyMove(dir[d]);
    combat(dir[d], combat_report);
  }
  reports = combat_report_process(combat_report);
  io.emit("combat_report", reports);
  //console.log(Env.roads);
  console.log("戰報:"+combat_report);

  io.emit("turn_end",roll_the_dice()); //告知user此回合結束，並傳一個機率結果給接收端,先於game over才不會鎖住player2的按鈕
  isGameover();

  Env.round += 1;
  Env.wood += 500;
}
//=============================================

//==================處理戰報 ========================
direct_dic = {
  "E" : "東",
  "S" : "南",
  "W" : "西",
  "N" : "北"
}

function combat_report_process(combat_report){
  reports = [];
  console.log("戰報數量:" + combat_report.length);
  for(var i =0 ; i < combat_report.length ; i++){
    r = combat_report[i]
    var num_of_troop = Env.roads[r["direction"]].army_location[r["location"]].length;
    var num_of_enemy = Env.roads[r["direction"]].enemy_location[r["location"]].length;
    if(r["wall_damaged"]){
        var wall_msg = direct_dic[r["direction"]] + "方城牆正在被攻擊<br>受到"+r["enemy_attack"]+"點傷害<br>";
        reports.push(wall_msg);

        if(r["army_attack"]>0){
          var msg = "弓箭手造成" + r["army_attack"] + "點傷害<br>該樹人剩下"+r["enemy_hp"]+"點血量<br>該戰場剩下敵人數:"+num_of_enemy+"<br>"; 
          reports.push(msg);
        }
    }
    
    else{
      if(r["location"]>0){
        var msg =  "位於"+direct_dic[r["direction"]]+"方距城門"+r["location"]+"公里處發生戰爭<br>我方造成"+r["army_attack"]+"點傷害，樹人造成"+r["enemy_attack"]+"點傷害<br>先鋒部隊剩餘血量為:"+r["army_hp"]+"，該樹人剩下"+r["enemy_hp"]+"點血量";
        reports.push(msg);
      }
      else{
        var msg =  "位於"+direct_dic[r["direction"]]+"方城門下方發生戰爭<br>我方造成"+r["army_attack"]+"點傷害，樹人造成"+r["enemy_attack"]+"點傷害<br>先鋒部隊剩餘血量為:"+r["army_hp"]+"，該樹人剩下"+r["enemy_hp"]+"點血量<br>該戰場剩下敵人數:"+num_of_enemy+"<br>"; 
        reports.push(msg);
      }

      var msg = "該戰場剩下士兵數:"+num_of_troop+"<br>";
      reports.push(msg);
      

    }
    
 
  }
  return reports;
}

//==================================================

//===================交戰系統===================
/******當距離最近的敵方部隊進入攻擊範圍內，該部隊會開始攻擊，造成的傷害不受血量影響**********
*******一回合只有最前線的部隊會受到傷害***************************
 */
function combat(dir, total_report){
  
  var army_attack = 0;
  var enemy_attack = 0;
  var isCombat = false;
  var farest_army = Env.roads[dir].farest_army;
  var nearest_enemy = Env.roads[dir].nearest_enemy;
  console.log(dir);

  if(nearest_enemy!=-1){
    var nearest_enemy_hp = Env.roads[dir].enemy_location[nearest_enemy][0].hp;
  }
  if(farest_army!=-1){
    var farest_army_hp = Env.roads[dir].army_location[farest_army][0].hp;
  }

    
  if(nearest_enemy!=-1){
    for(var i=0; i<Env.roads[dir].max_distance; i++){
      for(var j=0; j<Env.roads[dir].army_location[i].length; j++){
        if(Env.roads[dir].army_location[i][j].attack_range + i >= nearest_enemy){
          army_attack += Env.roads[dir].army_location[i][j].attack;
        }
      }
    }
    if(nearest_enemy<=Env.archer.attack_range && Env.defence_army_direction["archer"]==dir){
      army_attack += Env.num_of_troop["archer"] * Env.archer.attack;
    }
  }

  
  for(var i=0; i<Env.roads[dir].max_distance; i++){
    for(var j=0; j<Env.roads[dir].enemy_location[i].length; j++){
      if(farest_army==-1 && i - Env.roads[dir].enemy_location[i][j].attack_range <= 0){ //no army
        enemy_attack += Env.roads[dir].enemy_location[i][j].attack;
      }
      else if(farest_army!=-1 && i - Env.roads[dir].enemy_location[i][j].attack_range <= farest_army){
        enemy_attack += Env.roads[dir].enemy_location[i][j].attack;
      }
    }
  }
  if(army_attack || enemy_attack){
    isCombat = true;
  }

  var combat_report={
                    "direction":dir, //交戰方向
                    "location":0, //交戰位置
                    "wall_damaged":false, //城牆是否被攻擊
                    "army_attack":army_attack, //部隊造成的傷害
                    "enemy_attack":enemy_attack, //樹人造成的傷害
                    "army_hp":farest_army_hp, //最前方部隊剩餘血量
                    "enemy_hp": nearest_enemy_hp, //最近樹人剩餘血量
                    "reward":0}; //擊殺樹人獎勵
  //console.log(isCombat);
  if(isCombat){
    if(farest_army==-1 && enemy_attack!=0){
      //console.log("樹人到城牆下啦");
      Env.roads[dir].wallhp = Math.max(0, Env.roads[dir].wallhp-enemy_attack);
      combat_report["wall_damaged"] = true;
    }
    else if(farest_army!=-1){
      farest_army_hp = Math.max(0, farest_army_hp - enemy_attack);
      combat_report["army_hp"] = farest_army_hp;
      combat_report["location"] = farest_army;
      Env.roads[dir].army_location[farest_army][0].hp = farest_army_hp;
    }
    
    nearest_enemy_hp = Math.max(0, nearest_enemy_hp - army_attack);
    combat_report["enemy_hp"] = nearest_enemy_hp;
    Env.roads[dir].enemy_location[nearest_enemy][0].hp = nearest_enemy_hp;

    if(nearest_enemy_hp==0){
      var reward = Env.roads[dir].enemy_location[nearest_enemy][0].reward;
      Env.wood += reward;
      combat_report["reward"] = reward;
      Env.roads[dir].enemy_location[nearest_enemy].splice(0, 1);
      //console.log("消滅樹人");
    }

    if(farest_army_hp==0){
      Env.roads[dir].army_location[farest_army].splice(0, 1);
      //console.log("部隊被殲滅");
    }
    total_report.push(combat_report);
    console.log(combat_report);
  }
  
}
//===============================================================================


//回合結束部隊自動移動=======================
//只會在道路內移動，若走到盡頭則會停在原地
//若有敵人進入攻擊範圍內則不會繼續往前
function armyMove(dir){
  for(var i=Env.roads[dir].max_distance-1; i>=0; i--){
    if(Env.roads[dir].army_location[i].length){
      for(var j=0; j<Env.roads[dir].army_location[i].length;){
        var move_to = Math.min(i + Env.roads[dir].army_location[i][j].move_distance, Env.roads[dir].max_distance-1, Env.roads[dir].nearest_enemy-Env.roads[dir].army_location[i][j].attack_range); 
        move_to = Math.max(move_to, 0);
        if(move_to!=i){
          Env.roads[dir].army_location[move_to].push(Env.roads[dir].army_location[i][j]);
          Env.roads[dir].army_location[i].splice(j, 1);
        } 
        else j++;

      }
    }
  }
  //get farest army
  Env.roads[dir].farest_army = -1;
  for(var i=Env.roads[dir].max_distance-1; i>=0; i--){
    if(Env.roads[dir].army_location[i].length){
      Env.roads[dir].farest_army = i;
      break;
    }
  }
}


function enemyMove(dir){
  for(var i=0; i<Env.roads[dir].max_distance; i++){
    if(Env.roads[dir].enemy_location[i].length){
      for(var j=0; j<Env.roads[dir].enemy_location[i].length;){
        var move_to = Math.max(0, Env.roads[dir].farest_army + Env.roads[dir].enemy_location[i][j].attack_range, i-Env.roads[dir].enemy_location[i][j].move_distance); 
        if(move_to!=i){
          Env.roads[dir].enemy_location[move_to].push(Env.roads[dir].enemy_location[i][j]); 
          Env.roads[dir].enemy_location[i].splice(j, 1);
        }
        else j++;
        
      }
    }
  }
  //get nearest enemy
  Env.roads[dir].nearest_enemy = -1;
  for(var i=0; i<Env.roads[dir].max_distance; i++){
    if(Env.roads[dir].enemy_location[i].length){
      Env.roads[dir].nearest_enemy = i;
      break;
    }
  }

}
//=========================================================


//生成敵人(隨機)==================================
function spawnEnemy(dir){
  var spawn = Math.floor(Math.random()*20);
  if(spawn<=4){ //25% tree man
    
    Env.roads[dir].enemy_location[Env.roads[dir].max_distance-1].push(new enemy("tree man", 600, 50, 0, 1, 2000));
  }
  else if(spawn==5 && Env.round>=10){ //5% big tree man
    Env.roads[dir].enemy_location[Env.roads[dir].max_distance-1].push(new enemy("big tree man", 3000, 500, 0, 1, 10000));
  }
}
//=============================================

function isGameover(){
  if(Env.roads["E"].wallhp<=0 || Env.roads["W"].wallhp<=0 || Env.roads["N"].wallhp<=0 || Env.roads["S"].wallhp<=0){
    console.log("gameover");
    io.emit("gameover");
  }
}


var player_list = {}
var connected_list = {}

io.on('connection', (socket) => {
  console.log('Client connected');
  connected_list[socket.id] = socket.id;
  
  socket.on('new_game', ()=>{
    player_list = {}
    player1HasBeenChoosen = false;
    player2HasBeenChoosen = false;
    socket.emit("welcome", player1HasBeenChoosen , player2HasBeenChoosen);
  })

  if(Object.keys(player_list).length<2){
    socket.emit("welcome", player1HasBeenChoosen , player2HasBeenChoosen);
  }
  else{
    socket.emit("gameover")//觀戰or其他處理(暫定gameover)
    console.log("人滿囉")
  }

  // 選角  =============================================
  socket.on("choose_character", (id)=>{
    
    chooseCharacter(id);

    player_list[socket.id] = socket.id;
    if(player1HasBeenChoosen && player2HasBeenChoosen){

      //把沒選角的剔掉=====
      console.log(player_list)
      console.log(connected_list)
      for(var sockedId in connected_list){
        if(!(sockedId in player_list)){
          console.log(sockedId);
          io.to(sockedId).emit("gameover");//觀戰or其他處理(暫定gameover)
        }
      }
      //====================

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


 





  
  socket.on('disconnect', () => {
    console.log('Client disconnected')
    if(socket.id in player_list){
      player_list = {}
      player1HasBeenChoosen = false;
      player2HasBeenChoosen = false;
      io.emit("welcome", player1HasBeenChoosen , player2HasBeenChoosen);
      console.log("有人跳game")
    }
    delete player_list[socket.id];
    delete connected_list[socket.id];
  });




  //每回合結算玩家的行動並更新環境
  socket.on("action_done", (player_id, action ,msg)=>{ //玩家的訊息
    
    io.emit("player_msg",msg);

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
})















