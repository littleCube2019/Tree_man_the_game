var resin_factory = require("./factory").resin_factory


exports.RD = {

    //城牆加固==========================
    "wall":{
        "upgrade":[
            {
                "name":"加固木牆",
                "cost" : {"wood":1000},
                "difficulty" : 3,
                "max_research_speed" : 2,

                "description":"增加城牆1000耐久度上限<br>研究難度:3點<br>花費1000木頭可隨機升級1-2點",

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

                "description":"增加城牆2000耐久度上限<br>研究難度:5點<br>花費1500木頭可隨機升級1-2點",

                research_done(Env, dir){
                    Env.roads[dir].max_wallhp += 2000;
                    var next_level = -1
                    return next_level
                }
            },
        ],
        
        "defence":[
            {
                "name":"守城弩隊",
                "cost" : {"wood":1000},
                "difficulty" : 10,
                "max_research_speed" : 3,

                "description":"派駐一隊守城弩隊(攻擊距離:3  攻擊力:200)於城牆上<br>研究難度:10點<br>花費1000木頭可隨機升級1-3點",

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

                "description":"派駐一台投石機(攻擊距離:5  攻擊力:200)於城牆上<br>研究難度:10點<br>花費1000木頭可隨機升級1-3點",

                research_done(Env, dir){
                    Env.roads[dir].defence["catapult"]["valid"] = true;
                    var next_level = -1
                    return next_level
                }
            },
        ]
    },




    //步兵升級=================
    "army_upgrade":{
        "armor":[
            {
                "name":"厚木裝甲",
                "cost" : {"food":500},
                "difficulty" : 5,
                "max_research_speed" : 3,

                "description":"重步兵血量增加1000<br>研究難度:5點<br>花費500木頭可隨機升級1-3點",

                research_done(Env, dir){
                    Env.troops_state["armor"]["level"] = 1;
                    var next_level = -1
                    return next_level
                }
            }
        ],
    },

    //半成品加工===========================
    "factory":{
        "resin":[
            {
                "name":"樹脂提煉廠",
                "cost" : {"wood":500},
                "difficulty" : 5,
                "max_research_speed" : 3,

                "description":"興建樹脂提煉廠，可以從木頭中提煉出樹脂<br>研究難度:10點<br>花費1000木頭可隨機升級1-3點",

                research_done(Env, dir){
                    Env.factory_resource["resin"].factory.upgrade(Env.resource, resin_factory[0])
                    Env.factory_resource["resin"].valid = true
                    var next_level = -1
                    Env.player2.button["choose_factory"] = "工廠"
                    
                    return next_level
                }
            }
        ]
    },


    //農田研發===========================
    "resource":{
        "food":[
            {
                "name":"屯田",
                "cost" : {"wood":500},
                "difficulty" : 5,
                "max_research_speed" : 3,

                "description":"實行屯田制，增加糧食日產量500<br>研究難度:10點<br>花費1000木頭可隨機升級1-3點",

                research_done(Env, dir){
                    Env.resource_gain.food += 500
                    var next_level = -1
                    return next_level
                }
            },


        ]
    },

    //
    "explore":{
        "lead":[
            {
                "name":"領導1",
                "cost":{"food":500},
                "difficulty":5,
                "max_research_speed":3,

                "description":"外出時攜帶傭兵樹提升為2<br>研究難度:10點<br>花費500糧食可隨機升級1-3點",

                research_done(Env, dir){
                    Env.explore_lead = 2
                    var next_level = -1
                    return next_level
                }
            },
        ]
    }

}




