
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


//軍隊訊息  城內數量 & 城外分布
var troop_status = new Vue({
  el: '#troop_state',
  
  

  data: {
    troops: {
      "archer": {  name: '弓箭' , num:0 , valid:false} ,
      "armor":  {  name: '重步兵' , num:0 , valid:true},
     "ranger" : {  name: '騎兵' , num:0 , valid:true},
     "wizard" : {  name: '法師' , num:0 , valid:false}
    },
    
    directions:[
      ["E","東"],
      ["S","南"],
      ["W","西"],
      ["N","北"],
    ],

    max_road:10,
    army_location : {
      "E":[[],[],[],[],[],[],[],[],[],[]],
      "S":[[],[],[],[],[],[],[],[],[],[]],
      "W":[[],[],[],[],[],[],[],[],[],[]],
      "N":[[],[],[],[],[],[],[],[],[],[]],
    }
  },

  methods: {
    update : function(troops_state , roads){ //每回合更新 troop 資料
    
     
      if(troops_state){ //一定一開遊戲就會呼叫，這時還是NLL，會出錯
          
          var dirs = Object.keys(this.troops);
          for(var i = 0; i< dirs.length; i++){
            var d = dirs[i];
            this.troops[d].num = troops_state[d].amount;
            this.troops[d].valid = troops_state[d].valid;
           
          }

      }

      if(roads){
        for(var d in this.army_location){
          this.army_location[d] = roads[d].army_location;
        }
      }
      
    },

    icon: function(dir , n){
      n = parseInt(n);
      n = n-1;
   
      if(n ==0){
        return "[門]"
      }
      
      if(this.army_location[dir][n].length == 0){
        return "[ ]";
      }
      else{
        return "[*]";
      }
    }



  }



})













// "回合選擇行動"按鈕
var choose_basic = new Vue({
  el: '#choose_basic_action',
  

  data: {
    contents:{  /*"choose_scout":"偵查",
                "choose_troop_move":"調度軍隊",
                "choose_recruit_troop":"招募士兵",
                "choose_repair_wall":"修築城牆",
                "choose_research":"研發",
                "choose_go_out":"外出",
                "skip":"跳過這回合"*/},
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

          /*
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
          */
					$("#bring_resource_content").append("(以百為單位)可帶出的食物:"+Math.floor(Env.resource.food/100));
					$("#bring_resource_content").append("<select class=\"form-control\" id=\"food_selection_out\"></select>")
							for(var i=0; i<= Math.floor(Env.resource.food/100) ; i++){
								$("#food_selection_out").append("<option  value=\""+i+"\">"+i+"</option>") 
					}	

       }

       if(event.target.getAttribute("id")=="choose_factory"){
        $("#factory").show();
      }

      if(event.target.getAttribute("id")=="skip"){
        class skip {
          constructor(){
            this.type ='skip';
          }
        }
        action = new skip();
        var msg="你覺得養精蓄銳比較重要，於是這半天休息";
        socket.emit("action_done" , PLAYER_ID , action, msg);
      }

    $("#go-back").show();
  } ,

  update_pid(pid){
    this.pid = pid;
  },

  update_buttons(buttons){
    this.contents=buttons;
  }

  }


})


