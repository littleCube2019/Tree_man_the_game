//玩家操作相關functions


var army_data = require("./troop").army_data
var defender_data = require("./troop").defender_data
var enemy_data = require("./troop").enemy_data
var army = require("./class.js").army
var defender = require("./class.js").defender
var enemy = require("./class.js").enemy
var RD = require("./R&D").RD

//招募部隊
exports.recruit = function(Env, army_type){

    for(var r in army_data[army_type]["cost"]){
        Env.resource[r] -= army_data[army_type]["cost"][r];
    }

    Env.troops_state[army_type]["amount"] += 1;
}

//派出部隊前往指定方向
exports.deployArmy = function(Env, army_type, dir){
    var level = Env.troops_state[army_type]["level"]
    Env.roads[dir].army_location[0].push(new army(army_data[army_type][level]));
    Env.troops_state[army_type]["amount"] -= 1;
}

//修牆
exports.repairWall = function(Env, direction, unit){
    Env.resource["wood"] -= unit*100;
    Env.roads[direction].wallhp = Math.min(Env.roads[direction].wallhp+unit*100, Env.roads[direction].max_wallhp);
}

//偵查該方向最接近的敵人的位置和種類
exports.scout = function(Env, dir){
    var nearest_enemy = Env.roads[dir].nearest_enemy;
    var scout_report = []
    if(nearest_enemy!=-1){
        scout_report[0] = dir
        scout_report[1] = nearest_enemy
        scout_report[2] = Env.roads[dir].enemy_location[nearest_enemy][0].type
    }
    else{
        scout_report[0] = dir
        scout_report[1] = -1
        scout_report[2] = ""
    }
    return scout_report
} 

//撤退
exports.retreat = function(Env, dir, location, order){
    var retreat_type = Env.roads[dir].army_location[location][order].type;
    Env.num_of_troop[retreat_type]["amount"] += 1;
    Env.roads[dir].enemy_location[location].splice(order, 1);
}


//研發
exports.research = function(Env, research_type, dir){
        console.log(RD[research_type][Env.RD[research_type][dir]["level"]])
	    var research_speed = RD[research_type][Env.RD[research_type][dir]["level"]].research_speed
        var difficulty = RD[research_type][Env.RD[research_type][dir]["level"]].difficulty
        
        Env.RD[research_type][dir]["progress"] += research_speed;
        if(Env.RD[research_type][dir]["progress"] >= difficulty){
            RD[research_type][Env.RD[research_type][dir]["level"]].research_done(Env, dir);
            Env.RD[research_type][dir]["progress"] = 0;
            Env.RD[research_type][dir]["level"] += 1;
        }
}