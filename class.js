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
var explore_reward = require("./explore_reward").explore_reward
exports.Environment = class {
    //環境變數
    constructor(){
        this.roads = {
            "E":new road("E") ,  
            "S":new road("S") ,
            "W":new road("W") ,
            "N":new road("N") , 
        }
        
        this.round = 1 ; 
        this.resource = {"wood":5000, "resin":0, "food":1000} ;
        this.resource_gain = {"wood":500, "resin":0, "food":0} //回合結束可獲得的資源

        this.special_resource = {
            "resin":{"valid":false, "factory":new factory()}
        }

        //==探索地圖=============================
        this.map_x = 11
        this.map_y = 11
        this.map = new Array(this.map_x)
        for(var i=0; i<this.map.length; i++){
            this.map[i] = new Array(this.map_y)
        }

        this.explorer_mobility = 3
        this.explorer_data = {
            "x":Math.floor(this.map_x/2), 
            "y":Math.floor(this.map_y/2),
            "move_left":this.explorer_mobility,
            "move_available":{
                "N":true,
                "E":true,
                "W":true,
                "S":true,
            }
        };

        this.resource_point = {"wood":3,"shoe":1}

        this.create_resource_point()
        //=======================================

        //===========軍力&科技===================
        this.morale = 1; 
        
        this.troops_state = { 
            
            "armor":{"valid":true, "level":0, "amount":0}, 

            "ranger":{"valid":true, "level":0, "amount":0},

            "archer":{"valid":true, "level":0, "amount":0},

            "wizard":{"valid":false, "level":0, "amount":0},
        }

        this.RD = {
            "wall":{
                "N":{
                   "upgrade":{"level":0, "progress":0, "name":"加固木牆", "cost":1000},
                   "defence":{"level":0, "progress":0, "name":"駐城弩隊", "cost":1000},
                },
                "E":{
                    "upgrade":{"level":0, "progress":0, "name":"加固木牆", "cost":1000},
                    "defence":{"level":0, "progress":0, "name":"駐城弩隊", "cost":1000},
                },
                "W":{
                    "upgrade":{"level":0, "progress":0, "name":"加固木牆", "cost":1000},
                    "defence":{"level":0, "progress":0, "name":"駐城弩隊", "cost":1000},
                },
                "S":{
                    "upgrade":{"level":0, "progress":0, "name":"加固木牆", "cost":1000},
                    "defence":{"level":0, "progress":0, "name":"駐城弩隊", "cost":1000},
                },
            },


            "army_upgrade":{
                "all":{
                    "armor":{"level":0, "progress":0, "name":"厚木裝甲", "cost":500},
                }
            },

            "factory":{
                "all":{
                    "resin":{"level":0, "progress":0, "name":"厚木裝甲", "cost":500},
                }
            },

        }

        //============================================

        this.dict = {
            "N":"北方", "E":"東方", "W":"西方", "S":"南方", "all":"", "castle":"城堡",
            "wood":"木頭", "shoe":"草鞋(皇叔編的那種)",
            "armor":"步兵", "archer":"弓箭手", "ranger":"騎兵", "wizard":"法師", "defence":"防禦部隊",
            "tree_man":"普通樹人", "big_tree_man":"大型樹人", "stick_man":"樹枝噴吐者",
        }
    }

    updataToClient(){
        var report = {
            "roads":this.roads,
            "round":this.round,
            "resource":this.resource,
            "resource_gain":this.resource_gain,
            "special_resource":this.special_resource,
            "map_x":this.map_x,
            "map_y":this.map_y,
            "map":this.map,
            "exployer_mobility":this.explorer_mobility,
            "explorer_data":this.explorer_data,
            "resource_point":this.resource_point,
            "morale":this.morale,
            "troops_state":this.troops_state,
            "RD":this.RD,
            "dict":this.dict,
        }

        return report
    }

    gainResource(){
        for(var r in this.resource_gain){
            this.resource[r] += this.resource_gain[r]
        }
        for(var r in this.special_resource){
            if(this.special_resource[r].valid){
                var product = this.special_resource[r].factory.active()
                for(var p in product){
                    this.resource[p] += product[p]
                }
            }
        }
    }

    factoryReplenish(data){
        for(var r in data.replenishment){
            this.resource[r] -= data.replenishment[r]
        }
        this.special_resource[data.factory_type].factory.replenish(data.replenishment)
    }

    create_resource_point(){
        this.map[Math.floor(this.map_x/2)][Math.floor(this.map_y/2)] = {"type":"castle","found":true,}
        for(var resource_type in this.resource_point){
            for(var i=0; i<this.resource_point[resource_type];){
                var x = Math.floor(Math.random()*this.map_x)
                var y = Math.floor(Math.random()*this.map_y)
                if(this.map[x][y]==undefined){
                    var r = {
                        "type":resource_type,
                        "found":false,
                    }
                    this.map[x][y] = r
                    i++
                    console.log(resource_type+"x:"+x+"  y:"+y)
                }
            }
        }
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

        console.log(this.explorer_data.x + "  " + this.explorer_data.y)

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

        if(this.map[this.explorer_data.x][this.explorer_data.y]!=undefined){
            report["resource"] = this.map[this.explorer_data.x][this.explorer_data.y].type
            if(!this.map[this.explorer_data.x][this.explorer_data.y].found){
                explore_reward[this.map[this.explorer_data.x][this.explorer_data.y].type].reward(this)
                this.map[this.explorer_data.x][this.explorer_data.y].found = true
                report.msg = "發現了一個資源點:" + this.dict[report.resource]
            }
            else{
                report.msg = "這裡似乎已經探索過了"
            }
        }
        else{
            report.msg = "甚麼都沒有發現..."
        }
        console.log(report)
        return report
    }

    
    recruit(army_type, army_data){
        var level = this.troops_state[army_type].level
        for(var r in army_data[army_type][level]["cost"]){
            this.resource[r] -= army_data[army_type][level]["cost"][r];
        }
        this.troops_state[army_type]["amount"] += 1;
        console.log("招募了一對" + army_type)
    }

    deployArmy(direction, army, army_type, army_data){
        var level = this.troops_state[army_type]["level"]
        this.roads[direction].army_location[0].push(new army(army_data[army_type][level]));
        this.troops_state[army_type]["amount"] -= 1;
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
            console.log(enemy_type)
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

    research(RD, research_type, dir, sub_type){
        var level = this.RD[research_type][dir][sub_type]["level"]
        var max_research_speed = RD[research_type][sub_type][level].max_research_speed
        var difficulty = RD[research_type][sub_type][level].difficulty
        
        var research_report = {
            "done":false,
            "msg":"",
            "progress":0,
            "total":difficulty,
        }

        for(var r in RD[research_type][sub_type][level]["cost"]){
            this.resource[r] -= RD[research_type][sub_type][level]["cost"][r];
        }

        this.RD[research_type][dir][sub_type]["progress"] += Math.ceil(Math.random()*max_research_speed);
        


        if(this.RD[research_type][dir][sub_type]["progress"] >= difficulty){
            research_report.msg = "你成功研發了" + this.RD[research_type][sub_type][level]["name"]
            research_report.progress = difficulty
            research_report.done = true
            this.RD[research_type][dir][sub_type]["level"] = RD[research_type][sub_type][level].research_done(this, sub_type);
            this.RD[research_type][dir][sub_type]["progress"] = 0; 
        }
        else{
            research_report.progress = this.RD[research_type][dir][sub_type]["progress"]
            research_report.msg = "你研發了" + this.RD[research_type][sub_type][level]["name"] + ": 進度"+research_report.progress+"/"+difficulty
        }

        if(this.RD[research_type][dir][sub_type]["level"]!=-1){
            var next_research_name = RD[research_type][sub_type][level].name
            var next_cost = RD[research_type][sub_type][level].cost
            this.RD[research_type][dir][sub_type]["name"] = next_research_name
            this.RD[research_type][dir][sub_type]["cost"] = next_cost

        }

        else if(this.RD[research_type][dir][sub_type]["level"]==-1){
            delete  this.RD[research_type][dir][sub_type]
        }


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

    combat(defender_data){
        var report = []
        for(var d in this.roads){
            report.push(this.roads[d].combat(defender_data, this.morale, this.dict))
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


    armyMove(army_state){
        //行軍
        //console.log(this.army_location)
        for(var i=this.max_distance-1; i>=0; i--){
            for(var j=0; j<this.army_location[i].length; ){
                if(!this.army_location[i][j].retreat){
                    var move_to = Math.min(i + this.army_location[i][j].mobility, this.max_distance-1, this.nearest_enemy-this.army_location[i][j].attack_range); 
                    move_to = Math.max(move_to, 0);
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
    }

    armyRetreat(){
        for(var i=0; i<this.max_distance; i++){
            for(var j=0; j<this.army_location[i].length; j++){
                this.army_location[i][j].retreat = true;
            }
        }
        console.log( this.direction + "方向的部隊開始撤退")
    }

    enemyMove(){
        for(var i=0; i<this.max_distance; i++){
            if(this.enemy_location[i].length){
                for(var j=0; j<this.enemy_location[i].length;){
                    var move_to = Math.max(0, this.farest_army + this.enemy_location[i][j].attack_range, i-this.enemy_location[i][j].mobility); 
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

    roadEnemySpawn(enemy, enemy_data, day){
        for(var enemy_type in enemy_data){
            var spawn = Math.floor(Math.random()*100);
            var init = enemy_data[enemy_type]["spawn_prob_data"]["init"]*100
            var increase_rate = enemy_data[enemy_type]["spawn_prob_data"]["increase"]*100
            var max_prob = enemy_data[enemy_type]["spawn_prob_data"]["max"]*100
            var minimum_day = enemy_data[enemy_type]["spawn_prob_data"]["minimum_day"]
            var spawn_rate = Math.min(max_prob, init + increase_rate + increase_rate*day)
            if(day>=minimum_day && spawn>=spawn_rate){
                this.enemy_location[this.max_distance-1].push(new enemy(enemy_data[enemy_type]));
            }
        }  
    }

    combat(defender_data, morale, dict){
  
        var army_attack = {"armor":0, "archer":0, "ranger":0, "defence":0};
        var army_total_damage = 0
        var enemy_attack = {"tree_man":0, "big_tree_man":0, "stick_man":0};
        var enemy_total_damage = 0
        var isCombat = false;
        var farest_army = this.farest_army;
        var nearest_enemy = this.nearest_enemy
    
        if(nearest_enemy!=-1){
            var nearest_enemy_hp = this.enemy_location[nearest_enemy][0].hp;
        }
        if(farest_army!=-1){
            var farest_army_hp = this.army_location[farest_army][0].hp;
        }
    
        
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
                    army_attack["defence"] += defender_data[defence_type]["attack"]*morale;
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
            msg = "<b>" + dict[this.direction] + "</b>的城牆外傳來打鬥的聲音<br><br>"
            if(farest_army==-1 && enemy_total_damage!=0){
                this.wallhp = Math.max(0, this.wallhp-enemy_total_damage);
                wall_msg = "城牆正在被攻擊!!    受到"+enemy_total_damage+"點傷害<br>"
            }
            else if(farest_army!=-1){
                farest_army_hp = Math.max(0, farest_army_hp - enemy_total_damage);
                this.army_location[farest_army][0].hp = farest_army_hp;
                if(farest_army==0){
                    wall_msg =  "城門下方發生戰爭<br>"
                }
                else{
                    wall_msg = "距城門"+farest_army+"公里處發生戰爭<br>"
                }
                hp_msg += "<br>先鋒部隊剩餘血量為:"+farest_army_hp + "點血量    該戰場剩下士兵數:"+this.army_location[farest_army].length + "<br>"

            }

            nearest_enemy_hp = Math.max(0, nearest_enemy_hp - army_total_damage);
            this.enemy_location[nearest_enemy][0].hp = nearest_enemy_hp;
    
            if(farest_army_hp==0){
                this.army_location[farest_army].splice(0, 1);
                morale = Math.max(0.5, morale-0.1)
            }
            
        
            if(nearest_enemy_hp==0){
                for(var i in this.enemy_location[nearest_enemy][0].reward){
                    Env.resource[i] += this.enemy_location[nearest_enemy][0].reward[i];
                }
                this.enemy_location[nearest_enemy].splice(0, 1);
                morale = Math.min(1.5, morale+0.1)
            }
            damage_msg += "我方部隊造成的傷害:<br>"
            for(var army_type in army_attack){
                if(army_attack[army_type]){
                    damage_msg += "--" + dict[army_type] + "造成"+army_attack[army_type]+"點傷害<br>" 
                }
            }
            if(damage_msg=="我方部隊造成的傷害:<br>"){
                damage_msg = "我方沒有對敵人造成任何傷害..."
            }

            damage_msg += "<br>敵方部隊造成的傷害:<br>"
            for(var enemy_type in enemy_attack){   
                if(enemy_attack[enemy_type]){
                    damage_msg += "--" + dict[enemy_type] + "造成"+enemy_attack[enemy_type]+"點傷害<br>" 
                }
            }
            hp_msg += "最前線的敵人剩下"+nearest_enemy_hp+"點血量    該戰場剩下敵人數:"+this.enemy_location[nearest_enemy].length+"<br>"
            
            msg += wall_msg + damage_msg + hp_msg + "<br>******************************<br>"
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
            console.log("成功生產資源")
            return this.output
        }
        else{
            console.log("沒有足夠的資源")
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
        this.type = data[Object.keys(data)[0]];
        this.cost = data[Object.keys(data)[1]];
        this.hp = data[Object.keys(data)[2]];
        this.attack = data[Object.keys(data)[3]];
        this.attack_range = data[Object.keys(data)[4]];
        this.mobility = data[Object.keys(data)[5]];
        this.retreat = data[Object.keys(data)[6]];
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

