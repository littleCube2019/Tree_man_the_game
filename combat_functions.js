//戰鬥相關functions



//==================處理戰報 ========================

exports.combat_report_process = function(Env, combat_report){
    direct_dic = {
      "E" : "東",
      "S" : "南",
      "W" : "西",
      "N" : "北"
    }
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
          var msg =  "位於"+direct_dic[r["direction"]]+"方城門下方發生戰爭<br>我方造成"+r["army_attack"]+"點傷害，樹人造成"+r["enemy_attack"]+"點傷害<br>先鋒部隊剩餘血量為:"+r["army_hp"]+"，該樹人剩下"+r["enemy_hp"]+"點血量<br>"; 
          reports.push(msg);
        }
  
        var msg = "該戰場剩下士兵數:"+num_of_troop+"<br>該戰場剩下敵人數:"+num_of_enemy+"<br>";
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
exports.combat = function(Env, dir, total_report, defender_data){
  
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
      if(nearest_enemy<=defender_data["archer"]["attack_range"] && Env.defence_army_direction["archer"]==dir){
        army_attack += Env.num_of_troop["archer"] * defender_data["archer"]["attack"];
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