var menu = function (game) {
    var unitMenuGroup;
    var unitMenux;
    var unitMenuy;
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

        this.determineMenuLocation(unit);

        unitMenuGroup = game.add.group();

        waitButton = game.add.button(unitMenux, unitMenuy, 'button', function(){
            this.unitMenuWaitClick(unit);
        }, this, 2, 1, 0);
        moveButton = game.add.button(unitMenux, unitMenuy+70, 'button', function(){
            this.unitMenuMoveClick(unit);
        }, this, 2, 1, 0);

        unitMenuGroup.add (waitButton);
        unitMenuGroup.add (moveButton);
    };

    this.determineMenuLocation = function (unit){
        console.log(unit.x);
        console.log(unit.y);
        if (unit.x >= 400){
            //flip menu
            unitMenux = unit.x - 200;
        }
        if (unit.y >= 650){
            unitMenuy = unit.y - 100;
        }

    };

    this.unitMenuMoveClick = function(unit){
        unitMenuGroup.destroy();
        unit.moveAction();
        unit.inMenu = false;
        lock = false;
    };
    this.unitMenuAttackClick = function(unit){
        //attackaction
    };
    this.unitMenuWaitClick = function(unit){
        unitMenuGroup.destroy();
        unit.setTurnOver();
        unit.inMenu = false;
        lock = false;
    };
};