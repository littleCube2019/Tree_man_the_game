
/*
Note : 可以使用Global variable、socket 等等主檔的變數 (限function , Data 不行)
*/
// 主畫面
var main =  new Vue({
  el: '#Main',
  
  data : {
    mode : 0

  },

  methods:{
    updateMode: function(mode){
      this.mode = mode; 
    }

  }


})



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
 
      
      if(roads){ //一定一開遊戲就會呼叫，這時roads還是NLL，會出錯
          
          var dirs = Object.keys(this.walls);;
          for(var i = 0; i< dirs.length; i++){
            var d = dirs[i];
            this.walls[d].hp = roads[d].wallhp;
            this.walls[d].maxhp = roads[d].max_wallhp;
            this.walls[d].progress = (this.walls[d].hp *100 )/this.walls[d].maxhp;
          }

      }
      
    },
  
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
      ["choose_scout","偵查",0],
      ["choose_troop_move","調度軍隊",0],
      ["choose_recruit_troop","招募士兵",0],
      ["choose_repair_wall","修築城牆",0],
      ["choose_research","研發",-1],
      ["choose_go_out","外出",1],
      ["skip","跳過這回合",0],
    ],
    pid:0
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
      $(".in_castle").hide();
      $(".outside").show();
      OUTSIDE=true;

      //選取資源畫面
      $("#bring_resource_content").empty();
					$("#bring_resource_pop").modal('toggle');
					var hasThing = false;
				
					for(var troop_type in Env.troops_state){
						
						if( Env.troops_state[troop_type].amount != 0){
							
							$("#bring_resource_content").append(troop_dic[troop_type]+"有"+Env.troops_state[troop_type].amount+"隊可隨你出城探索，選擇幾隊?<br>");

							$("#bring_resource_content").append("<select class=\"form-control\" id=\""+troop_type+"_selection_out\"></select>")
							for(var i=0; i<= parseInt(Env.troops_state[troop_type].amount) ; i++){
								$("#"+troop_type+"_selection_out").append("<option type=\""+troop_type+"\" value=\""+i+"\">"+i+"</option>") 
							}	
						


							hasThing = true;
						}
					}
					if(!hasThing){
						$("#bring_resource_content").append("沒有可外出的軍隊<br>");
					}
					$("#bring_resource_content").append("<br>================================================================================================================================<br>");

					$("#bring_resource_content").append("(以百為單位)可帶出的食物:"+Math.floor(Env.resource.food/100));
					$("#bring_resource_content").append("<select class=\"form-control\" id=\"food_selection_out\"></select>")
							for(var i=0; i<= Math.floor(Env.resource.food/100) ; i++){
								$("#food_selection_out").append("<option type=\""+troop_type+"\" value=\""+i+"\">"+i+"</option>") 
					}	

    }

    $("#go-back").show();
  } ,

  update_pid(pid){
    this.pid = pid;
  }

  }


})


//"招募" 按鈕

var recruit_troop = new Vue({
  el: '#recruit_troop',
  

  data: {
    
    troops:{
      "archer":[0,"弓箭"],

      "armor":[1,"重步兵"],

      "ranger":[2,"騎兵"],

    },
    
    state:{
      "archer":{"hp":1 ,"attack":2 , "cost":1000, "mobility":4 ,"range":5 },
      "armor":{"hp":1 ,"attack":2 , "cost":500 , "mobility":4 ,"range":5 },
      "ranger":{"hp":1 ,"attack":555 , "cost":2000 , "mobility":4 ,"range":5 },

    },
   
  },
  
  methods:{
    
  Click : function(e){

    troop_type = e.target.id;
    troop_name = "沒有";
    class recruit_troop {
      constructor(troop_type){
        this.type ='recruit';
        this.troop_type = troop_type ;
      }
    }
    can_recruit = true;
   
    var action;
    var troop = Object.keys(this.state);
    for(var i = 0 ; i<troop.length ; i++){
      console.log(troop[i])
      if(troop_type == troop[i] ){
        if(Env.resource["wood"] >= this.state[troop[i]]["cost"]["wood"]){
          action = new recruit_troop(troop_type);
          troop_name= this.troops[troop[i]][1];
        }
      
        else{
          Alert(text="你沒有足夠的木頭招募士兵");
          can_recruit=false;
        }
    }
   }
    
    
    if(can_recruit){
      var msg = "你招募了一隊"+troop_name+"隊!";
      socket.emit("action_done" , PLAYER_ID , action,msg);
    }
    
  },

  update : function(troop){
     
     for(var i =0 ;i < troop.length ; i++){
       this.state[troop[i]["type"]]= troop[i];
       $("#"+troop[i]["type"]).attr('data-original-title',this.description(this.troops[troop[i]["type"]][0]));
     }
     
      
  },

  description: function(n){
    if(n==0){
      return "需要: "+this.state["archer"]["cost"]["wood"]+"木頭 <br> 射程:"+this.state["archer"]["attack_range"]+"公里 <br> 每隊攻擊力:"+this.state["archer"]["attack"]+"<br> 移動能力:日行"+this.state["archer"]["mobility"]+"公里<br>承受傷害能力:"+this.state["archer"]["hp"]+"<br> 敘述:由平民組成的弓箭隊，準度不佳，\
      但至少會拉弓，木頭大部分用於製作木箭"
    }

    else if(n==1){
      return "需要: "+this.state["armor"]["cost"]["wood"]+"木頭 <br> 射程:近戰 <br> 每隊攻擊力:"+this.state["armor"]["attack"]+" <br> 移動能力:日行"+this.state["armor"]["mobility"]+"公里<br> 承受傷害能力:"+this.state["armor"]["hp"]+" <br> 敘述:由平民組成的步兵隊\
      ，拿著草叉、斧頭...工具就出征了，你不相信他們能擊殺敵人，但相信他們能拖延敵人，木頭幾乎用在製作木製鎧甲"
      }
    
    else if(n==2){
      return "需要: "+this.state["ranger"]["cost"]["wood"]+"木頭 <br> 射程:近戰 <br> 每隊攻擊力:"+this.state["ranger"]["attack"]+" <br> 移動能力:日行"+this.state["ranger"]["mobility"]+"公里\
      <br> 承受傷害能力:"+this.state["ranger"]["hp"]+" <br> 敘述:前帝國軍隊士兵組成，至少有基本的戰鬥技巧與騎術，還有之前留下的鏽跡斑斑的武器"

    }


  }

  }


})

