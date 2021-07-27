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

            "ranger":{"valid":true, "level":0, "amount":0} ,
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


            "army_upgrade":{"all":{"level":0, "progress":0},},
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
    check(){
        return this.map[this.exployer_location["x"]][this.exployer_location["y"]]
    }
}


class road{
    constructor(direction){
      this.max_wallhp = 1000 ; //城牆最大血量 
      this.wallhp = 500;  //城牆血量
      this.direction = direction; //路的方向
      this.defence = {"crossbow":true, "catapult":false}
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
        this.move_distance = data[Object.keys(data)[5]];
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
        this.move_distance = data[Object.keys(data)[4]];
        this.spawm_prob = data[Object.keys(data)[5]];
        this.reward = data[Object.keys(data)[6]];
    }
}
// ====================單位"種類"樣版區 end ==================================// 