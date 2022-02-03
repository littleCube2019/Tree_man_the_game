//樣板區:  紀錄每種單位的基本數值，未來升級可以調整這裡


//步兵單位=============================
exports.army_data = {
    
    //步兵系==============
    "armor" : [
        
        {
            "type" : "armor",
            "cost" : {"wood":500},
            "daily_cost":{"food":100},
            "hp" : 1000,
            "attack" : 50,
            "attack_range" : 0,
            "mobility" : 1,
            "retreat" : false,

            "description":"",
        },
        {
            "type" : "armor",
            "cost" : {"wood":500},
            "daily_cost":{"food":100},
            "hp" : 2000,
            "attack" : 50,
            "attack_range" : 0,
            "mobility" : 1,
            "retreat" : false,

            "description":"",
        },
    ],


    //騎兵系==============
    "ranger" : [
        
        {
            "type" : "ranger",
            "cost" : {"wood":2000},
            "daily_cost":{"food":100},
            "hp" : 500,
            "attack" : 300,
            "attack_range" : 0,
            "mobility" : 3,
            "retreat" : false,

            "description":"",
        },
        {
            "type" : "ranger",
            "cost" : {"wood":2000},
            "daily_cost":{"food":100},
            "hp" : 600,
            "attack" : 400,
            "attack_range" : 0,
            "mobility" : 3,
            "retreat" : false,

            "description":"",
        },

    ],

    //弓兵系===============
    "archer" : [
        
        {
            "type" : "archer",
            "cost" : {"wood":1000},
            "daily_cost":{"food":100},
            "hp" : 250,
            "attack" : 100,
            "attack_range" : 3,
            "mobility" : 1,
            "retreat" : false,

            "description":"",
        },
        {
            "type" : "archer",
            "cost" : {"wood":1000},
            "daily_cost":{"food":100},
            "hp" : 250,
            "attack" : 200,
            "attack_range" : 3,
            "mobility" : 1,
            "retreat" : false,

            "description":"",
        },


    ],


    //法師系===============
    "wizard" : [
        
        {
            "type" : "widard",
            "cost" : {"wood":2000},
            "daily_cost":{"food":100},
            "hp" : 100,
            "attack" : 250,
            "attack_range" : 3,
            "mobility" : 1,
            "retreat" : false,

            "description":"",
        },

    ],
}


//防禦單位==============================
exports.defender_data = {

    "crossbow" : {
        "type" : "crossbow",
        "attack" : 200,
        "attack_range" : 3
    },
    
    "catapult" : {
        "type" : "catapult",
        "attack" : 200,
        "attack_range" : 5
    },

}


//敵人==================================
exports.enemy_data = {
    "tree_man" : {
        "type" : "tree_man",
        "hp" : 300,
        "attack" : 1,
        "attack_range" : 0,
        "mobility" : 1,
        "spawn_prob_data":{
            "minimum_day":1,
            "init":0.1,
            "increase":0.01,
            "max":0.2,
        },
        "reward" : {"wood":1000},
        "description":"普通的樹人，血量:600，攻擊力:50，攻擊距離:0，移動能力:1，擊殺可獲得2000木頭",
    },

    "stick_man" : {
        "type" : "stick_man",
        "hp" : 200,
        "attack" : 1,
        "attack_range" : 3,
        "mobility" : 1,
        "spawn_prob_data":{
            "minimum_day":5,
            "init":0.1,
            "increase":0.01,
            "max":0.2,
        },
        "reward" : {"wood":1500},
        "description":"樹枝噴吐者，擅長射出身上的樹枝攻擊敵人，血量:500，攻擊力:200，攻擊距離:3，移動能力:1，擊殺可獲得3000木頭",
    },

    "big_tree_man" : {
        "type" : "big_tree_man",
        "hp" : 2500,
        "attack" : 1,
        "attack_range" : 0,
        "mobility" : 1,
        "spawn_prob_data":{
            "minimum_day":20,
            "init":0.01,
            "increase":0.001,
            "max":0.05,
        },
        "reward" : {"wood":5000},
        "description":"突變的超大型樹人，血量:3000，攻擊力:500，攻擊距離:0，移動能力:1，擊殺可獲得10000木頭",
    },
}

exports.elite_enemy_data = {
    "elite_tree_man":{
        "type" : "elite_tree_man",
        "hp" : 1500,
        "attack" : 1,
        "attack_range" : 0,
        "mobility" : 1,
        "spawn_prob_data":0.2,
        "reward" : {"wood":1000},
        "description":"菁英樹人，血量:1500，攻擊力:150，攻擊距離:0，移動能力:1，擊殺可獲得1000木頭",
    },

    "elite_stick_man":{
        "type" : "elite_stick_man",
        "hp" : 1000,
        "attack" : 1,
        "attack_range" : 3,
        "mobility" : 1,
        "spawn_prob_data":0.2,
        "reward" : {"wood":1500},
        "description":"菁英樹枝噴吐者，血量:1000，攻擊力:200，攻擊距離:0，移動能力:1，擊殺可獲得1500木頭",
    },
}