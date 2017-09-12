var skill = function (game){
    //contains skill definitions that the unit class can use, contained in their skillList variable.
    this.passive; //determines whether the skill is active or passive
    this.name = 'default';
    this.icon;

    this.action;

    this.spCost = 0;
    this.hpCost = 0;

    this.bash = function (){
        //deal ATK*1.5 in damage, cause 20% chance to inflict extra ATK*0.5 in damage.
        this.passive = false;
        this.name = "Bash";
        this.spCost = 20;

        this.action = function (unit){
            console.log("bash!");
            function bashCustom (attacker,defender){
                if (attacker !== undefined && defender !== undefined) {
                    //attacker and defender are both unit objects
                    var damage = attacker.atk*2.5 - defender.def;
                    if (damage < 0){ damage = 0};
                    defender.updateStatus();
                    battle.battleAnimation(attacker, defender, damage);
                    defender.hp -= damage;
                    //alert(defender.hp);
                    defender.updateStatus();
                }
            }
            console.log (bashCustom);
            if (unit.sp > 20) {
                unit.sp =-20;
                battle.showAttackPanels(unit, bashCustom);
            }else{
                console.log ('not enough sp');
            }
        }
    },

    this.recover = function (){
        //recover MAXHP/10 in HP
        this.passive = false;
        this.name = "Recvr";
        this.spCost = 20;

        this.action = function (unit){
            console.log("a recovery!");
            heal = unit.maxhp*0.1;
            unit.hp=+heal;
            function showRecoverAnimation (){
                defender = unit;
                var healtext = game.add.text(defender.spriteframe.x-15, defender.spriteframe.y, '+' + heal, {
                    font: "30px Impact",
                    fill: "#00ff23"
                });
                texttween = game.add.tween(healtext).to({x:defender.spriteframe.x-15,y:defender.spriteframe.y -30},400,Phaser.Easing.Quadratic.InOut, false);
                texttween.onComplete.add(function (){
                    healtext.destroy();
                },this);
                texttween.start();
            }
            showRecoverAnimation();
        }
    }
};