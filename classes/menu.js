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
        this.menutargeter = game.add.sprite (unit.spriteframe.x-25,unit.spriteframe.y,'menutargeter');

        this.determineMenuLocation(unit);

        unitMenuGroup = game.add.group();

        unitMenux = unit.spriteframe.x+30;
        unitMenuy = unit.spriteframe.y;


        this.showSkillsIcons(unit);

        waitButton = game.add.button(unitMenux, unitMenuy+100, 'wait_button', function(){
            this.unitMenuWaitClick(unit);
        }, this, 2, 1, 0);
        moveButton = game.add.button(unitMenux, unitMenuy, 'move_button', function(){
            this.unitMenuMoveClick(unit);
        }, this, 2, 1, 0);
        if (unit.moved){
            moveButton.tint = 0x777777;
        }
        attackButton = game.add.button(unitMenux, unitMenuy+50, 'attack_button', function(){
            this.unitMenuAttackClick(unit);
        }, this, 2, 1, 0);
        if (unit.attacked){
            attackButton.tint = 0x777777;
        }

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
        if (!unit.moved) {
            lock = false;
            this.menutargeter.destroy();
            unitMenuGroup.destroy();
            unit.moveAction();
            unit.inMenu = false;
        }
    };
    this.unitMenuAttackClick = function(unit){
        if (!unit.attacked) {
            this.menutargeter.destroy();
            unitMenuGroup.destroy();
            unit.inMenu = false;
            battle.showAttackPanels(unit);
        }
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
        unitMenuGroup.destroy();
        unit.inMenu = false;
        lock = false;
    }

    this.showSkillsIcons = function (unit){
        //displays the skills of the unit on the bottom menu
        for (var i = 0; i< unit.skillList.length;i++){

            skillObj = unit.skillList[i];

            skillButton = game.add.button(20+i*150, 700, 'skill_icon', (function (button){
                    console.log (button.id);
                    skill = unit.skillList[button.id];
                    this.skillButtonClick(skill,unit)}
                )
                , this);
            skillButton.id = i;
            skillNameText = game.add.text(40+i*150, 730, skillObj.name, {
                font: "45px Impact",
                fill: "#5071de"
            });
            unitMenuGroup.add (skillButton);
            unitMenuGroup.add (skillNameText);
        }
    }
    this.skillButtonClick = function (skill,unit){
        this.menutargeter.destroy() ;
        unitMenuGroup.destroy();
        skill.action(unit);

        unit.inMenu = false;
        lock = false;
    }
};