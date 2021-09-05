exports.resin_factory =  [
    {
        "input":{"wood":100},
        "output":{"resin":50},
        "storage":{"wood":0},
    },

    {
        "input":{"wood":100},
        "output":{"resin":100},
        "storage":{"wood":0},
    }
]

exports.coal_factory = [
    {
        "input":{"wood":100},
        "output":{"coal":100},
        "storage":{"wood":0},
    },
]

exports.army_factory = {
    armor:[
        {
            "input":{"resin":50},
            "output":{"armor":1},
            "storage":{},
        }
    ],

    archer:[
        {
            "input":{"resin":50},
            "output":{"archer":1},
            "storage":{},
        }
    ],

    ranger:[
        {
            "input":{"resin":50},
            "output":{"ranger":1},
            "storage":{},
        }
    ],

    wizard:[
        {
            "input":{"resin":50},
            "output":{"wizard":1},
            "storage":{},
        }
    ],
}

    
