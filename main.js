//creates canvas and calls the various game states
var game = new Phaser.Game(1200, 1000, Phaser.AUTO, 'phaser-canvas', null, true, false);

var BasicGame = function (game) { };

BasicGame.Boot = function (game) { };

var isoGroup, cursorPos, cursor;

//
//
//
var global = "scope test";
var grid = []; //this is the 2d array that holds all the map data! (10x16)


//our battle class handles interactions between units
var battle;

//since there can only be one movepanel at a time, decare it here
var movepanel;
var attackpanel;

//global lock
var lock = false;
var pausing = false; //if true, disables input until it's false

//generic menu object handles our unit options and title screen
var menu;

//ally and enemy arrays determine the turn pacing
var allies = [];
var enemies = [];
var enemeyAi = [];


var allyTurn = false;
var enemyTurn = false;
var turn = 0;

function checkGrid (x,y){
    //check if these x and y are out of bounds
    if (x < 0 || x > 9 || y < 0 || y > 15){
        return false;
    }
    //console.log (x + "," + y);

    if (grid[x][y] === undefined){
        //console.log(grid[x][y].getType());
        return true;
    }else{
        return false;
        //console.log(grid[x][y].getType());
    }
}

function checkGridExists (x,y){
    //check if these x and y are out of bounds
    if (x < 0 || x > 9 || y < 0 || y > 15){
        return false;
    }
    //console.log (x + "," + y);

    if (grid[x][y] !== undefined){
        //console.log(grid[x][y].getType());
        return true;
    }else{

        //console.log(grid[x][y].getType());
    }
}

function debugPrintGrid (){
    document.write('===================') ;
    document.write('\n');
    for (var i = 0;i < 16; i++){
        document.write('\n');
        for (var j = 0; j < 10; j++){
            if (grid[j][i] === undefined){
                document.write ('X')
            }else{
                document.write('O')
            }
        }
    }
    console.log (grid);
}

checkEnemyTurnOver = function (){
    for (var i =0;i<enemies.length;i++){
        if (enemies[i].hasTurn){
            return;
        }
    }
    enemyTurn = false;
    allyTurn = true;
    turn+=1;
    console.log("turn" + turn);
    for (var i =0;i<allies.length;i++){
        allies[i].refreshTurn();
    }
};


