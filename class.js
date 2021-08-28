//記錄所有class


// ========================== 環境 ========================================//  
/*
   維護所有遊戲資訊都記錄在這裡
   roads :  object array ， 紀錄四條路線上的情況
   maxWallhp: int , 城牆最大血量
   round : int , 回合數 (天數)
   wood :  int , 當前樹木量
   morale : float, 士氣值 部隊傷害 = 士氣值*攻擊力
   troops_state : object ， 目前記錄 城內 的兵種數目
   defence_army_direction: object，記錄防禦部隊面朝方向

*/
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
const e = require('express');
var express = require('express');
const { env } = require('process');
app.get('/', function(req, res){
res.sendFile(__dirname + '/main.html');
});

app.use(express.static('public'));

var explore_event = require("./explore").exlore_event
var explore_mercenary = require("./explore").explore_mercenary
var RD_data = require("./R&D").RD
var army_data = require("./troop").army_data
var defender_data = require("./troop").defender_data
var enemy_data = require("./troop").enemy_data
var action_button = require("./button").action_button
exports.Environment = class {
    //環境變數
    constructor(){
        //玩家=======================
        this.player1 = {"button":action_button[0]}
        this.player2 = {"button":action_button[1]}

        this.roads = {
            "E":new road("E") ,  
            "S":new road("S") ,
            "W":new road("W") ,
            "N":new road("N") , 
        }
        
        this.round = 1 ; 
        this.resource = {"wood":5000, "resin":0, "food":100} ;
        this.resource_gain = {"wood":500, "resin":0, "food":200} //回合結束可獲得的資源

        this.factory_resource = {
            "resin":{"valid":false, "factory":new factory()}
        }

        //==探索地圖=============================
        this.map_x = 11
        this.map_y = 11
        this.map = new Array(this.map_x)
        for(var i=0; i<this.map.length; i++){
            this.map[i] = new Array(this.map_y)
        }

        this.explorer_data = {}
        this.explore_lead = 1
        this.explorerInit()

        this.resource_point = {"wood":3,"shoe":1}

        this.explore_event = {
            "resource":{"stick":10,"shoe":1},
            "village":{"wood":10},
        }
        
        this.createExploreEvent()
        //=======================================

        //===========軍力&科技===================
        this.morale = 1; 
        
        this.troops_state = { 
            
            "armor":{"valid":true, "level":0, "amount":0}, 

            "ranger":{"valid":true, "level":0, "amount":0},

            "archer":{"valid":true, "level":0, "amount":0},

            "wizard":{"valid":false, "level":0, "amount":0},
        }

        this.RD_title = { //{type:[name, isDir, show]}
            "wall":["城牆加固", true, true],
            "army_upgrade":[ "士兵升級", false, true],
            "factory":[ "半成品加工", false, true],
            "resource":["資源升級", false, true],
            "explore":["外出", false, true]
        }

        this.RD_list = {
            "wall":{
                "N":{
                    "upgrade":{"level":0, "progress":0, "data":{}},
                    "defence":{"level":0, "progress":0, "data":{}},
                },
                "E":{
                    "upgrade":{"level":0, "progress":0, "data":{}},
                    "defence":{"level":0, "progress":0, "data":{}},
                },
                "W":{
                    "upgrade":{"level":0, "progress":0, "data":{}},
                    "defence":{"level":0, "progress":0, "data":{}},
                },
                "S":{
                    "upgrade":{"level":0, "progress":0, "data":{}},
                    "defence":{"level":0, "progress":0, "data":{}},
                },
            },


            "army_upgrade":{
                "all":{
                    "armor":{"level":0, "progress":0, "data":{}},
                }
            },

            "factory":{
                "all":{
                    "resin":{"level":0, "progress":0, "data":{}},
                }
            },

            "resource":{
                "all":{
                    "food":{"level":0, "progress":0, "data":{}},
                }
            },
            
            "explore":{
                "all":{
                    "lead":{"level":0, "progress":0, "data":{}},
                }
            }

        }

        this.researchInit()

        //============================================

        //圖鑑========================================
        this.enemy_collection = {}
        this.enemyCollectionInit()
        //============================================

        this.dict = {
            "N":"北方", "E":"東方", "W":"西方", "S":"南方", "all":"", "castle":"城堡",
            "wood":"木頭", "shoe":"草鞋(皇叔編的那種)",
            "armor":"步兵", "archer":"弓箭手", "ranger":"騎兵", "wizard":"法師", "defence":"防禦部隊",
            "tree_man":"普通樹人", "big_tree_man":"大型樹人", "stick_man":"樹枝噴吐者",
        }
    }
    enemyCollectionInit(){
        for(var type in enemy_data){
            this.enemy_collection[type] = {"description":"尚未發現此樹人", "eliminate":""}
        }
    }

    enemyCollectionUpdate(enemy_type, eliminate){
        if(this.enemy_collection[enemy_type].description=="尚未發現此樹人"){
            this.enemy_collection[enemy_type] = {"description":enemy_data[enemy_type].description, "eliminate":0}
        }
        if(eliminate!=0){
            this.enemy_collection[enemy_type].eliminate += eliminate
        }
    }

    updateToClient(){
        var report = {
            "roads":this.roads,
            "round":this.round,
            "resource":this.resource,
            "resource_gain":this.resource_gain,
            "factory_resource":this.factory_resource,
            "map_x":this.map_x,
            "map_y":this.map_y,
            "map":this.map,
            "explorer_data":this.explorer_data,
            "resource_point":this.resource_point,
            "morale":this.morale,
            "troops_state":this.troops_state,
            "RD_title":this.RD_title,
            "RD_list":this.RD_list,
            "enemy_collection":this.enemy_collection,
            "dict":this.dict,
        }

        return report
    }

    gainResource(){
        //每日自動獲得資源
        for(var r in this.resource_gain){
            this.resource[r] += this.resource_gain[r]
        }

        //工廠生產資源
        for(var r in this.factory_resource){
            if(this.factory_resource[r].valid){
                var product = this.factory_resource[r].factory.active()
                for(var p in product){
                    this.resource[p] += product[p]
                }
            }
        }
        //每日糧食消耗
        for(var type in this.troops_state){
            var level = this.troops_state[type].level
            for(var r in army_data[type][level].daily_cost){
                this.resource[r] = Math.max(this.resource[r]-army_data[type][level].daily_cost[r]*this.troops_state[type].amount, 0)
            }
        }

        //探索部隊消耗
        if(this.explorer_data.is_explore){
            this.explorer_data.resource.food -= this.explorer_data.troop.daily_cost
        }
        
        //console.log(this.explorer_data)
        //console.log(this.resource)
    }

    isOutOfFood(){
        var msg = []
        if(this.resource.food<=0){
            this.morale = Math.max(this.morale - 0.2, 0)
            msg.push("城內的糧食耗盡，人們開始因饑餓心生不滿，士氣值大幅下降!")
        }
        else{
            this.morale = Math.min(1, this.morale + 0.05)
            if(this.morale==1){
                msg.push("城內糧食看似充足，部隊內氣氛活躍，士氣高漲!")
            }
            else if(this.morale>0.8){
                msg.push("飢餓的士兵獲得了一些可供果腹的糧食，士氣逐漸恢復!")
            }
        }
        this.morale = Math.round(this.morale*100)/100
        //console.log(this.morale)

        if(this.morale==0){
            for(var type in this.troops_state){
                this.troops_state[type].amount = 0
            }
            msg.push("因為管理者的不作為，導致城內的部隊因長期飢餓全數餓死...")
        }

        if(this.explorer_data.resource.food<=0 && this.explorer_data.is_explore){
            this.explorerInit()
            msg.push("錯估了探索的進度...傭兵們因糧食不足一個個倒下，只剩你獨自一人逃回城內...")
        }
        //console.log(msg)
        return msg
    }

    factoryReplenish(data){
        for(var r in data.replenishment){
            this.resource[r] -= data.replenishment[r]
        }
        this.factory_resource[data.factory_type].factory.replenish(data.replenishment)
    }

    explorerInit(){
        this.explorer_data = {
            "is_explore":false,
            "x":Math.floor(this.map_x/2), 
            "y":Math.floor(this.map_y/2),
            "mobility":300,
            "move_left":300,
            "move_available":{
                "N":true,
                "E":true,
                "W":true,
                "S":true,
            },
            "troop":{"hp":0, "attack":0, "daily_cost":0},
            "resource":{"food":0, "wood":0}
        };
    }

    createExploreEvent(){
        for(var x=0; x<this.map_x; x++){
            for(var y=0; y<this.map_y; y++){
                this.map[x][y] = {
                    "type":"none",
                    "sub_type":"none",
                    "found":false,
                    "resource":{}
                }
            }
        }
        this.map[Math.floor(this.map_x/2)][Math.floor(this.map_y/2)].type = "castle"
        for(var type in this.explore_event){
            for(var sub_type in this.explore_event[type]){
                for(var i=0; i<this.explore_event[type][sub_type];){
                    var x = Math.floor(Math.random()*this.map_x)
                    var y = Math.floor(Math.random()*this.map_y)
                    if(this.map[x][y].type=="none"){
                        this.map[x][y].type = type
                        this.map[x][y].sub_type = sub_type
                        i++
                    }
                }
            }   
        }
        //console.log(this.map)
    }

    /*
        探索機制
        ----探索前須準備糧食及攜帶部隊
        ----
    */


    explorePrepare(food){
        console.log("food"+food)
        this.explorer_data.is_explore = true

        this.explorer_data.resource.food = food
        this.resource.food -= food
        
        //this.resource.food -= this.explore_lead * explore_mercenary.normal.cost
        this.explorer_data.troop.hp = this.explore_lead * explore_mercenary.normal.hp
        this.explorer_data.troop.attack = this.explore_lead * explore_mercenary.normal.attack
        this.explorer_data.troop.daily_cost = this.explore_lead * explore_mercenary.normal.daily_cost

        //this.explorer_data.troop.amount = amount
    }


    explore(direction){

        if(direction=="N" && this.explorer_data.move_available.N){
            this.explorer_data.y += 1
        }else if(direction=="S" && this.explorer_data.move_available.S){
            this.explorer_data.y -= 1
        }else if(direction=="E" && this.explorer_data.move_available.E){
            this.explorer_data.x += 1
        }else if(direction=="W" && this.explorer_data.move_available.W){
            this.explorer_data.x -= 1
        }

        //console.log(this.explorer_data.x + "  " + this.explorer_data.y)

        this.explorer_data.move_available.E = this.explorer_data.x < this.map_x-1
        this.explorer_data.move_available.W = this.explorer_data.x > 0
        this.explorer_data.move_available.N = this.explorer_data.y < this.map_y-1
        this.explorer_data.move_available.S = this.explorer_data.y > 0
        this.explorer_data.move_left -= 1

        var report = {
            "resource":"", 
            "explorer_data":this.explorer_data,
            "msg":"",
        }
        var x = this.explorer_data.x
        var y = this.explorer_data.y

        //撿起地上資源
         //console.log(this.map[x][y])
        for(var r in this.map[x][y].resource){
            this.explorer_data.resource[r] += this.map[x][y].resource[r]
        }

        if(this.map[x][y].type!="none"){
            var type = this.map[x][y].type
            var sub_type = this.map[x][y].sub_type
            if(!this.map[x][y].found){
                if(type=="castle"){
                    report.msg = "來到了城門下"
                }
                if(type=="resource"){
                    explore_event[type][sub_type].reward(this.explorer_data)
                    report.msg = explore_event[type][sub_type].msg
                    this.map[x][y].found = true
                }
                if(type=="village"){
                    var enemy_hp = explore_event[type][sub_type].enemy.hp
                    var enemy_attack = explore_event[type][sub_type].enemy.attack
                    var hp = this.explorer_data.troop.hp
                    var attack = this.explorer_data.troop.attack
                    if(hp/enemy_attack>attack/enemy_hp){
                        explore_event[type][sub_type].reward(this.resource_gain)
                        report.msg = explore_event[type][sub_type].msg
                        this.map[x][y].found = true
                    }
                    else{
                        this.map[x][y].resource = this.explorer_data.resource
                        this.explorerInit()
                        report.msg = "傭兵被樹人擊敗，你獨自一人狼狽地逃回城內"
                    }
                }
                report["resource"] = type
            }
            else{
                report.msg = "這裡似乎已經探索過了"
            }
        }
        else{
            report.msg = "甚麼都沒有發現..."
        }
        //console.log(report)
        return report
    }

    exploreEnd(){
        this.explorer_data.is_explore = false


        /*
        for(var type in this.explorer_data.troop.amount){
            this.troops_state[type].amount += this.explorer_data.troop.amount[type]
        }
        */
        this.explorer_data.troop.hp = 0
        this.explorer_data.troop.attack = 0
        //this.explorer_data.troop.amount = 0

        for(var type in this.explorer_data.resource){
            this.resource[type] += this.explorer_data.resource[type]
            this.explorer_data.resource[type] = 0
        }
    }


    
    recruit(army_type, army_data){
        var level = this.troops_state[army_type].level
        for(var r in army_data[army_type][level]["cost"]){
            this.resource[r] -= army_data[army_type][level]["cost"][r];
        }
        this.troops_state[army_type]["amount"] += 1;
        //console.log("招募了一對" + army_type)
    }

    deployArmy(direction, army, army_type, army_data){
        /*
        for(var type in troop){
            var level = this.troops_state[type]["level"]
            var amount = troop[type]
            if(this.troops_state[army_type]["amount"]>=amount){
                var data = army_data[army_type][level]
                data.hp *= this.morale
                data.attack *= this.morale
                for(var i=0; i<amount; i++){
                    this.roads[direction].army_location[0].push(new army(data));
                }
                //console.log(this.roads[direction].army_location[0][0])
                this.troops_state[army_type]["amount"] -= amount;
            }
        }
        */
        var level = this.troops_state[army_type]["level"]
        if(this.troops_state[army_type]["amount"]>0){
            var data = army_data[army_type][level]
            data.hp *= this.morale
            data.attack *= this.morale
            this.roads[direction].army_location[0].push(new army(data));
            //console.log(this.roads[direction].army_location[0][0])
            this.troops_state[army_type]["amount"] -= 1;
        }
    }

    repairWall(direction, unit){
        this.resource["wood"] -= unit*100;
        this.roads[direction].wallhp = Math.min(this.roads[direction].wallhp+unit*100, this.roads[direction].max_wallhp);
    }

    scout(direction){

        var msg = ""
        var distance = this.roads[direction].nearest_enemy
        
        if(distance!=-1){
            var enemy_type = this.roads[direction].enemy_location[distance][0].type
            this.enemyCollectionUpdate(enemy_type, 0)
            if(distance>=5){
                msg += "隱隱約約看見一隻"
            }
            else{
                msg += "緊急狀況!!發現一隻"
            }
            msg += this.dict[enemy_type] + "位於" + this.dict[direction] + distance + "公里處"
        }
        else{
            msg = this.dict[direction] + "的道路上很安全，沒有任何敵人"
        }
        
        return msg

    }

    armyRetreat(direction){
        this.roads[direction].armyRetreat()
    }

    researchInit(){
        for(var type in this.RD_list){
            for(var dir in this.RD_list[type]){
                for(var sub_type in this.RD_list[type][dir]){
                    var level = this.RD_list[type][dir][sub_type].level
                    this.RD_list[type][dir][sub_type].data = RD_data[type][sub_type][level]
                }
            }
        }
    }

    /*
        研發機制
        ----當沒有後續可研發項目時，level = -1
        ----return research_report = {done, msg}
    */

    research(RD, type, dir, sub_type){
        var max_research_speed = this.RD_list[type][dir][sub_type].data.max_research_speed
        var difficulty = this.RD_list[type][dir][sub_type].data.difficulty
        var cost = this.RD_list[type][dir][sub_type].data.cost
        
        var research_report = {
            "done":false,
            "msg":"",
            "progress":0,
            "total":difficulty,
        }

        for(var r in cost){
            this.resource[r] -= cost[r];
        }

        this.RD_list[type][dir][sub_type]["progress"] += Math.ceil(Math.random()*max_research_speed);
        

        if(this.RD_list[type][dir][sub_type]["progress"] >= difficulty){
            research_report.msg = "你成功研發了" + this.RD_list[type][dir][sub_type].data.name
            research_report.progress = difficulty
            research_report.done = true
            var next_level = this.RD_list[type][dir][sub_type].data.research_done(this, dir)
            this.RD_list[type][dir][sub_type]["level"] = next_level
            this.RD_list[type][dir][sub_type]["progress"] = 0
            if(next_level!=-1){
                this.RD_list[type][dir][sub_type].data = RD_data[type][sub_type][next_level]
            }
            else{
                delete  this.RD_list[type][dir][sub_type]
            }
            
        }
        else{
            research_report.progress = this.RD_list[type][dir][sub_type]["progress"]
            research_report.msg = "研發了" + this.RD_list[type][dir][sub_type].data.name + ": 進度"+research_report.progress+"/"+difficulty
        }
        //console.log(this.RD_list)
        return research_report
    }


    enemySpawn(enemy, enemy_data){
        for(var d in this.roads){
            this.roads[d].roadEnemySpawn(enemy, enemy_data, this.round)
        }
    }

    armyMove(){
        for(var d in this.roads){
            this.roads[d].armyMove(this.troops_state)
        }
    }

    enemyMove(){
        for(var d in this.roads){
            this.roads[d].enemyMove()
        }
    }

    combat(){
        var report = []
        for(var d in this.roads){
            report.push(this.roads[d].combat(this))
        }
        return report
    }


    isGameover(){
        return(this.roads["E"].wallhp<=0 || this.roads["W"].wallhp<=0 || this.roads["N"].wallhp<=0 || this.roads["S"].wallhp<=0)
    }
}


