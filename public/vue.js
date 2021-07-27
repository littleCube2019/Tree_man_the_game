
/*
Note : 可以使用Global variable、socket 等等主檔的變數 (限function , Data 不行)
*/


// 選擇玩家按鈕  
var choose_player = new Vue({
  el: '#choose_player',
  
  methods:{
    Click: function(event){

      var value = event.currentTarget.value;

      PLAYER_ID = value;
      $("#pl1").hide();
      $("#pl2").hide();
      if(value == 1){
        $("#pl").text("你是玩家1");
        socket.emit("choose_character", 1);
      }
      else{
        $("#pl").text("你是玩家2");
        socket.emit("choose_character", -1);
      }
    }
  }
})

//城牆訊息
var wall_status = new Vue({
  el: '#wall_state',
  

  data: {
    walls: {
      "E":{  dir: '東' , hp:0 , maxhp:0 , progress:0  },
      "S":{ dir: '南' , hp:0 ,  maxhp:0 , progress:0   },
      "W":{ dir: '西' , hp:0 ,  maxhp:0 , progress:0   },
      "N":{ dir: '北' , hp:0 ,  maxhp:0 , progress:0   },
    },

  },

  methods: {
    update : function(roads){ //每回合更新 wall 資料
      console.log(roads);
      
      if(roads){ //一定一開遊戲就會呼叫，這時roads還是NLL，會出錯
          
          var dirs = Object.keys(this.walls);;
          for(var i = 0; i< dirs.length; i++){
            var d = dirs[i];
            this.walls[d].hp = roads[d].wallhp;
            this.walls[d].maxhp = roads[d].max_wallhp;
            this.walls[d].progress = (this.walls[d].hp *100 )/this.walls[d].maxhp;
          }

      }
      
    }
  }



})


//軍隊訊息
var troop_status = new Vue({
  el: '#troop_state',
  

  data: {
    troops: {
      "archer": {  name: '弓箭' , num:0 , valid:false} ,
      "armor":  {  name: '重步兵' , num:0 , valid:true},
     "ranger" : {  name: '騎兵' , num:0 , valid:true},
     "wizard" : {  name: '法師' , num:0 , valid:false}
    },

  },

  methods: {
    update : function(troops_state){ //每回合更新 wall 資料
    
      
      if(troops_state){ //一定一開遊戲就會呼叫，這時roads還是NLL，會出錯
          
          var dirs = Object.keys(this.troops);
          for(var i = 0; i< dirs.length; i++){
            var d = dirs[i];
            this.troops[d].num = troops_state[d].amount;
            this.troops[d].valid = troops_state[d].valid;
           
          }

      }
      
    }
  }



})













// "回合選擇行動"按鈕
var choose_basic = new Vue({
  el: '#choose_basic_action',
  

  data: {
    contents:[
      ["choose_scout","偵查"],
      ["choose_troop_move","調度軍隊"],
      ["choose_recruit_troop","招募士兵"],
      ["choose_repair_wall","修築城牆"],
      ["choose_research","研發"],
      ["choose_go_out","外出"],
      ["skip","跳過這回合"],
    ],
  },

  methods:{
    choose_action: function (event) {
      $("#choose_basic_action").hide();
      
     if(event.target.getAttribute("id")=="choose_troop_move"){
        $("#move_troop").show();
     }
     
     if(event.target.getAttribute("id")=="choose_recruit_troop"){
     
       $("#recruit_troop").show();
     }
     if(event.target.getAttribute("id")=="choose_repair_wall"){
       $("#repair_wall").show();
     }
    
     if(event.target.getAttribute("id")=="choose_scout"){
       $("#scout").show();
     }
    
     if(event.target.getAttribute("id")=="choose_research"){
      $("#research").show();
    }

    if(event.target.getAttribute("id")=="choose_go_out"){
      $("#scout").show();
    }

    $("#go-back").show();
  }
  }


})


//"招募" 按鈕

var recruit_troop = new Vue({
  el: '#recruit_troop',
  

  data: {
    troops:[
      ["需要: 1000木頭 <br> 射程:遠距離 <br> 每隊攻擊力:100 <br> 移動能力:無 <br>承受傷害能力:無<br> 敘述:由平民組成的弓箭隊，準度不佳，\
      但至少會拉弓，站在附近唯一高處的四面城牆上射擊，城牆倒下之前不會被消滅，木頭大部分用於製作木箭"
      ,"archer",
      "弓箭"],

      ["需要: 500木頭 <br> 射程:近戰 <br> 每隊攻擊力:50 <br> 移動能力:日行1公里<br> 承受傷害能力:1000 <br> 敘述:由平民組成的步兵隊\
      ，拿著草叉、斧頭...工具就出征了，你不相信他們能擊殺敵人，但相信他們能拖延敵人，木頭幾乎用在製作木製鎧甲","armor","重甲步兵"],
      ["需要: 2000木頭 <br> 射程:近戰 <br> 每隊攻擊力:300 <br> 移動能力:日行3公里\
      <br> 承受傷害能力:500 <br> 敘述:前帝國軍隊士兵組成，至少有基本的戰鬥技巧與騎術，還有之前留下的鏽跡斑斑的武器，木頭用在他們的軍餉與馬的飼料","ranger","騎兵"],

      
      
    ],
  },

  methods:{
    choose_action: function (event) {
      $("#choose_basic_action").hide();
      
     if(event.target.getAttribute("id")=="choose_troop_move"){
        $("#move_troop").show();
     }
     
     if(event.target.getAttribute("id")=="choose_recruit_troop"){
     
       $("#recruit_troop").show();
     }
     if(event.target.getAttribute("id")=="choose_repair_wall"){
       $("#repair_wall").show();
     }
    
     if(event.target.getAttribute("id")=="choose_scout"){
       $("#scout").show();
     }
    
     if(event.target.getAttribute("id")=="choose_research"){
      $("#research").show();
    }

    if(event.target.getAttribute("id")=="choose_go_out"){
      $("#scout").show();
    }

    $("#go-back").show();
  }
  }


})















// 方向選擇的 元件
Vue.component('button-direction', {
  props:['item'] ,
  template: '<button  :dir=item[0]>{{item[1]}}</button>'
})

// 對應到class要這樣寫
var all_dir_btn = document.querySelectorAll(".dir_btn");
var each = Array.prototype.forEach;
each.call(all_dir_btn, (el, index) => new Vue({el,
  data: {
    directions:[
      ["E","東"],
      ["S","南"],
      ["W","西"],
      ["N","北"],
    ]
  }

}))


/*
var app = new Vue({
  el: '#app',
  

  data: {
   
     

  },

  methods: {
   
   
  }



})
*/