enemyTriggerAi = function (count){
    console.log ("triggering ai count: " + count)
    if (count < enemeyAi.length) {
        enemeyAi[count].aiMovement(count);
    }
}
checkAllyTurnOver = function (){
    for (var i =0;i<allies.length;i++){
        if (allies[i].hasTurn){
            return;
        }
    }

    enemyTurn = true;
    allyTurn = false;

    turn+=1;

    for (var i =0;i<enemies.length;i++){
        enemies[i].refreshTurn();
    }
    enemyTriggerAi(0);
};
var gameState = function (game){

    this.preload = function (){
        game.plugins.add(new Phaser.Plugin.Isometric(game));
        cursorPos = new Phaser.Plugin.Isometric.Point3();
        game.iso.anchor.setTo (0.5,0.2);


        game.load.image('grass','assets/grass.png');
        game.load.image ("lbot",'assets/box_small.png');
        game.load.image('block','assets/block.png');
        game.load.image('ball','assets/sprites/balls.png');
        game.load.image('dude','assets/dude.png');
        game.load.image('plat','assets/kan.png');
        game.load.image('goblin','assets/gob.png');
        game.load.image('trans','assets/transparent_tile.png');
        game.load.image('attack','assets/enemy_tile.png');
        game.load.image('menutargeter','assets/target.png');
        game.load.spritesheet('button', 'assets/button_sprite_sheet.png', 193, 71);
        game.load.spritesheet('wait_button', 'assets/unit_wait_button.png', 100, 50);
        game.load.spritesheet('move_button', 'assets/unit_move_button.png', 100, 50);
        game.load.spritesheet('attack_button', 'assets/unit_attack_button.png', 100, 50);
        game.load.image('tile', 'assets/tile.png');
        game.load.bitmapFont('nokia','assets/fonts/nokia.png','assets/fonts/nokia.xml')
    }


    this.create =  function () {

        //create our grid that spans the 500x800 (10cellsx14cells)
        grid = new Array (10);
        for (var i = 0;i < 10; i++){
            grid[i] = new Array(16);
        }

        //create our battle object
        battle = new battle (game);

        menu = new menu (game);
        game.physics.startSystem(Phaser.Physics.BOX2D);
        game.stage.backgroundColor = '#2d2d2d';

        //game.add.sprite(0,0,'grass');


        isoGroup = game.add.group();
        this.spawnTiles();

        //***********************************ADD STAGE*****************
        //ledges
      /*  game.add.sprite(0,600,'lbot');
        game.add.sprite(50,600,'lbot');
        game.add.sprite(100,600,'lbot');
        game.add.sprite(400,450,'lbot');
        game.add.sprite(450,450,'lbot');
        game.add.sprite(350,450,'lbot');

        var block = game.add.sprite(150,150, 'block');
        grid[3][3] = block;
        grid[3][4] = block;
        grid[4][3] = block;
        grid[4][4] = block;
        var block = game.add.sprite(300,500, 'block');
        grid[6][10] = block;
        grid[6][11] = block;
        grid[7][10] = block;
        grid[7][11] = block;
        //3,3 3,4, 4,3, 4,4 are blocked
        grid[0][12] = block;
        grid[1][12] = block;
        grid[2][12] = block;
        grid[9][9] = block;
        grid[8][9] = block;
        grid[7][9] = block;*/


        var player = new unit(game);
        var player2 = new unit(game);
        var enemy = new unit(game);
        var enemy2 = new unit(game);
        var enemy3 = new unit(game);
        //unit object (HP,sp,MOVE,x,y,enemy?)
        player.create('Platinum','plat',50,50,8,1,1,0, 30, 15);
        player2.create('Platinum','plat',50,50,8,2,2,0, 25, 5);
        enemy.create('Gobli1','goblin',50,50,2,1,3,1, 15, 5);
        enemy2.create('Goblin2','goblin',50,50,3,2,5,1, 12, 5);
        enemy3.create('Goblin3','goblin',50,50,2,2,3,1, 12, 5);



        enemies.push(enemy);
        enemies.push(enemy2);
        enemies.push(enemy3);
        allies.push(player);
        allies.push(player2);

        ai = new enemyAI(enemy);
        ai2 = new enemyAI(enemy2);
        ai3 = new enemyAI(enemy3);


        enemeyAi.push (ai);
        enemeyAi.push (ai2);
        enemeyAi.push (ai3);
        //*****END*********************************************************************
        // Create a group for our tiles.

        // Let's make a load of tiles on a grid.

    };

    this.update = function(){

    };

    this.spawnTiles = function () {
        var tile;
        for (var i = 0; i < 10; i += 1) {
            for (var j = 0; j < 16; j += 1) {
                // Create a tile using the new game.add.isoSprite factory method at the specified position.
                // The last parameter is the group you want to add it to (just like game.add.sprite)
                x = i * 38;
                y = j * 38;

                isoX = x - y;
                isoY = (x + y)/2;
                //tile = game.add.sprite (isoX, isoY, 'tile', isoGroup);
                tile = game.add.isoSprite(x, y, 0, 'tile', 0, isoGroup);
                tile.anchor.set(0.5, 0);
            }
        }

        //block = game.add.isoSprite(190, 228, -10, 'plat', 0, isoGroup);
        //block.anchor.set (0.5,0);
        //block.tint = 0x702e2e;
        //block.alpha = 0.5;
    };

    this.render = function (){
    };

};


game.state.add ("Game", gameState);
game.state.start("Game",true,false);