class road{
    constructor(direction){
        this.max_wallhp = 1000 ; //城牆最大血量 
        this.wallhp = 500;  //城牆血量
        this.direction = direction; //路的方向
        this.defence = {    
            "crossbow":{"valid":false}, 
            "catapult":{"valid":false},
        }
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

    /*
        部隊移動機制
        ----回合結束時呼叫
        ----當有敵方單位進入攻擊範圍內停止移動
        ----撤退時無法攻擊且仍會受到傷害
    */


    armyMove(army_state){
        //行軍
        //console.log(this.army_location)
        for(var i=this.max_distance-1; i>=0; i--){
            for(var j=0; j<this.army_location[i].length; ){
                if(!this.army_location[i][j].retreat){
                    var move_to = Math.min(i + this.army_location[i][j].mobility, this.max_distance-1); 
                    if(this.nearest_enemy!=-1){
                        move_to = Math.max(move_to, this.nearest_enemy-this.army_location[i][j].attack_range, 0)
                    }
                    if(move_to!=i){
                        this.army_location[move_to].push(this.army_location[i][j]);
                        this.army_location[i].splice(j, 1);
                    } 
                    else j++;
                }
                else{
                    j++
                }
            }
        }
        //撤退
        for(var i=0; i<this.max_distance-1; i++){
            for(var j=0; j<this.army_location[i].length; j++){
                if(this.army_location[i][j].retreat){
                    var move_to = Math.max(0, i - this.army_location[i][j].mobility)
                    if(move_to==0){
                        var army_type = this.army_location[i][j].type
                        army_state[army_type].amount += 1;
                    }
                    else{
                        this.army_location[move_to].push(this.army_location[i][j])
                    }
                    this.army_location[i].splice(j, 1)
                }
            }
        }
        //檢查最遠部隊位置
        this.farest_army = -1
        for(var i=this.max_distance-1; i>=0; i--){
            if(this.army_location[i].length>0){
                this.farest_army = i
                break
            }
        }
        //console.log(this.army_location)
    }

    armyRetreat(){
        for(var i=0; i<this.max_distance; i++){
            for(var j=0; j<this.army_location[i].length; j++){
                this.army_location[i][j].retreat = true;
            }
        }
        //console.log( this.direction + "方向的部隊開始撤退")
    }

    enemyMove(){
        for(var i=0; i<this.max_distance; i++){
            if(this.enemy_location[i].length){
                for(var j=0; j<this.enemy_location[i].length;){
                    var move_to = Math.max(0, i-this.enemy_location[i][j].mobility); 
                    if(this.farest_army!=-1){
                        move_to = Math.min(move_to, this.max_distance-1, this.farest_army + this.enemy_location[i][j].attack_range)
                    }
                    if(move_to!=i){
                    this.enemy_location[move_to].push(this.enemy_location[i][j]); 
                    this.enemy_location[i].splice(j, 1);
                    }
                    else j++;
                    
                }
            }
        }
        //檢查最近敵人位置
        this.nearest_enemy = -1;
        for(var i=0; i<this.max_distance; i++){
            if(this.enemy_location[i].length){
                this.nearest_enemy = i;
                break;
            }
        }
    }

    /*
        敵人生成機制
        ----回合結束時呼叫
        ----同一回合四個方向均有機率生成多個敵人
    */

    roadEnemySpawn(enemy, enemy_data, day){
        for(var enemy_type in enemy_data){
            var spawn = Math.floor(Math.random()*100) ;  // 生成機率為 [0,100]
            var init = enemy_data[enemy_type]["spawn_prob_data"]["init"]*100
            var increase_rate = enemy_data[enemy_type]["spawn_prob_data"]["increase"]*100
            var max_prob = enemy_data[enemy_type]["spawn_prob_data"]["max"]*100
            var minimum_day = enemy_data[enemy_type]["spawn_prob_data"]["minimum_day"]
            var spawn_rate = Math.min(max_prob, init + increase_rate + increase_rate*day)
            if(day>=minimum_day && spawn<=spawn_rate){
                this.enemy_location[this.max_distance-1].push(new enemy(enemy_data[enemy_type]));
            }
        }  
    }

    /*
        戰鬥系統
        ----回合結束時呼叫
        ----一回合內只會有最前線的單位受到傷害
        ----return 戰報 
    */
    combat(Env){
  
        var army_attack = {"armor":0, "archer":0, "ranger":0, "defence":0};
        var army_killed = {"armor":0, "archer":0, "ranger":0, "defence":0}
        var army_total_damage = 0
        var enemy_attack = {"tree_man":0, "big_tree_man":0, "stick_man":0};
        var enemy_killed = {"tree_man":0, "big_tree_man":0, "stick_man":0}
        var enemy_total_damage = 0
        var isCombat = false;
        var farest_army = this.farest_army;
        var nearest_enemy = this.nearest_enemy
        
        if(nearest_enemy!=-1){
            for(var i=0; i<this.max_distance; i++){
                for(var j=0; j<this.army_location[i].length; j++){
                    if(this.army_location[i][j].attack_range + i >= nearest_enemy){
                        var army_type = this.army_location[i][j].type
                        army_attack[army_type] += this.army_location[i][j].attack;
                    }
                }
            }
    
            for(var defence_type in this.defence){
                if(this.defence[defence_type]["valid"] && nearest_enemy<=defender_data[defence_type]["attack_range"]){
                    army_attack["defence"] += defender_data[defence_type].attack
                }
            }
            for(var i in army_attack){
                army_total_damage += army_attack[i]
            }
        }
      
        
        for(var i=0; i<this.max_distance; i++){
            for(var j=0; j<this.enemy_location[i].length; j++){
                var enemy_type = this.enemy_location[i][j].type
                if(farest_army==-1 && i - this.enemy_location[i][j].attack_range <= 0){ //no army
                    enemy_attack[enemy_type] += this.enemy_location[i][j].attack;
                }
                else if(farest_army!=-1 && i - this.enemy_location[i][j].attack_range <= farest_army){
                    enemy_attack[enemy_type] += this.enemy_location[i][j].attack;
                }
            }
        }
        for(var i in enemy_attack){
            enemy_total_damage += enemy_attack[i]
        }
    
    
        if(army_total_damage || enemy_total_damage){
              isCombat = true;
        }
        var msg = ""
        var wall_msg = ""
        var damage_msg = ""
        var hp_msg = ""
        if(isCombat){
            msg = "<b>" + Env.dict[this.direction] + "</b>的城牆外傳來打鬥的聲音<br><br>"
            if(farest_army==-1 && enemy_total_damage!=0){
                this.wallhp = Math.max(0, this.wallhp-enemy_total_damage);
                wall_msg = "城牆正在被攻擊!!    受到"+enemy_total_damage+"點傷害<br>"
            }
            else if(farest_army!=-1){
                if(farest_army==0){
                    wall_msg =  "城門下方發生戰爭<br>"

                }
                else{
                    wall_msg = "距城門"+farest_army+"公里處發生戰爭<br>"
                }
                var enemy_damage_remain = enemy_total_damage
                while(enemy_damage_remain>0){
                    if(this.army_location[farest_army].length){
                        var farest_army_hp = this.army_location[farest_army][0].hp;
                        if(farest_army_hp<=enemy_damage_remain){
                            enemy_damage_remain -= farest_army_hp
                            army_killed[this.army_location[farest_army][0].type] += 1
                            this.army_location[farest_army].splice(0, 1);
                        }
                        else{
                            farest_army_hp -= enemy_damage_remain
                            enemy_damage_remain = 0
                            this.army_location[farest_army][0].hp = farest_army_hp;
                            hp_msg += "<br>先鋒部隊剩餘血量為:"+farest_army_hp + "點血量    該戰場剩下士兵數:"+this.army_location[farest_army].length + "<br>"
                        }
                    }
                    else{
                        hp_msg += "<br>先鋒部隊全數被消滅<br>"
                        break
                    }
                }
                //farest_army_hp = Math.max(0, farest_army_hp - enemy_total_damage);
                //this.army_location[farest_army][0].hp = farest_army_hp;
                
                //hp_msg += "<br>先鋒部隊剩餘血量為:"+farest_army_hp + "點血量    該戰場剩下士兵數:"+this.army_location[farest_army].length + "<br>"

            }

            var army_damage_ramain = army_total_damage

            while(army_damage_ramain>0){
                if(this.enemy_location[nearest_enemy].length){
                    var nearest_enemy_hp = this.enemy_location[nearest_enemy][0].hp
                    if(nearest_enemy_hp<=army_damage_ramain){
                        army_damage_ramain -= nearest_enemy_hp
                        enemy_killed[this.enemy_location[nearest_enemy][0].type] += 1
                        for(var i in this.enemy_location[nearest_enemy][0].reward){
                            Env.resource[i] += this.enemy_location[nearest_enemy][0].reward[i];
                        }
                        this.enemy_location[nearest_enemy].splice(0, 1);
                    }
                    else{
                        nearest_enemy_hp -= army_damage_ramain
                        army_damage_ramain = 0
                        this.enemy_location[nearest_enemy][0].hp = nearest_enemy_hp;
                        hp_msg += "最前線的敵人剩下"+nearest_enemy_hp+"點血量    該戰場剩下敵人數:"+this.enemy_location[nearest_enemy].length+"<br>"
                    }
                }
                else{
                    hp_msg += "<br>該戰場樹人已全數消滅"
                    break
                }
            }
            for(var type in enemy_killed){
                if(enemy_killed[type]>0){
                    Env.enemyCollectionUpdate(type, enemy_killed[type])
                }
            }
            /*
            nearest_enemy_hp = Math.max(0, nearest_enemy_hp - army_total_damage);
            this.enemy_location[nearest_enemy][0].hp = nearest_enemy_hp;
    
            
        
            if(nearest_enemy_hp==0){
                for(var i in this.enemy_location[nearest_enemy][0].reward){
                    Env.resource[i] += this.enemy_location[nearest_enemy][0].reward[i];
                }
                Env.enemyCollectionUpdate(this.enemy_location[nearest_enemy][0].type, 1)
                this.enemy_location[nearest_enemy].splice(0, 1);
            }
            */
            damage_msg += "我方部隊造成的傷害:<br>"
            for(var army_type in army_attack){
                if(army_attack[army_type]){
                    damage_msg += "--" + Env.dict[army_type] + "造成"+army_attack[army_type]+"點傷害<br>" 
                }
            }
            if(damage_msg=="我方部隊造成的傷害:<br>"){
                damage_msg = "我方沒有對敵人造成任何傷害..."
            }

            damage_msg += "<br>敵方部隊造成的傷害:<br>"
            for(var enemy_type in enemy_attack){   
                if(enemy_attack[enemy_type]){
                    damage_msg += "--" + Env.dict[enemy_type] + "造成"+enemy_attack[enemy_type]+"點傷害<br>" 
                }
            }
            //hp_msg += "最前線的敵人剩下"+nearest_enemy_hp+"點血量    該戰場剩下敵人數:"+this.enemy_location[nearest_enemy].length+"<br>"
            
            msg += wall_msg + damage_msg + hp_msg + "<br>******************************<br>"
        }
        this.farest_army = -1
        for(var i=this.max_distance-1; i>=0; i--){
            if(this.army_location[i].length>0){
                this.farest_army = i
                break
            }
        }
        this.nearest_enemy = -1;
        for(var i=0; i<this.max_distance; i++){
            if(this.enemy_location[i].length){
                this.nearest_enemy = i;
                break;
            }
        }
        return(msg)
    }

}


class factory{
    constructor(){
        this.input = {}
        this.output = {}
        this.storage = {}
    }
    active(){
        var inaff = true
        for(var r in this.input){
            if(this.storage[r]<this.input[r]){
                inaff = false
            }
        }

        if(inaff){
            for(var r in this.input){
                this.storage[r] -= this.input[r]
            }
            return this.output
        }
        else{
            return {}
        }
    }

