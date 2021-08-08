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
var RD = require("./R&D").RD

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
var Env = new Environment()

function newGame(){
	Env = new Environment();
}
//============================


//============接收玩家操作指令===============
//var player_action_fn = require("./player_action_functions")


function player_action_handle(action){
	console.log(action);
	if(action.type=='recruit'){
		Env.recruit(action.troop_type, army_data)
	}
	else if(action.type=='move_army'){
		Env.deployArmy(action.direction, army, action.troop_type, army_data)
	}
	else if(action.type=='repair_wall'){
		Env.repairWall(action.direction, action.unit)
	}
	else if(action.type=='scout'){
		io.emit("scout_report", Env.scout(action.scout_dir))
	}
	else if(action.type=='retreat'){
		Env.armyRetreat(action.direction)
	}
	else if(action.type=="research"){
		var report = Env.research(RD, action.research_type, action.direction, action.sub_type) //action = {"type":"research", "research_type":"factory", "sub_type":"resin"}
		io.emit("research_report", report, Env.RD_list)
		if(report.done){
			//io.emit("research_done", action.research_type, action.sub_type, report.level+1)
			if(action.research_type == "army_upgrade"){
			io.emit("update_troop_info", [army_data["armor"][Env.troops_state["armor"]["level"]]])
			}
		}
	}
	else if(action.type=="factory_replenishment"){ //action:{"type":"factory_replenishment", "factory_type":"resin", "replenishment":{"wood":xxx}}
		Env.factoryReplenish(action)
	}
}
//===========================================


// 機率決定 
function roll_the_dice(lo=0 ,range=100){
	// Math.floor(Math.random() * 10) returns a random integer between 0 and 9 (both included):
	return (Math.floor(Math.random() * range)+1)+lo;
}





//==========回合結束判定======================
//回合結束會傳戰報(一天分，每條路獨立計算)


function roundCheck(){
	
	Env.enemySpawn(enemy, enemy_data)
	Env.armyMove()
	Env.enemyMove()
	var reports = Env.combat(defender_data)
	io.emit("combat_report", reports);

	io.emit("turn_end",roll_the_dice()); //告知user此回合結束，並傳一個機率結果給接收端,先於game over才不會鎖住player2的按鈕
	if(Env.isGameover()){
		io.emit("gameover")
		player_list = {}
		player1HasBeenChoosen = false;
		player2HasBeenChoosen = false;
	}
	Env.gainResource()
	console.log(Env.resource)
	console.log(Env.factory_resource.resin.factory)
	Env.explorer_data.move_left = Env.explorer_mobility
	Env.round += 1;
}
	//=============================================




var player_list = {}
var connected_list = {}

io.on('connection', (socket) => {
	var update_report = Env.updataToClient()
	var number = roll_the_dice(20000,10000); // 決定城號
	io.emit("init_data", update_report, number,
		[army_data["archer"][Env.troops_state.archer.level], army_data["armor"][Env.troops_state.armor.level], army_data["ranger"][Env.troops_state.ranger.level]],
		Env.RD_title,
		Env.RD_list,
	)
	io.emit("update_state", update_report);
	/*
	io.emit("start_game", update_report, number,
				[army_data["archer"][Env.troops_state.archer.level], army_data["armor"][Env.troops_state.armor.level], army_data["ranger"][Env.troops_state.ranger.level]],
				Env.RD_title,
				Env.RD_list,
			);
	io.emit("update_state", update_report);
	*/

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
			for(var sockedId in connected_list){
				if(!(sockedId in player_list)){
					io.to(sockedId).emit("gameover");//觀戰or其他處理(暫定gameover)
				}
			}
			//====================

			newGame();


			var update_report = Env.updataToClient()
			console.log(Env.RD_list.army_upgrade.all.armor.data)
			var research_log = {
				"wall":[ "城牆加固", true],
				"army_upgrade":[ "士兵升級", false],
				"factory":[ "半成品加工", false]
			}
			var number = roll_the_dice(20000,10000); // 決定城號
			io.emit("start_game", update_report, number,
				[army_data["archer"][Env.troops_state.archer.level], army_data["armor"][Env.troops_state.armor.level], army_data["ranger"][Env.troops_state.ranger.level]],
				Env.RD_title,
				Env.RD_list,
			);
			io.emit("update_state", update_report);

// 為了不讓"研發" 留下來，以後要改進
			io.emit("player_turn");
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
	socket.on("action_done", (player_id, action ,msg )=>{ //玩家的訊息

		io.emit("player_msg",msg);
		//action = {"type":"research", "research_type":"factory", "direction":"resin"}
		player_action_handle(action);
		if(player_id==1){
			var update_report = Env.updataToClient()
			io.emit("update_state", update_report);
			io.emit("player_turn");
		}
		else if(player_id==-1){
			roundCheck();
			var update_report = Env.updataToClient()
			io.emit("update_state", update_report);
			io.emit("player_turn");
		}
	});

	socket.on("explore", (direction)=>{
		var update_report = Env.updataToClient()
		var explore_report = Env.explore(direction)
		io.emit("update_state", update_report);
		io.emit("explore_report", explore_report)
	})
	//===================================================
})















