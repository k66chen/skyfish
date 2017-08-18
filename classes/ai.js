var enemyAI = function (unit){
    //class for controlling enemy ai
    var MoveActions = new Array ();
    var AttackActions = new Array ();
    //points decide whether this action is actually good
    var points = 0;

    this.count;
    this.tempgrid = new Array (10);
    for (var i =0; i< 10;i++){
        this.tempgrid[i] = new Array (16);
    }

    this.action = function (){

    };

    this.aiMovement = function (count){
        this.count = count;
        //a dummy movepathfinder to check each move (don't draw the panels)
        this.movePathFind(unit.x,unit.y,unit.movement, 'x',  new Array(), 0);

        this.enemyAction();
    };

    this.movePathFind = function (x,y,tempmv,dir,moveArray, temppoints){
        if (tempmv > 0){
            //check that this grid is not itself
            if (unit.x == x && unit.y == y){
                //check up,left,right,down = skip pushing to the movearray here
                this.movePathFind(x+50,y,tempmv,'e',moveArray, temppoints);
                this.movePathFind(x-50,y,tempmv,'w',moveArray, temppoints);
                this.movePathFind(x,y-50,tempmv,'s',moveArray, temppoints);
                this.movePathFind(x,y+50,tempmv,'n',moveArray, temppoints);

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

    this.attackAction = function (x,y, temppoints){
        //try attacking in all directions at this x and y
        temppoints += calculateNearestAlly(x,y); // add the movement points
        var attackdir;
        if (checkGridExists(x/50 +1,y/50) && grid[x/50+1][y/50].isAlly){
            attackdir = 'e';
            temppoints += 500;
        }else if (checkGridExists(x/50-1,y/50) && grid[x/50-1][y/50].isAlly){
           attackdir = 'w';
            temppoints += 500;
        }else if (checkGridExists(x/50,y/50 + 1) && grid[x/50][y/50+1].isAlly){
            attackdir = 'n';
            temppoints += 500;
        }else if (checkGridExists(x/50,y/50 - 1) && grid[x/50][y/50 -1].isAlly){
            attackdir = 's';
            temppoints += 500;
        }else{
            attackdir = 'x';
            temppoints += 5;
        }


        if (temppoints >= points){
            points = temppoints ;
            MoveActions = this.tempgrid [x/50][y/50];
            AttackActions = attackdir;
        }

    };

    this.enemyAction = function (){
        //executes the actions in movearray
        lock = true;

        this.moveTween(MoveActions);

    };


    this.moveTween = function (moveArray){

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
        }

        tweenChain.push(movetween);


        for (i = 0;i<tweenChain.length;i++) {

            if (i < tweenChain.length -1){
                tweenChain[i].chain(tweenChain[i+1]);
            }
        }
        tweenChain.slice(-1)[0].onComplete.add(function (){
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

            //enemyTriggerAi(this.count +=1);
            unit.setTurnOver();
        },this);
        //trigger next ai
        tweenChain[0].start();
    };


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