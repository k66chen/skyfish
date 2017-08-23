var enemyAI = function (unit){
    //class for controlling enemy ai
    var MoveActions = new Array ();
    var MoveToX;
    var MoveToY;
    var AttackActions = new Array ();
    //points decide whether this action is actually good
    var points = 0;

    var movepanel;

    this.count;
    this.tempgrid = new Array (10);
    for (var i =0; i< 10;i++){
        this.tempgrid[i] = new Array (16);
    }


    this.reinitiate = function () {
        MoveActions = new Array ();
        AttackActions = new Array ();
        //points decide whether this action is actually good
        points = 0;

        this.tempgrid = new Array (10);
        for (var i =0; i< 10;i++){
            this.tempgrid[i] = new Array (16);
        }
        movetween = null;
    };

    this.action = function (){

    };

    this.aiMovement = function (count){
        if (unit.spriteframe !== undefined) {
            this.count = count;
            //a dummy movepathfinder to check each move (don't draw the panels)
            movepanel = game.add.group();
            this.movePathFind(unit.x, unit.y, unit.movement, 'x', new Array(), 0);
            this.enemyAction();
        }
    };

    this.movePathFind = function (x,y,tempmv,dir,moveArray, temppoints){
        if (tempmv > 0){
            //check that this grid is not itself
            if (unit.x == x && unit.y == y){
                //stand still, attack?
                this.attackAction(x,y,temppoints);
                this.tempgrid[x/50][y/50] = 'x';
                //check up,left,right,down = skip pushing to the movearray here
                this.movePathFind(x + 50, y, tempmv, 'e', moveArray, temppoints);
                this.movePathFind(x - 50, y, tempmv, 'w', moveArray, temppoints);
                this.movePathFind(x, y - 50, tempmv, 's', moveArray, temppoints);
                this.movePathFind(x, y + 50, tempmv, 'n', moveArray, temppoints);
            }
            else if ((checkGrid(x/50,y/50))){
                //this panel is empty, add move panel here
                //check if we already have a movepanel here though
                var moveArrayCopy = new Array ();
                for (var i =0; i< moveArray.length; i++){
                    moveArrayCopy.push(moveArray[i]);
                }
                moveArrayCopy.push(dir);
                if (this.tempgrid[x/50][y/50] == undefined){
                    panel = game.add.isoSprite(x/50 * 38, y/50 * 38, 3, 'tile', 0, movepanel);
                    panel.anchor.set(0.5, 0);
                    panel.alpha = 0.3;
                    panel.tint = 0xe8694c;
                    this.tempgrid[x/50][y/50] = moveArrayCopy;
                    this.attackAction(x,y,temppoints);
                }else{
                    if (moveArrayCopy.length < this.tempgrid[x/50][y/50].length){
                        this.tempgrid[x/50][y/50] = moveArrayCopy;
                        this.attackAction(x,y,temppoints);
                    }
                }

                tempmv -=1;
                if (tempmv > 0){
                    //check up,left,right,down
                    this.movePathFind(x+50,y,tempmv,'e',moveArrayCopy, temppoints);
                    this.movePathFind(x-50,y,tempmv,'w',moveArrayCopy, temppoints);
                    this.movePathFind(x,y-50,tempmv,'s',moveArrayCopy, temppoints);
                    this.movePathFind(x,y+50,tempmv,'n',moveArrayCopy, temppoints);

                }
            }
            else{
            }
        }

    };


    this.calculateAttackPoints =function (ally){
            var attackpoints = 0;
            if ((unit.atk - ally.def) > ally.hp){
                attackpoints += 99999;
            }else{
                attackpoints += (unit.atk - ally.def)*100;
            }
            return attackpoints;
    };

    this.attackAction = function (x,y, temppoints){
        //try attacking in all directions at this x and y
        temppoints += calculateNearestAlly(x,y); // add the movement points
        var attackdir;
        if (checkGridExists(x/50 +1,y/50) && grid[x/50+1][y/50].isAlly){
            temppoints += this.calculateAttackPoints(grid[x/50+1][y/50]);
            attackdir = 'e';
        }else if (checkGridExists(x/50-1,y/50) && grid[x/50-1][y/50].isAlly){
            temppoints += this.calculateAttackPoints(grid[x/50-1][y/50]);
            attackdir = 'w';
        }else if (checkGridExists(x/50,y/50 + 1) && grid[x/50][y/50+1].isAlly){
            temppoints += this.calculateAttackPoints(grid[x/50][y/50+1]);
            attackdir = 'n';
        }else if (checkGridExists(x/50,y/50 - 1) && grid[x/50][y/50 -1].isAlly){
            temppoints += this.calculateAttackPoints(grid[x/50][y/50-1]);
            attackdir = 's';
        }else{
            attackdir = 'x';
            temppoints += 5;
        }


        if (temppoints >= points){
            points = temppoints ;
            MoveActions = this.tempgrid [x/50][y/50];
            MoveToX = x/50;
            MoveToY = y/50;
            AttackActions = attackdir;
        }

    };

    this.enemyAction = function (){
        //executes the actions in movearray
        lock = true;

        isoGroup.forEach(function (tile) {

            var inBounds = (tile.isoX/38 == MoveToX && tile.isoY/38 == MoveToY);
            //var inBounds = tile.isoBounds.containsXY(cursorPos.x, cursorPos.y);
            // If it does, do a little animation and tint change.
            if (!tile.selected && inBounds) {
                tile.selected = true;
                selectedTile = tile;
                tile.tint = 0x86bfda;
            }
            // If not, revert back to how it was.
            else if (tile.selected && !inBounds) {
                tile.selected = false;
                tile.tint = 0xffffff;
            }
        });
        this.moveTween(selectedTile);

    };

    this.moveTween = function (selectedTile){
        var tile = selectedTile
        var isoBaseSize = 32;

        var tween = game.add.tween(unit.spriteframe)
            .to(
                { isoZ: 60, isoX: (tile.isoX), isoY: (tile.isoY) },
                200,
                Phaser.Easing.Quadratic.InOut,
                false
                ,250)
        var tween2 = game.add.tween(unit.spriteframe).to(
            { isoZ: 25 },
            350,
            Phaser.Easing.Bounce.Out,
            false
        );

        tween2.onComplete.add(function (){
            //update the global grid to reflect our move
            delete grid[unit.x/50][unit.y/50];

            unit.x =  selectedTile.isoX/38*50;
            unit.y =  selectedTile.isoY/38*50;

            grid[unit.x/50][unit.y/50] = unit;

            lock = false;


            if (AttackActions == 'e'){
                battle.normalAttack(unit,grid[unit.x/50 + 1][unit.y/50], this.count);
            }else if (AttackActions == 'w'){
                battle.normalAttack(unit,grid[unit.x/50 - 1][unit.y/50], this.count);
            }else if (AttackActions == 'n'){
                battle.normalAttack(unit,grid[unit.x/50][unit.y/50 + 1], this.count);
            }else if (AttackActions == 's'){
                battle.normalAttack(unit,grid[unit.x/50][unit.y/50 - 1], this.count);
            }else{
                enemyTriggerAi(this.count +=1);
            }


            this.reinitiate();

            movepanel.destroy();
            //enemyTriggerAi(this.count +=1);
            unit.setTurnOver();
            //debugPrintGrid();
        },this);

        tween.chain(tween2);
        tween.start()
    };

   /* this.moveTween = function (moveArray){

        var units = 0;
        var initialDir = moveArray[0];
        var tweenChain = new Array ();
        var originalx = unit.x;
        var originaly = unit.y;

        for (i =0; i< moveArray.length; i++){
            if (moveArray[i] != initialDir){
                //do the move, set the initialdir to new
                if (initialDir == 'e'){
                    movetween = game.add.tween(unit.spriteframe).to({x:originalx + 50*units,y:originaly},units*150);
                    originalx += 50*units;
                }else if (initialDir == 'w'){
                    movetween = game.add.tween(unit.spriteframe).to({x:originalx - 50*units,y:originaly},units*150);
                    originalx -= 50*units;
                }else if (initialDir == 'n'){
                    movetween = game.add.tween(unit.spriteframe).to({x:originalx,y:(originaly + 50*units)},units*150);
                    originaly += 50*units;
                }else if (initialDir == 's'){
                    movetween = game.add.tween(unit.spriteframe).to({x:originalx,y:originaly - 50*units},units*150);
                    originaly -= 50*units;
                }

                tweenChain.push (movetween);

                units = 0;
                initialDir = moveArray[i];
                units +=1;
            }else{
                units +=1;
            }
        }
        if (initialDir == 'e'){
            movetween = game.add.tween(unit.spriteframe).to({x:originalx + 50*units,y:originaly},units*150);
        }else if (initialDir == 'w'){
            movetween = game.add.tween(unit.spriteframe).to({x:originalx - 50*units,y:originaly},units*150);
        }else if (initialDir == 'n'){
            movetween = game.add.tween(unit.spriteframe).to({x:originalx,y:(originaly + 50*units)},units*150);
        }else if (initialDir == 's'){
            movetween = game.add.tween(unit.spriteframe).to({x:originalx,y:originaly - 50*units},units*150);
        }else if (initialDir == 'x'){
            movetween = game.add.tween(unit.spriteframe).to({x:originalx,y:originaly}, 150);
        }

        tweenChain.push(movetween);


        for (i = 0;i<tweenChain.length;i++) {

            if (i < tweenChain.length -1){
                tweenChain[i].chain(tweenChain[i+1]);
            }
        }
        tweenChain.slice(-1)[0].onComplete.add(function (){
            console.log (MoveActions);
            console.log (AttackActions);
            //update the global grid to reflect our move
            delete grid[unit.x/50][unit.y/50];

            unit.x =  unit.spriteframe.x;
            unit.y =  unit.spriteframe.y;


            grid[unit.x/50][unit.y/50] = unit;

            lock = false;


            if (AttackActions == 'e'){
                battle.normalAttack(unit,grid[unit.x/50 + 1][unit.y/50], this.count);
            }else if (AttackActions == 'w'){
                battle.normalAttack(unit,grid[unit.x/50 - 1][unit.y/50], this.count);
            }else if (AttackActions == 'n'){
                battle.normalAttack(unit,grid[unit.x/50][unit.y/50 + 1], this.count);
            }else if (AttackActions == 's'){
                battle.normalAttack(unit,grid[unit.x/50][unit.y/50 - 1], this.count);
            }else{
                enemyTriggerAi(this.count +=1);
            }


            this.reinitiate();

            movepanel.destroy();
            //enemyTriggerAi(this.count +=1);
            unit.setTurnOver();
            //debugPrintGrid();
        },this);
        tweenChain[0].start();

        //case no move
    };*/


    calculateNearestAlly = function (x,y){
        var nearest = 9999;
        for (var i = 0;i < 10; i++){
            for (var j = 0; j < 16; j++){
                if (grid[i][j] !== undefined && grid[i][j].isAlly){
                    var distance = Math.sqrt (Math.pow((x/50 - i),2) + Math.pow((y/50 - j),2));
                    if (distance <= nearest){
                        nearest = distance;
                    }
                }
            }
        }
        return 100/nearest;
    }

};