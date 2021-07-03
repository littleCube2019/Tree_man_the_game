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


