/*
//回合結算相關functions




//回合結束部隊自動移動=======================
//只會在道路內移動，若走到盡頭則會停在原地
//若有敵人進入攻擊範圍內則不會繼續往前
exports.armyMove = function(Env, dir){
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

  
exports.enemyMove = function(Env, dir){
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
exports.spawnEnemy = function(Env, dir, enemy, enemy_data){
    for(var enemy_type in enemy_data){
        var spawn = Math.floor(Math.random()*100);
		if(spawn < enemy_data[enemy_type]["spawn_prob"]*100){
			Env.roads[dir].enemy_location[Env.roads[dir].max_distance-1].push(new enemy(enemy_data[enemy_type]));
		}
    }  
	/*
  	var spawn_tree_man = Math.floor(Math.random()*100);
    var spawn_big_tree_man = Math.floor(Math.random()*100);
    if(spawn_tree_man < enemy_data["tree_man"]["spawn_prob"]*100){ //0.2
        Env.roads[dir].enemy_location[Env.roads[dir].max_distance-1].push(new enemy(enemy_data["tree_man"]));
    }
    if(spawn_big_tree_man < enemy_data["big_tree_man"]["spawn_prob"]*100 && Env.round>=10){ //0.05
        Env.roads[dir].enemy_location[Env.roads[dir].max_distance-1].push(new enemy(enemy_data["big_tree_man"]));
    }
	*/
}
//=============================================

exports.isGameover = function(Env){
    return(Env.roads["E"].wallhp<=0 || Env.roads["W"].wallhp<=0 || Env.roads["N"].wallhp<=0 || Env.roads["S"].wallhp<=0)
    //console.log("gameover");
    //io.emit("gameover");
}
*/