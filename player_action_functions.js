//玩家操作相關functions


var army_data = require("./troop").army_data
var defender_data = require("./troop").defender_data
var enemy_data = require("./troop").enemy_data
var army = require("./class.js").army
var defender = require("./class.js").defender
var enemy = require("./class.js").enemy


//招募部隊
exports.recruit = function(Env, type){
    if(type=='archer'){
      Env.wood -= defender_data["archer"]["cost"];
      Env.num_of_troop["archer"] += 1;
    }
    else if(type=='armor'){
      Env.wood -= army_data["armor"]["cost"];
      Env.num_of_troop["armor"] += 1;
    }
    else if(type=='ranger'){
      Env.wood -= army_data["ranger"]["cost"];
      Env.num_of_troop["ranger"] += 1;
    }
}

//派出部隊前往指定方向
exports.deployArmy = function(Env, army_type, dir){
    if(army_type=="archer"){
      Env.defence_army_direction["archer"] = dir;
    }
    else if(army_type=="armor"){
      Env.roads[dir].army_location[0].push(new army(army_data["armor"]));
      Env.num_of_troop["armor"] -= 1;
    }
    else if(army_type=="ranger"){
      Env.roads[dir].army_location[0].push(new army(army_data["ranger"]));
      Env.num_of_troop["ranger"] -= 1;
    }
}

//修牆
exports.repairWall = function(Env, direction, unit){
    Env.wood -= unit*100;
    Env.roads[direction].wallhp = Math.min(Env.roads[direction].wallhp+unit*100, Env.maxWallhp);
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
    Env.num_of_troop[retreat_type] += 1;
    Env.roads[dir].enemy_location[location].splice(order, 1);
}