var Env = require("./class").Environment


exports.RD = {

    //強化城牆==========================
    "wall_upgrade":[
        {
            "name":"加固木牆",
            "cost" : 1000,
            "difficulty" : 3,
            "research_speed" : Math.ceil(Math.random()*2),

    
            research_done(Env, dir){
                Env.roads[dir].max_wallhp += 1000;
            }
        },
    
        {
            "name":"雙層木牆",
            "cost" : 1500,
            "difficulty" : 5,
            "research_speed" : Math.ceil(Math.random()*2),
    
            research_done(Env, dir){
                Env.roads[dir].max_wallhp += 2000;
            }
        },
    ],

    //研發防禦==================
    "defence_developments":[
        {
            "name":"弩炮",
            "cost" : 1000,
            "difficulty" : 10,
            "research_speed" : Math.ceil(Math.random()*3),

            research_done(Env, dir){
                Env.roads[dir].defence["crossbow"] = true;
            }
        },

        {
            "name":"投石機",
            "cost" : 1000,
            "difficulty" : 10,
            "research_speed" : Math.ceil(Math.random()*3),

            research_done(Env, dir){
                Env.roads[dir].defence["catapult"] = true;
            }
        },
    ],



    //步兵升級=================
    "armor_upgrade":[
        {
            "name":"厚木裝甲",
            "cost" : 500,
            "difficulty" : 5,
            "research_speed" : Math.ceil(Math.random()*3),

            research_done(Env, dir){
                Env.troops_state["armor"]["level"] = 1;
            }
        }
    ],

}




