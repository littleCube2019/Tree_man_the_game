var app = new Vue({
    el: '#app',  //綁定 id=app 的html元素
    data: {
      message: 'Hello Vue!' // app內都可以使用 {{message}}
    }
  })

var wall_repair_option = new Vue({
    el: '#wall_repair_option',  
    data: {
      option: 'Hello Vue!' // app內都可以使用 {{message}}
    }
})

var move_troop = Vue({
  el: '.troop_move_btn',  
  data: {
    items: [
      { ID: 'E' , content : '東' },
      { ID: 'S' , content : '南' },
      { ID: 'W' , content : '西' },
      { ID: 'N' , content : '北' },
    ]
  }
})


