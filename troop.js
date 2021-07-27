//樣板區:  紀錄每種單位的基本數值，未來升級可以調整這裡


//步兵單位=============================
exports.army_data = {
    "armor" : {
        "type" : "armor",
        "cost" : {"wood":500},
        "hp" : 1000,
        "attack" : 50,
        "attack_range" : 0,
        "mobility" : 1
    },

    "heavy_armor":{
        "type" : "heavy_armor",
        "cost" : {"wood":1000},
        "hp" : 2000,
        "attack" : 100,
        "attack_range" : 0,
        "mobility" : 1
    },

    "archer_armor":{
        "type" : "archer_armor",
        "cost" : {"wood":2000},
        "hp" : 1000,
        "attack" : 250,
        "attack_range" : 3,
        "mobility" : 1
    },


    "ranger" : {
        "type" : "ranger",
        "cost" : {"wood":2000},
        "hp" : 500,
        "attack" : 300,
        "attack_range" : 0,
        "mobility" : 3
    },

    "heavy_ranger":{
        "type" : "heavy_ranger",
        "cost" : {"wood":3000},
        "hp" : 1000,
        "attack" : 300,
        "attack_range" : 0,
        "mobility" : 2
    },

    "archer_ranger":{
        "type" : "archer_ranger",
        "cost" : {"wood":2000},
        "hp" : 500,
        "attack" : 250,
        "attack_range" : 3,
        "mobility" : 3
    },
}


//防禦單位==============================
exports.defender_data = {
    "archer" : {
        "type" : "archer",
        "cost" : {"wood":1000},
        "attack" : 100,
        "attack_range" : 3
    },

    "fire_archer" : {
        "type" : "fire_archer",
        "cost" : {"wood":2000},
        "attack" : 200,
        "attack_range" : 3
    },
    
    "catapult" : {
        "type" : "catapult",
        "cost" : {"wood":3000},
        "attack" : 200,
        "attack_range" : 5
    },

}


//敵人==================================
exports.enemy_data = {
    "tree_man" : {
        "type" : "tree_man",
        "hp" : 600,
        "attack" : 250,
        "attack_range" : 0,
        "mobility" : 10,
        "spawn_prob" : 0.2,
        "reward" : {"wood":2000},
    },

    "big_tree_man" : {
        "type" : "big_tree_man",
        "hp" : 3000,
        "attack" : 500,
        "attack_range" : 0,
        "mobility" : 1,
        "spawn_prob" : 0.05,
        "reward" : {"wood":10000},
    },

    "stick_man" : {
        "type" : "stick_man",
        "hp" : 500,
        "attack" : 200,
        "attack_range" : 3,
        "mobility" : 1,
        "spawn_prob" : 0.2,
        "reward" : {"wood":3000},
    },
}