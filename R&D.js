var resin_factory = require("./factory").resin_factory
var army_factory = require("./factory").army_factory


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
                "difficulty" : 5,
                "max_research_speed" : 2,

                "description":"派駐一隊守城弩隊(攻擊距離:3  攻擊力:200)於城牆上<br>研究難度:5點<br>花費1000木頭可隨機升級1-2點",

                research_done(Env, dir){
                    Env.roads[dir].defence["crossbow"]["valid"] = true;
                    var next_level = 1
                    return next_level
                }
            },

            {
                "name":"投石機",
                "cost" : {"wood":2000},
                "difficulty" : 10,
                "max_research_speed" : 3,

                "description":"派駐一台投石機(攻擊距離:5  攻擊力:200)於城牆上<br>研究難度:10點<br>花費2000木頭可隨機升級1-3點",

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
                "cost" : {"wood":500},
                "difficulty" : 5,
                "max_research_speed" : 2,

                "description":"重步兵血量增加1000<br>研究難度:5點<br>花費500木頭可隨機升級1-2點",

                research_done(Env, dir){
                    Env.troops_state["armor"]["level"] = 1;
                    var next_level = -1
                    return next_level
                }
            }
        ],

        "archer":[
            {
                "name":"反曲弓",
                "cost" : {"wood":500},
                "difficulty" : 5,
                "max_research_speed" : 2,

                "description":"弓箭手攻擊力增加100<br>研究難度:5點<br>花費500木頭可隨機升級1-2點",

                research_done(Env, dir){
                    Env.troops_state["archer"]["level"] = 1;
                    var next_level = -1
                    return next_level
                }
            }
        ],

        "ranger":[
            {
                "name":"木製馬鎧",
                "cost" : {"wood":500},
                "difficulty" : 5,
                "max_research_speed" : 2,

                "description":"騎兵血量增加100攻擊增加100<br>研究難度:5點<br>花費500木頭可隨機升級1-2點",

                research_done(Env, dir){
                    Env.troops_state["ranger"]["level"] = 1;
                    var next_level = -1
                    return next_level
                }
            }
        ],

        "wizard":[
            {
                "name":"魔法學校",
                "cost" : {"resin":300},
                "difficulty" : 5,
                "max_research_speed" : 2,

                "description":"可以招募法師<br>研究難度:5點<br>花費300樹脂可隨機升級1-2點",

                research_done(Env, dir){
                    Env.troops_state["wizard"]["valid"] = true;
                    Env.troops_state["armor"]["level"] = 0;
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
                "max_research_speed" : 2,

                "description":"興建樹脂提煉廠，可以從木頭中提煉出樹脂<br>研究難度:5點<br>花費500木頭可隨機升級1-2點",

                research_done(Env, dir){
                    Env.factory_resource["resin"].factory.upgrade(Env.resource, resin_factory[0])
                    Env.factory_resource["resin"].valid = true
                    var next_level = 1
                    Env.player2.button["choose_factory"] = "工廠"
                    return next_level
                }
            },

            {
                "name":"精煉樹脂",
                "cost":{"wood":1000},
                "difficulty" : 5,
                "max_research_speed" : 2,
                "description":"研發新型提煉技術，每日能從100木頭中提煉出100樹脂<br>研究難度:5點<br>花費100木頭可隨機升級1-2點",
            
                research_done(Env, dir){
                    Env.factory_resource["resin"].factory.upgrade(Env.resource, resin_factory[1])
                    var next_level = -1                  
                    return next_level
                }
            }
        ],

        "coal":[
            {
                "name":"煤窯",
                "cost" : {"wood":500},
                "difficulty" : 5,
                "max_research_speed" : 2,

                "description":"興建煤窯，可以將木頭燒成煤碳<br>研究難度:5點<br>花費500木頭可隨機升級1-2點",

                research_done(Env, dir){
                    Env.factory_resource["coal"].factory.upgrade(Env.resource, resin_factory[0])
                    Env.factory_resource["coal"].valid = true
                    var next_level = -1
                    Env.player2.button["choose_factory"] = "工廠"
                    
                    return next_level
                }
            },
        ],

        "armor":[
            {
                "name":"步兵訓練場",
                "cost" : {"wood":500},
                "difficulty" : 5,
                "max_research_speed" : 2,

                "description":"建設步兵訓練場，可以自動招募步兵<br>研究難度:5點<br>花費500木頭可隨機升級1-2點",
                research_done(Env, dir){
                    var data = army_factory.armor[0]
                    var level = Env.troops_state.armor.level
                    var recruit_cost = Env.armor_data[level].cost
                    for(var i in recruit_cost){
                        if(recruit_cost[i] in data.input){
                            data.input[i] += recruit_cost[i]
                        }
                        else{
                            data.input[i] = recruit_cost[i]
                        }
                    }
                    for(var r in data.input){
                        data.storage[i] = 0
                    }
                    Env.factory_resource["armor"].factory.upgrade(Env.resource, data)
                    Env.factory_resource["armor"].valid = true
                    var next_level = -1
                    Env.player2.button["choose_factory"] = "工廠"
                    
                    return next_level
                }
            },
        ]
    },


    //農田研發===========================
    "resource":{
        "food":[
            {
                "name":"屯田",
                "cost" : {"wood":500},
                "difficulty" : 5,
                "max_research_speed" : 2,

                "description":"實行屯田制，增加糧食日產量500<br>研究難度:5點<br>花費500木頭可隨機升級1-2點",

                research_done(Env, dir){
                    Env.resource_gain.food += 500
                    var next_level = -1
                    return next_level
                }
            },


        ]
    },

    //外出相關================================
    "explore":{
        "lead":[
            {
                "name":"深得民心",
                "cost":{"food":500},
                "difficulty":5,
                "max_research_speed":2,

                "description":"外出時攜帶傭兵樹提升為2<br>研究難度:5點<br>花費500糧食可隨機升級1-2點",

                research_done(Env, dir){
                    Env.explore_lead = 2
                    var next_level = -1
                    return next_level
                }
            },
        ]
    },

    //偵查相關===================================
    "scout":{
        "range":[
            {
                "name":"視力矯正",
                "cost":{"food":500},
                "difficulty":5,
                "max_research_speed":2,

                "description":"偵查兵偵查範圍提升為8<br>研究難度:5點<br>花費500糧食可隨機升級1-2點",

                research_done(Env, dir){
                    Env.scout_distance = 8
                    var next_level = -1
                    return next_level
                }
            },
        ]
    },

}




