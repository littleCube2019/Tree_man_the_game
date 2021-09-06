exports.resin_factory =  [
    {
        "name":"初級樹脂提煉廠",
        "input":{"wood":100},
        "output":{"resin":50},
        "storage":{"wood":0},
        "description":"每日可以使用100木頭提煉50樹脂",
    },

    {
        "name":"中級樹脂提煉廠",
        "input":{"wood":100},
        "output":{"resin":100},
        "storage":{"wood":0},
        "description":"每日可以使用100木頭提煉100樹脂",
    }
]

exports.coal_factory = [
    {
        "name":"初級媒窯",
        "input":{"wood":100},
        "output":{"coal":100},
        "storage":{"wood":0},
        "description":"每日可以使用100木頭燒製100煤炭",
    },
]

exports.army_factory = {
    armor:[
        {
            "name":"步兵訓練場",
            "input":{"resin":50},
            "output":{"armor":1},
            "storage":{},
            "description":"每日可以花費額外50樹脂自動招募1步兵",
        }
    ],

    archer:[
        {
            "name":"弓兵訓練場",
            "input":{"resin":50},
            "output":{"archer":1},
            "storage":{},
            "description":"每日可以花費額外50樹脂自動招募1弓兵",
        }
    ],

    ranger:[
        {
            "name":"騎兵訓練場",
            "input":{"resin":50},
            "output":{"ranger":1},
            "storage":{},
            "description":"每日可以花費額外50樹脂自動招募1騎兵",
        }
    ],

    wizard:[
        {
            "name":"法師訓練場",
            "input":{"resin":50},
            "output":{"wizard":1},
            "storage":{},
            "description":"每日可以花費額外50樹脂自動招募1法師",
        }
    ],
}

    
