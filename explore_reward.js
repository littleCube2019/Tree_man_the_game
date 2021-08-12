exports.explore_mercenary = {
    "normal":{
        "cost":100,
        "hp":1000,
        "attack":100,
        "daily_cost":10,
    },
}

exports.exlore_event = {
    "resource":{
        "stick":{
            reward(explorer_data){
                explorer_data.resource.wood += 100
            },
            "msg":"路過一處遍布樹枝的區域，獲得了100木頭"
        },
        "shoe":{
            reward(explorer_data){
                explorer_data.mobility += 2
            },
            "msg":"發現傳說中皇書親手編製的草鞋，每日移動上限增加為5"
        },
    },

    "village":{
        "wood":{
            "enemy":{"hp":1000, "attack":100},
            reward(resource_gain){
                resource_gain["wood"] += 500
            },
            "msg":"發現了一個被樹人包圍的村落，經過一翻交戰後將樹人擊敗。當地居民為了報答，每日會朝城內運送500木頭"
        }

        
    }
    
}
