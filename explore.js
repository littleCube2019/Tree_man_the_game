exports.explore_mercenary = {
    "normal":{
        "hp":1000,
        "attack":100,
        "daily_cost":100,
    },
}
/*
exports.exlore_event = {
    "resource":{
        "stick":{
            "amount":10,
            reward(explorer_data){
                explorer_data.resource.wood += 100
            },
            "msg":"路過一處遍布樹枝的區域，獲得了100木頭"
        },
        
    },

    "item":{
        "shoe":{
            "amount":1,
            reward(Env){
                Env.explorer_mobility += 2
            },
            "msg":"發現傳說中皇叔親手編製的草鞋，每日移動上限增加為5"
        },
    },

    "village":{
        "wood":{
            "amount":10,
            "enemy":{"hp":500, "attack":100},
            reward(resource_gain){
                resource_gain["wood"] += 500
            },
            "msg":"發現了一個被樹人包圍的村落，經過一翻交戰後將樹人擊敗。當地居民為了報答，每日會朝城內運送500木頭"
        },
        "base":{
            "amount":1,
            "msg":"發現了神木教基地",
        },
    },

}
*/
exports.exlore_event = {
    "stick":{
        "amount":10,
        "explorer_reward":{
            "wood":100,
        },
        "msg":"路過一處遍布樹枝的區域，獲得了100木頭"
    },

    "shoe":{
        "amount":1,
        "explorer_reward":{
            "explorer_mobility":2,
        },
        "msg":"發現傳說中皇叔親手編製的草鞋，每日移動上限增加為5"
    },

    "wood":{
        "amount":10,
        "enemy":{"hp":500, "attack":100},
        "resoure_reward":{
            "wood":500,
        },
        "msg":"發現了一個被樹人包圍的村落，經過一翻交戰後將樹人擊敗。當地居民為了報答，每日會朝城內運送500木頭"
    },

    "base":{
        "amount":1,
        "msg":"發現了神木教基地",
    },

    "blood":{
        "amount":4,
        "enemy":{"hp":1500, "attack":300},
        "msg":"",
    }
}
