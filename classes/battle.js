var battle = function (game){

    this.showAttackPanels = function(unit){

        //assume range is 1 for now
        attackpanel = game.add.group();

        attackpanel.create (unit.x+50,unit.y,'attack');
        attackpanel.create (unit.x-50,unit.y,'attack');
        attackpanel.create (unit.x,unit.y+50,'attack');
        attackpanel.create (unit.x,unit.y-50,'attack');

        attackpanel.alpha = 0.4;
        attackpanel.setAll ('inputEnabled',true);
        attackpanel.callAll ('events.onInputDown.add','events.onInputDown',function (event){this.attackPanelClick(event,unit)},this);
    };

    this.attackPanelClick = function (event,unit){

        if (!checkGrid(event.x/50,event.y/50 )){
            if (grid[event.x/50][event.y/50].isEnemy){
                this.normalAttack(unit,grid[event.x/50][event.y/50]);
                attackpanel.destroy();
            }
        }
        lock = false;
    };
    this.normalAttack = function (attacker, defender, count){
        if (attacker !== undefined && defender !== undefined) {
            //attacker and defender are both unit objects
            var damage = attacker.atk - defender.def;
            if (damage < 0){ damage = 0};
            defender.updateStatus();
            this.battleAnimation(attacker, defender, damage, count);
            defender.hp -= damage;
            //alert(defender.hp);
            defender.updateStatus();
            attacker.attacked = true;
        }
    };

    this.battleAnimation = function (attacker, defender, damage, count){
        console.log ('mm?');
        //tween halfway towards the defending unit

        oldX = attacker.spriteframe.isoX;
        oldY = attacker.spriteframe.isoY;

        atktween = game.add.tween(attacker.spriteframe)
            .to(
                { isoZ: attacker.spriteframe.isoZ, isoX: (defender.spriteframe.isoX), isoY: (defender.spriteframe.isoY) },
                120,
                Phaser.Easing.Quadratic.InOut,
                false
        ,250);

        atktweenback = game.add.tween(attacker.spriteframe)
            .to(
                { isoZ: attacker.spriteframe.isoZ, isoX: (oldX), isoY: (oldY) },
                120,
                Phaser.Easing.Quadratic.InOut,
                false
            );


        atktween.chain(atktweenback);

        atktween.onComplete.add(function (){
            var battletext = game.add.text(defender.spriteframe.x + 5, defender.spriteframe.y, '-' + damage, {
                font: "30px Impact",
                fill: "#ff3400"
            });
            texttween = game.add.tween(battletext).to({x:defender.spriteframe.x+5,y:defender.spriteframe.y + 30},400);
            texttween.onComplete.add(function (){
                battletext.destroy();
            },this);
            texttween.start();
        },this);
        atktweenback.onComplete.add(function (){

            if (count !== undefined){
                enemyTriggerAi(count +=1);
            }
        },this);
        atktween.start();
    };
};