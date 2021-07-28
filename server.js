// ========================== header start ========================================//
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
const e = require('express');
var express = require('express');
const { env } = require('process');
app.get('/', function(req, res){
  res.sendFile(__dirname + '/main.html');
});

http.listen(process.env.PORT || 3000, function(){
  console.log('listening on *:3000');
});

app.use(express.static('public'));


var army_data = require("./troop").army_data
var defender_data = require("./troop").defender_data
var enemy_data = require("./troop").enemy_data

// ========================== header end ========================================// 




// ========================== 環境 ========================================//  

var Environment = require("./class.js").Environment

// ========================== 環境 end========================================//  


// 單位"種類"樣版區 ， 以class為單位start ========================================// 
var army = require("./class.js").army
var defender = require("./class.js").defender
var enemy = require("./class.js").enemy


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






//============遊戲開始========
var Env = null;

function newGame(){
  Env = new Environment();
}
//============================


//============接收玩家操作指令===============
var player_action_fn = require("./player_action_functions")


function player_action_handle(action){
  console.log(action);
  if(action.type=='recruit'){
    player_action_fn.recruit(Env, action.troop_type);
  }
  else if(action.type=='move_army'){
    player_action_fn.deployArmy(Env, action.troop_type, action.direction);
  }
  else if(action.type=='repair_wall'){
    player_action_fn.repairWall(Env, action.direction, action.unit);
  }
  else if(action.type=='scout'){
    var scout_report = [];
    scout_report = player_action_fn.scout(Env, action.scout_dir);
    io.emit("scout_report", scout_report[0], scout_report[1], scout_report[2])
    console.log(scout_report)
  }
  else if(action.type=='retreat'){
    player_action_fn.retreat(Env, action.direction, action.location, action.order);
  }
  else if(action.type=="research"){
    player_action_fn.research(Env, action.research_type, action.direction);
  }
}
//===========================================


// 機率決定 
function roll_the_dice(range=100){
  // Math.floor(Math.random() * 10) returns a random integer between 0 and 9 (both included):
  return (Math.floor(Math.random() * range)+1);
  
}





//==========回合結束判定======================
//回合結束會傳戰報(一天分，每條路獨立計算)
var round_check_fn = require("./round_check_functions")
var combat_fn = require("./combat_functions")
function roundCheck(){
  var combat_report = [];
  var dir = ["N", "E", "W", "S"];
  for(var d=0; d<dir.length; d++){
    round_check_fn.spawnEnemy(Env, dir[d], enemy, enemy_data);
    round_check_fn.armyMove(Env, dir[d]);
    round_check_fn.enemyMove(Env, dir[d]);
    combat_fn.combat(Env, dir[d], combat_report, defender_data);
  }
  reports = combat_fn.combat_report_process(Env, combat_report);
  io.emit("combat_report", reports);
  //console.log(Env.roads);
  console.log("戰報:"+combat_report);

  io.emit("turn_end",roll_the_dice()); //告知user此回合結束，並傳一個機率結果給接收端,先於game over才不會鎖住player2的按鈕
  if(round_check_fn.isGameover(Env)){
    io.emit("gameover")
    player_list = {}
    player1HasBeenChoosen = false;
    player2HasBeenChoosen = false;
  }

  Env.round += 1;
  Env.resource["wood"] += 500;
}
//=============================================




var player_list = {}
var connected_list = {}

io.on('connection', (socket) => {
  
  console.log('Client connected');
  connected_list[socket.id] = socket.id;

  socket.on('new_game', ()=>{
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
      io.emit("start_game", Env, army_data, defender_data);
      io.emit("player_turn");
      //console.log("start game");

      //test

     


      
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
      player_action_handle(action);
      io.emit("update_state", Env);
      io.emit("player_turn");
    }
    else if(player_id==-1){
      player_action_handle(action);
      roundCheck();
      io.emit("update_state", Env);
      io.emit("player_turn");
    }
  });
  //===================================================
})















