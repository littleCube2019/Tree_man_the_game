var resin_factory = require("./factory").resin_factory


exports.RD = {

    //強化城牆==========================
    "wall":{
        "upgrade":[
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
        
        "defence":[
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
        ]
    },

    //研發防禦==================



    //步兵升級=================
    "army_upgrade":{
        "armor":[
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
        ]
    },

    "factory":{
        "resin":[
            {
                "name":"樹脂提煉廠",
                "cost" : {"wood":500},
                "difficulty" : 5,
                "max_research_speed" : 3,

                research_done(Env, dir){
                    Env.special_resource["resin"].factory.upgrade(Env.resource, resin_factory[0])
                    var next_level = -1
                    return next_level
                }
            }
        ]
    }

}




