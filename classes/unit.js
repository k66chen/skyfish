//handles syntax for a generic unit on the field
var unit = function (game){
    this.spriteframe;
    this.name;
    this.hp;
    this.sp;
    this.movement;

    //x and y coordinates in the grid (multiplied by 50) 10x16
    this.x;
    this.y;

    this.infotext;
    this.infoswitch = false;
    this.movedone = true;

    //movepanel = game.add.group();
    this.tempmovepanel;
    this.tempgrid;

    this.inMenu = false;
    this.hasTurn = true;

    //turn control variables
    // turn is over after 1 move and 1 attack action, or on 'wait' action
    this.moved = false;
    this.attacked = false;

    this.isEnemy = false;
    this.isAlly = true;

    this.getType = function (){
        return "unit";
    };

    //disables movement controls for this unit, turn on AI

    this.create = function (name,sprite, hp, sp, movement,x,y, enemy){
        //constructor for a generic unit sprite
        this.name = name;
        this.hp = hp;
        this.sp = sp;
        this.movement = movement;

        this.x = x*50;
        this.y = y*50;
        if (enemy == 1){
            this.isEnemy = true;
            this.isAlly = false;
        }
        //draw the enemy tile under

        this.spriteframe = game.add.sprite (this.x,this.y,sprite);
        game.physics.arcade.enable (this.spriteframe);
        //this.spriteframe.body.gravity.y = 300;
        //this.spriteframe.collideWorldBounds = true;


        //create on click functions
        if (!this.isEnemy) {
            this.spriteframe.inputEnabled = true;
            this.spriteframe.events.onInputDown.add(this.click, this);
        }else{
            this.spriteframe.inputEnabled = true;
            this.spriteframe.events.onInputDown.add(this.enemyClick, this);
            this.spriteframe.tint = 0xff644f;
        }
        this.spriteframe.body.moves = false;
        //update global grid object
        grid[x][y] = this;
    };

    this.showMenu = function (){
        //set marker here to reverse gamestate.
        menu.drawUnitMenu(this);
    };

    this.moveAction = function (){
        //this.infotext = game.add.text (this.x+50,this.y+10,this.name + " Hp: "+this.hp + " Mv: " + this.movement);
        //this.infotext.fill = "#ff0044";
        this.infoswitch = true;
        if (movepanel != undefined){
            //remove move panels on other units
        }
        this.setTempGrid ();

        movepanel = game.add.group();
        this.moveArray = new Array();
        this.movePathFind (this.x,this.y,this.movement,'x',new Array());
        movepanel.setAll ('inputEnabled',true);
        movepanel.setAll ('alpha',0.3);
        movepanel.callAll ('events.onInputDown.add','events.onInputDown',this.move,this);

    };

    this.setTempGrid = function (){
        this.tempgrid = new Array (10);
        for (var i =0; i< 10;i++){
            this.tempgrid[i] = new Array (16);
        }
    };
    this.click = function (){
        //on click any unit
        if (this.movedone && this.hasTurn && !this.inMenu && !lock){
            if (!this.infoswitch){
                this.showMenu();
            }else{
                //this.infotext.destroy();
                movepanel.destroy();
                this.infoswitch = false;
            }
        }
    };

    this.enemyClick = function (){

    };

    this.movePathFind = function (x,y,tempmv,dir,moveArray){
        //recursively check squares around the user until move is 0
        //TODO: also save the path for that panel for future moves


        //check this x,y
        if (tempmv > 0){
            //check that this grid is not itself
            if (this.x == x && this.y == y){
                //check up,left,right,down = skip pushing to the movearray here
                this.movePathFind(x+50,y,tempmv,'e',moveArray);
                this.movePathFind(x-50,y,tempmv,'w',moveArray);
                this.movePathFind(x,y-50,tempmv,'s',moveArray);
                this.movePathFind(x,y+50,tempmv,'n',moveArray);

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
                    movepanel.create (x,y,'trans');
                    //save how we got to this panel onto the tempgrid
                    this.tempgrid[x/50][y/50] = moveArrayCopy;
                }else{
                    if (moveArrayCopy.length < this.tempgrid[x/50][y/50].length){
                        this.tempgrid[x/50][y/50] = moveArrayCopy;
                    }
                }

                tempmv -=1;
                if (tempmv > 0){
                    //check up,left,right,down
                    this.movePathFind(x+50,y,tempmv,'e',moveArrayCopy);
                    this.movePathFind(x-50,y,tempmv,'w',moveArrayCopy);
                    this.movePathFind(x,y-50,tempmv,'s',moveArrayCopy);
                    this.movePathFind(x,y+50,tempmv,'n',moveArrayCopy);

                }
            }
            else{
            }
        }

    };

    movepanelInputAdd =function (){
        movepanel.inputEnabled = true;
        movepanel.alpha = 0.2;
        //   movepanel.events.onInputDown.add(this.move,self);

    };


    this.move = function (event){
        //move the player depending on which movepanel was picked (panel in mouse event)
        event.alpha = 0.5;
        //game.add.text (0,0,"x:"+event.x+"y:"+event.y);
        //   this.spriteframe.body.velocity.x= 150;
        this.infoswitch = false;
        //destroy the old element in grid
        //determine destination x and destination y
        var destx = event.x /50;
        var desty = event.y /50;
        //var testtext = game.add.text (0,0,"x:"+this.spriteframe.x+"dx:"+destx);
        console.log (this.tempgrid[destx][desty])
        var pathMoveArray = this.tempgrid[destx][desty];

        //game.physics.arcade.moveToXY (this.spriteframe,event.x,this.spriteframe.y,50,500); 
        this.spriteframe.body.moves = false;

        this.tempmovepanel = game.add.sprite (event.x,event.y,'trans');
        this.tempmovepanel.alpha = 0.5;

        this.movedone = false;

        this.moveTween(pathMoveArray);
        //do x tween then y tween
        /*movetween = game.add.tween(this.spriteframe).to({x:event.x,y:event.y},600);
        //x tween complete, add y tween

        movetween.onComplete.add(function (){
            this.movedone = true;
            this.tempmovepanel.destroy();
            this.updateGrid ();
        },this);
        movetween.start();*/
        //movetweeny = game.add.tween(this.spriteframe).to({x:this.spriteframe.x,y:event.y},600);
        //movetweeny.start();

        movepanel.destroy();


    };

    //takes the movement array and moves accordingly
    //saves movetweens and chains them depending on the direction
    this.moveTween = function (moveArray){
        var units = 0;
        var initialDir = moveArray[0];
        var tweenChain = new Array ();
        var originalx = this.x;
        var originaly = this.y;

        for (i =0; i< moveArray.length; i++){
            console.log(i);
            if (moveArray[i] != initialDir){
                //do the move, set the initialdir to new
                if (initialDir == 'e'){
                    movetween = game.add.tween(this.spriteframe).to({x:originalx + 50*units,y:originaly},units*150);
                    originalx += 50*units;
                }else if (initialDir == 'w'){
                    movetween = game.add.tween(this.spriteframe).to({x:originalx - 50*units,y:originaly},units*150);
                    originalx -= 50*units;
                }else if (initialDir == 'n'){
                    movetween = game.add.tween(this.spriteframe).to({x:originalx,y:originaly + 50*units},units*150);
                    originaly += 50*units;
                }else if (initialDir == 's'){
                    movetween = game.add.tween(this.spriteframe).to({x:originalx,y:originaly - 50*units},units*150);
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
        console.log ("End tween is " + initialDir + " units:" + units);
        if (initialDir == 'e'){
            movetween = game.add.tween(this.spriteframe).to({x:originalx + 50*units,y:originaly},units*150);
        }else if (initialDir == 'w'){
            movetween = game.add.tween(this.spriteframe).to({x:originalx - 50*units,y:originaly},units*150);
        }else if (initialDir == 'n'){
            movetween = game.add.tween(this.spriteframe).to({x:originalx,y:originaly + 50*units},units*150);
        }else if (initialDir == 's'){
            movetween = game.add.tween(this.spriteframe).to({x:originalx,y:originaly - 50*units},units*150);
        }
        tweenChain.push(movetween);
        console.log(tweenChain);

        for (i = 0;i<tweenChain.length;i++) {

            if (i < tweenChain.length -1){
                tweenChain[i].chain(tweenChain[i+1]);
                tweenChain[i].onComplete.add(function (){
                },this);
            }
        }
        tweenChain.slice(-1)[0].onComplete.add(function (){
            this.movedone = true;
            this.tempmovepanel.destroy();
            this.updateGrid ();
            lock = false;
            this.moved = true;
            menu.drawUnitMenu (this);
            //move action is done
        },this);

        tweenChain[0].start();
    };

    this.updateGrid = function(){
        //update the global grid to reflect our move
        delete grid[this.x/50][this.y/50];
        this.x = this.spriteframe.x;
        this.y = this.spriteframe.y;
        grid[this.x/50][this.y/50] = this;

    };

    this.updateStatus = function(){
       //update the status of this unit, if HP is 0 it is dead
        if (this.hp <=0 ) {
            //we need to destroy this from our enemies/allies array too
            if (this.isEnemy){

            }else{
                var index = allies.indexOf (this);
                console.log ("wew: " + index);
                allies.splice (index, 1);
            }
            this.spriteframe.destroy();
            grid[this.x/50][this.y/50] = undefined;
            console.log (allies);
            console.log(enemies);
        }
    };

    this.setTurnOver = function (){
        this.hasTurn = false;
        if (this.isEnemy){
            this.spriteframe.tint = 0x702e2e;
            checkEnemyTurnOver();
        }else{
            this.spriteframe.tint = 0x777777;
            checkAllyTurnOver();
        }

    };

    this.refreshTurn = function (){
        this.hasTurn = true;
        this.attacked = false;
        this.moved = false;
        if (this.isEnemy){
            this.spriteframe.tint = 0xff644f;
        }else {
            this.spriteframe.tint = 0xFFFFFF;
        }
    };
};
