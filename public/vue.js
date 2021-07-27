
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
          
          var dirs = ["E","S","W","N"];
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


// "回合選擇行動"按鈕
var choose_basic = new Vue({
  el: '#choose_basic_action',
  

  data: {
    contents:[
      ["choose_scout","偵查"],
      ["choose_troop_move","調度軍隊"],
      ["choose_recruit_troop","招募士兵"],
      ["choose_repair_wall","修築城牆"],
      ["skip","跳過這回合"],
    ],
  }

})


// 方向選擇的 元件
Vue.component('button-direction', {
  props:['item'] ,
  template: '<button  :dir=item[0]>{{item[1]}}</button>'
})


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