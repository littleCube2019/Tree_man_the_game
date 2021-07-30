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
        this.resource = {"wood":5000} ;

        //==探索地圖=============================
        this.x = 11
        this.y = 11
        this.map = new Array(this.x)
        for(var i=0; i<this.map.length; i++){
            this.map[i] = new Array(this.y)
        }
        this.map[Math.floor(this.x/2)][Math.floor(this.y/2)] = "castle"

        this.exployer_location = {"x":Math.floor(this.x/2), "y":Math.floor(this.y/2)};

        this.resource_spot = {"wood":3, "shoe":1}
        for(var resource_type in this.resource_spot){
            this.create_resource_spot(resource_type)
        }
        //=======================================

        //===========軍力&科技===================
        this.morale = 1; 
        
        this.troops_state = { 
            

            "armor":{"valid":true, "level":0, "amount":0}, 
            //"heavy_armor":{"valid":false, "amount":0},
            //"archer_armor":{"valid":false, "amount":0},

            "ranger":{"valid":true, "level":0, "amount":0},
            //"heavy_ranger":{"valid":false, "amount":0},
            //"archer_ranger":{"valid":false, "amount":0},

            "archer":{"valid":true, "level":0, "amount":0},

            "wizard":{"valid":false, "level":0, "amount":0},
        }

        this.RD = {
            "wall_upgrade":{
                "N":{"level":0, "progress":0},
                "E":{"level":0, "progress":0},
                "W":{"level":0, "progress":0},
                "S":{"level":0, "progress":0},
            },

            "defence_developments":{
                "N":{"level":0, "progress":0},
                "E":{"level":0, "progress":0},
                "W":{"level":0, "progress":0},
                "S":{"level":0, "progress":0},
            },


            "armor_upgrade":{"all":{"level":0, "progress":0},},
        }

        //============================================
    }

    create_resource_spot(resource_type){
        for(var i=0; i<this.resource_spot[resource_type];){
            var x = Math.floor(Math.random()*this.x)
            var y = Math.floor(Math.random()*this.y)
            if(this.map[x][y]==undefined && this.map[x][y]!="castle"){
                this.map[x][y] = resource_type
                i++
            }
        }
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
        return this.roads[direction].scout()
    }

    armyRetreat(direction){
        this.roads[direction].armyRetreat()
    }

    research(RD, research_type, dir){
        var level = this.RD[research_type][dir]["level"]
        var max_research_speed = RD[research_type][level].max_research_speed
        var difficulty = RD[research_type][level].difficulty
        
        for(var r in RD[research_type][level]["cost"]){
            this.resource[r] -= RD[research_type][level]["cost"][r];
        }

        this.RD[research_type][dir]["progress"] += Math.ceil(Math.random()*max_research_speed);
        var research_name = RD[research_type][level].name

        var report = {"research_type":research_type, "direction":dir, "done":false, "progress":this.RD[research_type][dir]["progress"], "total":difficulty, "msg":"", "level":this.RD[research_type][dir]["level"]}

        if(this.RD[research_type][dir]["progress"] >= difficulty){
            this.RD[research_type][dir]["level"] = RD[research_type][level].research_done(this, dir);
            this.RD[research_type][dir]["progress"] = 0;
            report.msg = "成功研發" + research_name
            report.done = true
            report.progress = 0
            report.level = this.RD[research_type][dir]["level"]
        }
        else{
            report.msg = "研發了:" + research_name + "， 進度:" + this.RD[research_type][dir]["progress"] + "/" + difficulty
        }
        console.log(report)
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
        console.log(this.army_location)
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

    spawnEnemy(enemy, enemy_data){
        for(var enemy_type in enemy_data){
            var spawn = Math.floor(Math.random()*100);
            if(spawn < enemy_data[enemy_type]["spawn_prob"]*100){
                this.enemy_location[this.max_distance-1].push(new enemy(enemy_data[enemy_type]));
            }
        }  
    }

    scout(){
        var scout_report = []
        if(this.nearest_enemy!=-1){
            scout_report[0] = this.direction
            scout_report[1] = this.nearest_enemy
            scout_report[2] = this.enemy_location[this.nearest_enemy][0].type
        }
        else{
            scout_report[0] = this.direction
            scout_report[1] = -1
            scout_report[2] = ""
        }
        return scout_report
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