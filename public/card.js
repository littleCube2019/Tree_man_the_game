/*
format 
{
	id (int): 1001~1999 mission , 2001~2999 item , 3001~3999 sprite
	type (string) : card type ,
	name (string) : card name ,
	description(string): card description , 

}



*/
var card = [
{
	id:1000,
	type:"任務卡",
	name:"荊棘試煉I",
	description:"任務內容:採取 防禦 三次，\
	不須連續\
	回報:獲得一層荊棘(可疊加)荊棘: \
	當採取防禦姿態，被敵人攻擊可以對敵人造成與荊棘\
	層數相等的傷害" 
},
{
	id:1001,
	type:"任務卡",
	name:"荊棘試煉II",
	description:"任務內容:(需完成荊棘試煉I)\
	以荊棘造成共計3點傷害，不須連續\
	回報:\
	獲得一層荊棘" 
},
{
	id:1002,
	type:"任務卡",
	name:"銅牆鐵壁",
	description:"任務內容:\
	採取 防禦 三次，不須連續\
	回報:\
	防禦力+1" 
},
{
	id:1003,
	type:"任務卡",
	name:"壁壘",
	description:"任務內容:\
	(需完成 銅牆鐵壁)\
	連續採取 防禦 三次，否則此任務失效\
	回報:\
	防禦力+2" 
},
{
	id:1004,
	type:"任務卡",
	name:"不動如山",
	description:"任務內容:\
	(需完成 壁壘)\
	三回合內不受到傷害，否則此任務失效\
	回報:\
	防禦力+3" 
},
]
module.exports = card;