// troop_move
var move_troop = new Vue({
  el: '#move_troop',
  

  data: {
      //[id , type , name ]
    troops:[
      [0,"archer","弓箭"],

      [1,"armor","重甲步兵"],

      [2,"ranger","騎兵"],

    ],
    
    state:{
      /*Example :  "armor" : [
        
        {
            "type" : "armor",
            "cost" : {"wood":500},
            "hp" : 1000,
            "attack" : 50,
            "attack_range" : 0,
            "mobility" : 1,
            "retreat" : false,
        },

        {  //Level 2
            "type" : "armor",
            "cost" : {"wood":500},
            "hp" : 2000,
            "attack" : 50,
            "attack_range" : 0,
            "mobility" : 1,
            "retreat" : false,

        },
    ],
    */
    },
    directions:[
      ["E","東"],
      ["S","南"],
      ["W","西"],
      ["N","北"],
    ],
    type : 1,
    type_name :"派出軍隊",
  },
  computed: {



  },
  methods:{
    

  update_troop: function(troops){
    
  },

  updateRangeValue: function(event){
    this.type = event.target.value;
    if(this.type == 1){
      this.type_name = "派出軍隊";
    }
    else if(this.type ==2){
      this.type_name = "通知軍隊撤退";
    }
  }

  }


})

//"研究" 按鈕

var research = new Vue({
  el: '#research',

  data: {
    
    researchs:{
      // [  name , isDir , isShow  ]
      // 未來會像troop一樣處理 ， name ==> level
      "army_upgrade":[ "強化", false , true ],
     
    },
    directions:[
      ["E","東"],
      ["S","南"],
      ["W","西"],
      ["N","北"],
    ],
    
   

    details:{
      "army_upgrade":{
        "all":{
            "armor":{"level":0, "progress":0, "data":{"cost":1000, "description":"XD" ,"name":"阿姆斯特朗式加速阿姆斯特朗迴旋炮"}},
        }
      },
    },

    
    all : "all" ,

  },

  methods:{
    Click: function(e){
      var research_type = e.target.getAttribute("research_type");
      var sub_type = e.target.getAttribute("sub_type");
      var dir =  e.target.getAttribute("dir");
      var research_name = "沒有";
      class research {
        constructor(research_type="None" , sub_type , dir){
          this.type ='research';
          this.research_type = research_type;
          this.sub_type = sub_type;
          this.direction = dir ;
        }
      }
      can_research = true;
      // 看條件

      if( Env.resource["wood"]   >=  this.details[research_type][dir][sub_type].data.cost.wood  ){
        
        action = new research(research_type,  sub_type  , dir,);
        research_name=  this.details[research_type][dir][sub_type].data.name ;
        
      }
      

      else{
        Alert(text="木頭不足研究");
        can_research=false;
      }
      
      if(can_research){
        var msg = "你開始研究了"+research_name+"!";
        socket.emit("action_done" , PLAYER_ID , action,msg);
      }
          
    },
  

    update_all : function(title,RD){
     
      if(title){
        this.researchs = title;
        
      }
      if(RD){
        this.details  = RD;
      }
  
    },

    /*update_title : function(){
      for(var i =0 ;i < troop.length ; i++){
        $("#"+troop[i]["type"]).attr('data-original-title',this.description(this.troops[troop[i]["type"]][0]));
      }
    }*/

  }
  }
)


// 外出地圖
var map = new Vue({
  el : "#map",
  data:{
    player_x : 5 , 
    player_y : 5 ,
    max_x : 11 ,
    max_y : 11 ,
  },
  methods:{
      icon : function(x,y){
        x-=1;
        y-=1;

        if(this.player_x == 5 && this.player_y ==5 ){
          $(".at-castle").show();
        }
        else{
          $(".at-castle").hide();
        }
        
        if(x == this.player_x && y == this.player_y){
          return "[P]";
        }
        else if (x == 5 && y==5){
          return "[@]";
          
        }
        else{
          return "[ ]";
        
        }
      },
      update:function(x,y){
        this.player_x = x;
        this.player_y = y;
      }
  }
  
})


var Resource = new Vue({
  el : "#resource",
  data:{
     resources : {"wood":5000, "resin":0 ,"food":1000},
     name : {"wood":"木頭" ,  "food":"食物" ,"resin":"樹脂" },
     description : {"wood":"充滿生命能量的資源，在戰亂中成為替代貨幣的存在，可用於徵召軍隊、研發科技",
                    "food":"基本生存所需的資源，城內軍隊存活、外出探索都會需要",
                    "resin":"樹中能量提煉出的精華，帝國的法師與賢者似乎知道怎麼從中利用這股能量，可用於輔助法師戰鬥、研發科技"
                    }
  },
  methods:{
     update: function(resource){
        this.resources = resource;
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