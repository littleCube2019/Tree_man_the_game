var Env = require("./class").Environment


exports.RD = {
    "wall_developments":[
        {
            "name":"加固木牆",
            "cost" : 1000,
            "difficulty" : 3,
            "research_speed" : Math.ceil(Math.random()*2),

    
            research_done(){
                var dir = ["W", "S", "N", "E"]
                for(var d in dir){
                    Env.roads[d].max_wallhp += 1000;
                }
            }
        },
    
        {
            "name":"雙層木牆",
            "cost" : 1500,
            "difficulty" : 5,
            "research_speed" : Math.ceil(Math.random()*2),
    
            research_done(){
                var dir = ["W", "S", "N", "E"]
                for(var d in dir){
                    Env.roads[d].max_wallhp += 2000;
                }
            }
        },
    ],

    "armor_developments":[
        {
            "name":"重型裝甲",
            "cost" : 500,
            "difficulty" : 5,
            "research_speed" : Math.ceil(Math.random()*3),

            research_done(){
                Env.troops_state["heavy_armor"]["valid"] = true;
                Env.troops_state["heavy_ranger"]["valid"] = true;
            }
        },
    
        {
            "name":"移動射擊",
            "cost" : 1000,
            "difficulty" : 10,
            "research_speed" : Math.ceil(Math.random()*3),

            research_done(){
                Env.troops_state["archer_armor"]["valid"] = true;
                Env.troops_state["archer_ranger"]["valid"] = true;
            }
        },
    ],

    "defencer_developments":[
        {
            "name":"以知用火",
            "cost" : 500,
            "difficulty" : 5,
            "research_speed" : Math.ceil(Math.random()*3),

            research_done(){
                Env.troops_state["fire_archer"]["valid"] = true;
            }
        },

        {
            "name":"重型器械",
            "cost" : 1000,
            "difficulty" : 10,
            "research_speed" : Math.ceil(Math.random()*3),

            research_done(){
                Env.troops_state["fire_archer"]["valid"] = true;
            }
        },
    ]
}

