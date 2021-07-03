var num_message = 0;
var MAX_MESSAGE = 22;




//This is an API for you , 
//you DO NOT need to understand how it works.
//You just need to know how to use it.
function addMessage(Text){
	if(num_message>= MAX_MESSAGE){
		$("#message div:nth-child(1)").remove();
	}

	if(num_message %2 ==0){
		$("#message").append("<div style=\"background-color:#F0F8FF\">"+Text+"</div>");
	} 
	else{
		$("#message").append("<div style=\"background-color:#DCDCDC\">"+Text+"</div>");
	}
	num_message+=1;
}





// here is an example for you
$(function(){
	$("#pick-stone").click(function(){
		addMessage("哈囉");
	})

	$("#dig-stone").click(function(){
		addMessage("你挖了石頭");
	})

	$("#eating").click(function(){
		$("#food").text(parseInt($("#food").text())+1);
	})
	
	$("#action_atk").click(()=>{
		socket.emit("action", "atk", id);
		addMessage("你選擇了攻擊");
	});
	$("#action_def").click(()=>{
		socket.emit("action", "def", id);
		addMessage("你選擇了攻擊");
	});


})