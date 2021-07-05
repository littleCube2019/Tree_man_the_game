/*
class treeMan{
    constructor(treeMan_id){
        this.id = treeMan_id;
        this.hp = 250;
        this.atk = 600;
        this.atk_range = 0;
        this.move_distance = 0;
        this.reward = 2000;
    }
}

class bigTreeMan{
    constructor(bigTreeMan_id){
        this.id = bigTreeMan_id;
        this.hp = 500;
        this.atk = 3000;
        this.atk_range = 0;
        this.move_distance = 0;
        this.reward = 10000;
    }
}
*/
class enemy{
    constructor(hp, attack, attack_range, move_distance, reward){
        this.hp = hp;
        this.attack = attack;
        this.attack_range = attack_range;
        this.move_distance = move_distance;
        this.reward = reward;
    }
}

module.exports.treeMan = new enemy(250, 600, 1, 1, 2000);
module.exports.bigTreeMan = new enemy(500, 3000, 1, 1, 10000);