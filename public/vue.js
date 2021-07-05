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