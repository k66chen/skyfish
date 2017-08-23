var battle = function (game){

    this.showAttackPanels = function(unit){

        //assume range is 1 for now
        attackpanel = undefined;
        attackpanel = game.add.group();

/*        attackpanel.create (unit.x+50,unit.y,'attack');
        attackpanel.create (unit.x-50,unit.y,'attack');
        attackpanel.create (unit.x,unit.y+50,'attack');
        attackpanel.create (unit.x,unit.y-50,'attack');*/

        panel = game.add.isoSprite(unit.x/50 * tileWidth + tileWidth, unit.y/50 * tileWidth, 3, 'tile', 0, attackpanel);
        panel.anchor.set(0.5, 0);
        panel.alpha = 0.3;
        panel.tint = 0xffaabe;

        panel = game.add.isoSprite(unit.x/50 * tileWidth - tileWidth, unit.y/50 * tileWidth, 3, 'tile', 0, attackpanel);
        panel.anchor.set(0.5, 0);
        panel.alpha = 0.3;
        panel.tint = 0xffaabe;

        panel = game.add.isoSprite(unit.x/50 * tileWidth, unit.y/50 * tileWidth + tileWidth, 3, 'tile', 0, attackpanel);
        panel.anchor.set(0.5, 0);
        panel.alpha = 0.3;
        panel.tint = 0xffaabe;

        panel = game.add.isoSprite(unit.x/50 * tileWidth, unit.y/50 * tileWidth - tileWidth, 3, 'tile', 0, attackpanel);
        panel.anchor.set(0.5, 0);
        panel.alpha = 0.3;
        panel.tint = 0xffaabe;

        attackpanel.setAll ('inputEnabled',true);
        attackpanel.callAll ('events.onInputDown.add','events.onInputDown',function (event){this.attackPanelClick(event,unit)},this);
    };

    this.attackPanelClick = function (event,unit){
        game.iso.unproject(game.input.activePointer.position, cursorPos);
        attackpanel.forEach(function (tile) {
            var inBounds = tile.isoBounds.containsXY(cursorPos.x, cursorPos.y);
            // If it does, do a little animation and tint change.
            if (!tile.selected && inBounds) {
                tile.selected = true;
                selectedTile = tile;
            }
            // If not, revert back to how it was.
            else if (tile.selected && !inBounds) {
                tile.selected = false;
            }
        });

        event.x = selectedTile.isoX;
        event.y = selectedTile.isoY;

        if (!checkGrid(event.x/tileWidth,event.y/tileWidth)){
            if (grid[event.x/tileWidth][event.y/tileWidth].isEnemy){
                this.normalAttack(unit,grid[event.x/tileWidth][event.y/tileWidth]);
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
            var battletext = game.add.text(defender.spriteframe.x, defender.spriteframe.y, '-' + damage, {
                font: "30px Impact",
                fill: "#ff3400"
            });
            texttween = game.add.tween(battletext).to({x:defender.spriteframe.x,y:defender.spriteframe.y + 30},400,Phaser.Easing.Quadratic.InOut, false);
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