var battle = function (game){
    this.normalAttack = function (attacker, defender){
        //attacker and defender are both unit objects
        var damage = attacker.atk - defender.def;
        this.battleAnimation (attacker, defender, damage);
        defender.hp -=10;
        defender.updateStatus();
    };

    this.battleAnimation = function (attacker, defender, damage){

    };
};