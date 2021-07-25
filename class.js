//記錄所有class


// ========================== 環境 ========================================//  
/*
   維護所有遊戲資訊都記錄在這裡
   roads :  object array ， 紀錄四條路線上的情況
   maxWallhp: int , 城牆最大血量
   round : int , 回合數 (天數)
   wood :  int , 當前樹木量
   num_of_troop : object ， 目前記錄 城內 的兵種數目
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
      this.maxWallhp = 1000 ; 
      this.round = 1 ; 
      this.wood = 500 ;
      this.num_of_troop = { 
          "archer":1 ,
          "armor":0 , 
          "ranger":0 ,
      }
      this.defence_army_direction = {"archer":""}; 
    }
}


class road{
    constructor(direction){
      this.wallhp = 500;  //城牆血量
      this.direction = direction; //路的方向
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