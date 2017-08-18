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
        //attacker and defender are both unit objects
        var damage = attacker.atk - defender.def;
        this.battleAnimation (attacker, defender, 30, count);
        defender.hp -=30;
        //alert(defender.hp);
        console.log(defender.hp);
        defender.updateStatus();
        attacker.attacked = true;
    };

    this.battleAnimation = function (attacker, defender, damage, count){
        //tween halfway towards the defending unit
        atktween = game.add.tween(attacker.spriteframe).to({x:defender.x,y:defender.y},150);
        atktweenback = game.add.tween(attacker.spriteframe).to({x:attacker.x,y:attacker.y},200);

        atktween.chain(atktweenback);
        atktween.start();


        var battletext = game.add.text (defender.x, defender.y, '-' + damage, {
            font: "30px Impact",
            fill: "#ec0003"
        });

        texttween = game.add.tween(battletext).to({x:defender.x,y:defender.y + 30},400);

        texttween.onComplete.add(function (){
            battletext.destroy();
            if (count !== undefined){
                enemyTriggerAi(count +=1);
            }
        },this);
        texttween.start();
    };
};