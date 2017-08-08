var menu = function (game) {
    this.drawIntroMenu = function () {
    };
    this.drawUnitMenu = function (unit){
       //unit has move/attack/wait
        //alert(unit.getType());
        button = game.add.button(unit.x+50, unit.y, 'button', function(){
            this.unitMenuWaitClick(unit);
        }, this, 2, 1, 0);
    };

    this.unitMenuMoveClick = function(unit){
        unit.moveAction;
    };
    this.unitMenuAttackClick = function(unit){

    };
    this.unitMenuWaitClick = function(unit){
        console.log(unit);
        unit.setTurnOver;
    };
};