
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
      $("#go_out").show();
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
      [0,"archer","弓箭"],

      [1,"armor","重甲步兵"],

      [2,"ranger","騎兵"],

    ],
    
    state:{
      "archer":{"hp":1 ,"attack":2 , "cost":3 , "move":4 ,"range":5 },
      "armor":{"hp":1 ,"attack":2 , "cost":3 , "move":4 ,"range":5 },
      "ranger":{"hp":1 ,"attack":555 , "cost":3 , "move":4 ,"range":5 },

    }
    
  },
  computed: {



  },
  methods:{
    

  update_troop: function(troops){

  },

  description: function(n){
    if(n==0){
      return "需要: "+this.state["archer"]["cost"]+"木頭 <br> 射程:"+this.state["archer"]["range"]+"公里 <br> 每隊攻擊力:"+this.state["archer"]["attack"]+"<br> 移動能力:日行"+this.state["archer"]["move"]+"公里<br>承受傷害能力:"+this.state["archer"]["hp"]+"<br> 敘述:由平民組成的弓箭隊，準度不佳，\
      但至少會拉弓，木頭大部分用於製作木箭"
    }

    else if(n==1){
      return "需要: "+this.state["armor"]["cost"]+"木頭 <br> 射程:近戰 <br> 每隊攻擊力:"+this.state["armor"]["attack"]+" <br> 移動能力:日行"+this.state["armor"]["move"]+"公里<br> 承受傷害能力:"+this.state["armor"]["hp"]+" <br> 敘述:由平民組成的步兵隊\
      ，拿著草叉、斧頭...工具就出征了，你不相信他們能擊殺敵人，但相信他們能拖延敵人，木頭幾乎用在製作木製鎧甲"
      }
    
    else if(n==2){
      return "需要: "+this.state["ranger"]["cost"]+"木頭 <br> 射程:近戰 <br> 每隊攻擊力:"+this.state["ranger"]["attack"]+" <br> 移動能力:日行"+this.state["ranger"]["move"]+"公里\
      <br> 承受傷害能力:"+this.state["ranger"]["hp"]+" <br> 敘述:前帝國軍隊士兵組成，至少有基本的戰鬥技巧與騎術，還有之前留下的鏽跡斑斑的武器，木頭用在他們的軍餉與馬的飼料"

    }


  }

  }


})



//"研究" 按鈕

var research = new Vue({
  el: '#research',

  data: {
    
    researchs:[
      // [ number , id , name , isDir   ]
      // 未來會像troop一樣處理 ， name ==> level
      [0,"wall_upgrade","城牆加固" , true],

      [1,"defence_developments","防禦工事" , true],

      [2,"armor_upgrade","士兵升級" , false],

    ],
    directions:[
      ["E","東"],
      ["S","南"],
      ["W","西"],
      ["N","北"],
    ],
    
    level:{
      "wall_upgrade":{ "E":1 , "S":1 , "W":2 ,"N":1},
      "defence_developments":{ "E":1 , "S":2 , "W":1 ,"N":1},
      "armor_upgrade":{"all":1},
    },

    name:{
      "wall_upgrade" : {1:"加固木牆" , 2: "雙重木牆"},
      "defence_developments":{1:"駐城弩隊" , 2:"守城投石機"},
      "armor_upgrade" : {1:"厚木甲"}
    }
   
  },

  methods:{
    Click: function(event){
          
      },
    Name: function(id , dir){
      return this.name[id][this.level[id][dir]];
    }
  }
  }
)











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