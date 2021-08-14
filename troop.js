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
        "hp" : 1,
        "attack" : 1,
        "attack_range" : 0,
        "mobility" : 10,
        "spawn_prob_data":{
            "minimum_day":1,
            "init":0.2,
            "increase":0.05,
            "max":0.5,
        },
        "reward" : {"wood":2000},
        "description":"普通的樹人，血量:600，攻擊力:50，攻擊距離:0，移動能力:1，擊殺可獲得2000木頭",
    },

    "stick_man" : {
        "type" : "stick_man",
        "hp" : 1,
        "attack" : 1,
        "attack_range" : 3,
        "mobility" : 1,
        "spawn_prob_data":{
            "minimum_day":1,
            "init":0.2,
            "increase":0.05,
            "max":0.5,
        },
        "reward" : {"wood":3000},
        "description":"樹枝噴吐者，擅長射出身上的樹枝攻擊敵人，血量:500，攻擊力:200，攻擊距離:3，移動能力:1，擊殺可獲得3000木頭",
    },

    "big_tree_man" : {
        "type" : "big_tree_man",
        "hp" : 1,
        "attack" : 1,
        "attack_range" : 0,
        "mobility" : 1,
        "spawn_prob_data":{
            "minimum_day":10,
            "init":0.05,
            "increase":0.01,
            "max":0.2,
        },
        "reward" : {"wood":10000},
        "description":"突變的超大型樹人，血量:3000，攻擊力:500，攻擊距離:0，移動能力:1，擊殺可獲得10000木頭",
    },

    
}