    replenish(resource){
        for(var r in this.storage){
            this.storage[r] += resource[r]
        }
    }

    upgrade(resource, data){
        this.input = data.input
        this.output = data.output

        var temp = this.storage
        this.storage = data.storage
        for(var r in temp){
            if(r in this.storage){
                this.storage[r] = temp[r]
            }
            else{
                resource[r] += temp[r]
            }
        }
    }
}

// ========================== 環境 end========================================//  







// ====================單位"種類"樣版區 start =================================// 
exports.army = class {
    constructor(data){
        this.type = data.type;
        this.cost = data.cost;
        this.daily_cost = data.daily_cost
        this.hp = data.hp;
        this.attack = data.attack;
        this.attack_range = data.attack_range;
        this.mobility = data.mobility;
        this.retreat = data.retreat;
    }
}

exports.defender = class {
    constructor(data){
        this.type = data[Object.keys(data)[0]];
        this.cost = data[Object.keys(data)[1]];
        this.attack = data[Object.keys(data)[2]];
        this.attack_range = data[Object.keys(data)[3]];
    }
}

exports.enemy = class {
    constructor(data){
        this.type = data[Object.keys(data)[0]];
        this.hp = data[Object.keys(data)[1]];
        this.attack = data[Object.keys(data)[2]];
        this.attack_range = data[Object.keys(data)[3]];
        this.mobility = data[Object.keys(data)[4]];
        this.spawm_prob = data[Object.keys(data)[5]];
        this.reward = data[Object.keys(data)[6]];
    }
}
// ====================單位"種類"樣版區 end ==================================// 

//=====================工廠============================================

