

exports.RD = {

    //強化城牆==========================
    "wall_upgrade":[
        {
            "name":"加固木牆",
            "cost" : {"wood":1000},
            "difficulty" : 3,
            "max_research_speed" : 2,

            research_done(Env, dir){
                Env.roads[dir].max_wallhp += 1000;
                var next_level = 1
                return next_level
            }
        },
    
        {
            "name":"雙層木牆",
            "cost" : {"wood":1500},
            "difficulty" : 5,
            "max_research_speed" : 2,

            research_done(Env, dir){
                Env.roads[dir].max_wallhp += 2000;
                var next_level = -1
                return next_level
            }
        },
    ],

    //研發防禦==================
    "defence_developments":[
        {
            "name":"弩炮",
            "cost" : {"wood":1000},
            "difficulty" : 10,
            "max_research_speed" : 3,

            research_done(Env, dir){
                Env.roads[dir].defence["crossbow"]["valid"] = true;
                var next_level = 1
                return next_level
            }
        },

        {
            "name":"投石機",
            "cost" : {"wood":1000},
            "difficulty" : 10,
            "max_research_speed" : 3,

            research_done(Env, dir){
                Env.roads[dir].defence["catapult"]["valid"] = true;
                var next_level = -1
                return next_level
            }
        },
    ],



    //步兵升級=================
    "armor_upgrade":[
        {
            "name":"厚木裝甲",
            "cost" : {"wood":500},
            "difficulty" : 5,
            "max_research_speed" : 3,

            research_done(Env, dir){
                Env.troops_state["armor"]["level"] = 1;
                var next_level = -1
                return next_level
            }
        }
    ],

}




