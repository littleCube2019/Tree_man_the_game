//樣板區:  紀錄每種單位的基本數值，未來升級可以調整這裡


//步兵單位=============================
exports.army_data = {
    "armor" : {
        "type" : "armor",
        "cost" : 500,
        "hp" : 1000,
        "attack" : 50,
        "attack_range" : 0,
        "mobility" : 1
    },

    "ranger" : {
        "type" : "ranger",
        "cost" : 2000,
        "hp" : 500,
        "attack" : 300,
        "attack_range" : 0,
        "mobility" : 3
    },
}


//防禦單位==============================
exports.defender_data = {
    "archer" : {
        "type" : "archer",
        "cost" : 1000,
        "attack" : 100,
        "attack_range" : 3
    }
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
        "reward" : 2000
    },

    "big_tree_man" : {
        "type" : "big_tree_man",
        "hp" : 3000,
        "attack" : 500,
        "attack_range" : 0,
        "mobility" : 1,
        "spawn_prob" : 0.05,
        "reward" : 10000
    }
}