var factory = new Vue({
  el: '#factory' ,
  data: {
    factories : {
      resin: "resin"

    }


  },
  methods:{



  },


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
  },

  Click: function(e){
					
    var troop_type = e.target.getAttribute("Type");
    var dir = e.target.getAttribute("dir");
    var Act = e.target.getAttribute("action");
    troop_name = "沒有";
    console.log(troop_type , dir)
    dir_name = "X";
    class move_troop {
      constructor(Act,troop_type,dir){
        this.type = Act;
        this.troop_type = troop_type ;
        this.direction = dir
      }
    }
    
    if(Act == "retreat"){
      action = new move_troop(Act,troop_type,dir);
      dir_name = direct_dic[dir];
      var msg = "你對"+dir_name+"方下達了撤退命令";
      socket.emit("action_done" , PLAYER_ID , action,msg);
    }

    else{
      can_move = true;
      if(troop_type == "archer" && Env.troops_state["archer"].amount > 0   ){
        action = new move_troop(Act,troop_type,dir);
        troop_name= "弓箭";
        dir_name = direct_dic[dir];
        
      }
      else if(troop_type == "armor" && Env.troops_state["armor"].amount > 0   ){
        action = new move_troop(Act,troop_type,dir);
        troop_name="重甲步兵";
        dir_name = direct_dic[dir];
      }
      else if(troop_type == "ranger" && Env.troops_state["ranger"].amount > 0  ){
      
        action = new move_troop(Act,troop_type,dir);
        troop_name="騎兵";
        dir_name = direct_dic[dir];
      }
      else{
        Alert(text="你沒有可移動的士兵");
        can_move=false;
      }
      
      if(can_move){
        var msg = "你調動了一隊"+troop_name+"隊前往"+dir_name+"方";
        socket.emit("action_done" , PLAYER_ID , action,msg);
      }
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
      for (var r in Env.resource){
        if(this.details[research_type][dir][sub_type].data.cost[r]){
          if( Env.resource[r]   >=  this.details[research_type][dir][sub_type].data.cost[r] ){
        
            action = new research(research_type,  sub_type  , dir,);
            research_name=  this.details[research_type][dir][sub_type].data.name ;
        }
        else{
          Alert(text="資源不足研究");
          can_research=false;
        }
        
         }
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

// 顯示資源
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


//顯示城中狀態
var status_tab = new Vue({
  el : "#status_tab",
  data:{

  },
  methods:{
     Check:function(){
       res = [];
       if( Env.moriality < 1){
          res.push("缺乏食物");
       }
       else{
          res.push("正常");
       }
       return res;
     }
  }

})




// 顯示報告書
var Report  = new Vue({
  el : "#reports",
  data:{
    records : 
    {
    "combat_report":       { "name":"交戰紀錄" , "bi_type":"bi-bar-chart-line"   ,"url":"M11 2a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v12h.5a.5.5 0 0 1 0 1H.5a.5.5 0 0 1 0-1H1v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h1V7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v7h1V2zm1 12h2V2h-2v12zm-3 0V7H7v7h2zm-5 0v-3H2v3h2z"}, 
    "research_report":    { "name":"研發紀錄" ,"bi_type":"bi-book"   ,  "url":"M1 2.828c.885-.37 2.154-.769 3.388-.893 1.33-.134 2.458.063 3.112.752v9.746c-.935-.53-2.12-.603-3.213-.493-1.18.12-2.37.461-3.287.811V2.828zm7.5-.141c.654-.689 1.782-.886 3.112-.752 1.234.124 2.503.523 3.388.893v9.923c-.918-.35-2.107-.692-3.287-.81-1.094-.111-2.278-.039-3.213.492V2.687zM8 1.783C7.015.936 5.587.81 4.287.94c-1.514.153-3.042.672-3.994 1.105A.5.5 0 0 0 0 2.5v11a.5.5 0 0 0 .707.455c.882-.4 2.303-.881 3.68-1.02 1.409-.142 2.59.087 3.223.877a.5.5 0 0 0 .78 0c.633-.79 1.814-1.019 3.222-.877 1.378.139 2.8.62 3.681 1.02A.5.5 0 0 0 16 13.5v-11a.5.5 0 0 0-.293-.455c-.952-.433-2.48-.952-3.994-1.105C10.413.809 8.985.936 8 1.783z"},
    "enemy_book":     { "name":"敵人圖鑑" , "bi_type":"bi-brush"   ,  "url":"M15.825.12a.5.5 0 0 1 .132.584c-1.53 3.43-4.743 8.17-7.095 10.64a6.067 6.067 0 0 1-2.373 1.534c-.018.227-.06.538-.16.868-.201.659-.667 1.479-1.708 1.74a8.118 8.118 0 0 1-3.078.132 3.659 3.659 0 0 1-.562-.135 1.382 1.382 0 0 1-.466-.247.714.714 0 0 1-.204-.288.622.622 0 0 1 .004-.443c.095-.245.316-.38.461-.452.394-.197.625-.453.867-.826.095-.144.184-.297.287-.472l.117-.198c.151-.255.326-.54.546-.848.528-.739 1.201-.925 1.746-.896.126.007.243.025.348.048.062-.172.142-.38.238-.608.261-.619.658-1.419 1.187-2.069 2.176-2.67 6.18-6.206 9.117-8.104a.5.5 0 0 1 .596.04zM4.705 11.912a1.23 1.23 0 0 0-.419-.1c-.246-.013-.573.05-.879.479-.197.275-.355.532-.5.777l-.105.177c-.106.181-.213.362-.32.528a3.39 3.39 0 0 1-.76.861c.69.112 1.736.111 2.657-.12.559-.139.843-.569.993-1.06a3.122 3.122 0 0 0 .126-.75l-.793-.792zm1.44.026c.12-.04.277-.1.458-.183a5.068 5.068 0 0 0 1.535-1.1c1.9-1.996 4.412-5.57 6.052-8.631-2.59 1.927-5.566 4.66-7.302 6.792-.442.543-.795 1.243-1.042 1.826-.121.288-.214.54-.275.72v.001l.575.575zm-4.973 3.04.007-.005a.031.031 0 0 1-.007.004zm3.582-3.043.002.001h-.002z"}  ,
    }, 
    
  },
  methods:{
    Click: function(e){
      var ID = e.target.getAttribute("id");
      console.log(e);
      
      $("#"+ID).empty();
      $("#"+ID).append("<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" fill=\"currentColor\" class=\"bi "+this.records[ID].bi_type + " no_event_svg \" viewBox=\"0 0 16 16\"> \
      <path d=\""+this.records[ID].url + "\"/>\
      </svg>" );
      $("#"+ID+"_pop").modal('toggle');
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