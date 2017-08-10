var menu = function (game) {
    var unitMenuGroup;
    var unitMenux;
    var unitMenuy;

    this.menutargeter;

    this.drawIntroMenu = function () {
    };
    this.drawUnitMenu = function (unit){
       //unit has move/attack/wait
        //alert(unit.getType());

        //get lock
        lock = true;

        unit.inMenu = true;

        unitMenux = unit.x+50;
        unitMenuy = unit.y;

        //draw targeting reticle on this unit
        this.menutargeter = game.add.sprite (unit.x,unit.y,'menutargeter');

        this.determineMenuLocation(unit);

        unitMenuGroup = game.add.group();

        waitButton = game.add.button(unitMenux, unitMenuy+100, 'wait_button', function(){
            this.unitMenuWaitClick(unit);
        }, this, 2, 1, 0);
        moveButton = game.add.button(unitMenux, unitMenuy, 'move_button', function(){
            this.unitMenuMoveClick(unit);
        }, this, 2, 1, 0);
        attackButton = game.add.button(unitMenux, unitMenuy+50, 'attack_button', function(){
            this.unitMenuMoveClick(unit);
        }, this, 2, 1, 0);

        //determine what buttons to grey out

        unitMenuGroup.add (waitButton);
        unitMenuGroup.add (moveButton);
        unitMenuGroup.add (attackButton);
    };

    this.determineMenuLocation = function (unit){
        console.log(unit.x);
        console.log(unit.y);
        if (unit.x >= 400){
            //flip menu
            unitMenux = unit.x - 100;
        }
        if (unit.y >= 650){
            unitMenuy = unit.y - 100;
        }

    };

    this.unitMenuMoveClick = function(unit){
        this.menutargeter.destroy();
        unitMenuGroup.destroy();
        unit.moveAction();
        unit.inMenu = false;
    };
    this.unitMenuAttackClick = function(unit){
        //attackaction
    };
    this.unitMenuWaitClick = function(unit){
        this.menutargeter.destroy() ;
        unitMenuGroup.destroy();
        unit.setTurnOver();
        unit.inMenu = false;
        lock = false;
    };

    this.destroyUnitMenu = function(unit){
        this.menutargeter.destroy() ;
        unit.inMenu = false;
        lock = false;
    }
};