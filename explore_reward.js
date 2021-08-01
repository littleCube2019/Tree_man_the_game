exports.explore_reward = {
    "wood":{
        reward(Env){
            Env.resource_gain["wood"] += 500
        },
    },

    "shoe":{
        reward(Env){
            Env.explorer_mobility += 3
        },
    },
}