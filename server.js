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


//var army_data = require("./troop").army_data
//var defender_data = require("./troop").defender_data
//var enemy_data = require("./troop").enemy_data
//var RD = require("./R&D").RD
var button = require("./button").button

// ========================== header end ========================================// 




// ========================== 環境 ========================================//  

var Environment = require("./class.js").Environment

// ========================== 環境 end========================================//  


// 單位"種類"樣版區 ， 以class為單位start ========================================// 

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
		Env.recruit(action.troop_type)
	}
	else if(action.type=='move_army'){
		Env.deployArmy(action)
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
		var report = Env.research(action.research_type, action.direction, action.sub_type) //action = {"type":"research", "research_type":"factory", "sub_type":"resin"}
		io.emit("research_report", report, Env.RD_list)
		if(report.done){
			//io.emit("research_done", action.research_type, action.sub_type, report.level+1)
			if(action.research_type == "army_upgrade"){
			io.emit("update_troop_info", [Env.army_data["armor"][Env.troops_state["armor"]["level"]]])
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
	
	Env.enemySpawn()
	Env.armyMove()
	Env.enemyMove()
	var reports = Env.combat()
	Env.updateTroopLocation()

	io.emit("combat_report", reports);

	Env.gainResource()
	var food_msg = Env.isOutOfFood()
	
	io.emit("turn_end",roll_the_dice() ,food_msg); //告知user此回合結束，並傳一個機率結果給接收端,先於game over才不會鎖住player2的按鈕
	if(Env.win){
		io.emit("you_win")
		io.emit("gameover")
	}
	if(Env.isGameover()){
		io.emit("gameover")
		player_list = {}
		player1HasBeenChoosen = false;
		player2HasBeenChoosen = false;
	}
	Env.explorer_data.move_left = Env.explorer_data.mobility
	Env.round += 1;
}
	//=============================================




var player_list = [0, 0]
var connected_list = {}

io.on('connection', (socket) => {
	var update_report = Env.updateToClient()
	var number = roll_the_dice(20000,10000); // 決定城號
	io.emit("init_data", update_report, number,
		[Env.army_data["archer"][Env.troops_state.archer.level], Env.army_data["armor"][Env.troops_state.armor.level], Env.army_data["ranger"][Env.troops_state.ranger.level]],
		Env.RD_title,
		Env.RD_list,
		button
	)
	io.emit("update_state", update_report);
	/*
	io.emit("start_game", update_report, number,
				[Env.army_data["archer"][Env.troops_state.archer.level], Env.army_data["armor"][Env.troops_state.armor.level], Env.army_data["ranger"][Env.troops_state.ranger.level]],
				Env.RD_title,
				Env.RD_list,
			);
	*/
	//io.emit("update_state", update_report);
	

	console.log('Client connected');
	connected_list[socket.id] = socket.id;

	socket.on('new_game', ()=>{
		socket.emit("welcome", player1HasBeenChoosen , player2HasBeenChoosen);
	})
	if(player_list.find(element => element==0)!=undefined){
		socket.emit("welcome", player1HasBeenChoosen , player2HasBeenChoosen);
	}
	else{
		socket.emit("gameover")//觀戰or其他處理(暫定gameover)
		console.log("玩家已滿")
	}

	// 選角  =============================================
	socket.on("choose_character", (id)=>{

		chooseCharacter(id);
		if(id==1){//之眼
			io.to(socket.id).emit("choose_action_button_update", Env.player1.button)
			player_list[0] = socket.id;
		}
		else if(id==-1){//賢者
			io.to(socket.id).emit("choose_action_button_update", Env.player2.button)
			player_list[1] = socket.id;
		}
		if(player1HasBeenChoosen && player2HasBeenChoosen){

			//把沒選角的剔掉=====
			for(var socketId in connected_list){
				if(player_list.find(element => element==socketId)==undefined){
					io.to(socketId).emit("gameover");//觀戰or其他處理(暫定gameover)
				}
			}
			//====================

			newGame();


			var update_report = Env.updateToClient()

			//var number = roll_the_dice(20000,10000); // 決定城號
			
			io.emit("start_game", update_report, number,
				[Env.army_data["archer"][Env.troops_state.archer.level], Env.army_data["armor"][Env.troops_state.armor.level], Env.army_data["ranger"][Env.troops_state.ranger.level]],
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
		if(player_list.find(element => element == socket.id)){
			player_list = [0, 0]
			player1HasBeenChoosen = false;
			player2HasBeenChoosen = false;
			io.emit("welcome", player1HasBeenChoosen , player2HasBeenChoosen);
			console.log("有人跳game")
		}
		delete connected_list[socket.id];
	});




	//每回合結算玩家的行動並更新環境
	socket.on("action_done", (player_id, action ,msg )=>{ //玩家的訊息

		io.emit("player_msg",msg);
		//action = {"type":"research", "research_type":"factory", "direction":"resin"}
		player_action_handle(action);
		if(player_id==1){
		}
		else if(player_id==-1){
			roundCheck();
		}
		var update_report = Env.updateToClient()
		io.emit("update_state", update_report);
		io.to(player_list[0]).emit("choose_action_button_update", Env.player1.button)
		io.to(player_list[1]).emit("choose_action_button_update", Env.player2.button)
		io.emit("player_turn");
	});

	socket.on("explore_prepare",(food)=>{
		Env.explorePrepare(food)
		var explore_report = Env.explore("")
		io.emit("explore_report", explore_report)
	})

	socket.on("explore", (direction)=>{
		//var update_report = Env.updateToClient()
		var explore_report = Env.explore(direction)
		//io.emit("update_state", update_report);
		io.emit("explore_report", explore_report)
	})

	socket.on("explore_end",()=>{
		Env.exploreEnd()
		var explore_report = Env.explore("")
		io.emit("explore_report", explore_report)
	})
	//===================================================
})















