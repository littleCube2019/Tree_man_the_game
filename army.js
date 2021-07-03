class archer{
    constructor(archer_id){
        this.id = archer_id;
        this.hp = 1;
        this.atk = 100;
        this.atk_range = 3;
        this.move_distance = 0;
    }
}

class armor{
    constructor(armor_id){
        this.id = armor_id;
        this.hp = 1000;
        this.atk = 50;
        this.atk_range = 0;
        this.move_distance = 1;
    }
}

class ranger{
    constructor(ranger_id){
        this.id = ranger_id;
        this.hp = 1;
        this.atk = 100;
        this.atk_range = 0;
        this.move_distance = 3;
    }
}

class troop{
    constructor(type, hp, attack, attack_range, move_distance){
        this.type = type;
        this.hp = hp;
        this.attack = attack;
        this.attack_range = attack_range;
        this.move_distance = move_distance;
    }
}