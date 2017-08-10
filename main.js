//creates canvas and calls the various game states
//
//
//
var global = "scope test";
var grid = []; //this is the 2d array that holds all the map data! (10x16)

//our battle class handles interactions between units
var battle;

//since there can only be one movepanel at a time, decare it here
var movepanel;

//global lock
var lock = false;
var pausing = false; //if true, disables input until it's false

//generic menu object handles our unit options and title screen
var menu;

//ally and enemy arrays determine the turn pacing
var allies = [];
var enemies = [];

var check = true;
var turn = 0;

window.onload = function (){
    game = new Phaser.Game (500,800,Phaser.CANVAS,'gameContainer');

    game.state.add ("Game", gameState); 

    game.state.start("Game",true,false);
}
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

        //console.log(grid[x][y].getType());
    }
}
var gameState = function (game){

    this.preload = function (){
        game.load.image('sky','assets/grass.png');
        game.load.image ("lbot",'assets/box_small.png');
        game.load.image('block','assets/block.png');
        game.load.image('ball','assets/sprites/balls.png');
        game.load.image('dude','assets/dude.png');
        game.load.image('plat','assets/kan.png');
        game.load.image('goblin','assets/gob.png');
        game.load.image('trans','assets/transparent_tile.png');
        game.load.image('enemy','assets/enemy_tile.png');
        game.load.image('menutargeter','assets/target.png');
        game.load.spritesheet('button', 'assets/button_sprite_sheet.png', 193, 71);
        game.load.spritesheet('wait_button', 'assets/unit_wait_button.png', 100, 50);
        game.load.spritesheet('move_button', 'assets/unit_move_button.png', 100, 50);
        game.load.spritesheet('attack_button', 'assets/unit_attack_button.png', 100, 50);
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

        game.add.sprite (0,0,'sky');

        //ledges
        game.add.sprite(0,600,'lbot');
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
        grid[7][9] = block;


        var player = new unit(game);
        var player2 = new unit(game);
        var enemy = new unit(game);
        var enemy2 = new unit(game);
        var enemy3 = new unit(game);
        //unit object (HP,sp,MOVE,x,y,enemy?)
        player.create('Platinum','plat',50,50,8,8,12,0);
        player2.create('Platinum','plat',50,50,8,3,12,0);
        enemy.create('Gobli1','goblin',50,50,2,1,3,1);
        enemy2.create('Goblin2','goblin',50,50,1,2,5,1);
        enemy3.create('Goblin3','goblin',50,50,2,2,3,1);

        ai = new enemyAI(enemy);

        enemy.setTurnOver();
        enemy2.setTurnOver();
        enemy3.setTurnOver();
        enemies.push(enemy);
        enemies.push(enemy2);
        enemies.push(enemy3);
        allies.push(player);
        allies.push(player2);
    }

    this.update = function(){
        for (var i =0;i<allies.length;i++){
            if (allies[i].hasTurn){
                check = false;
                break;
            }
        }
        for (var i =0;i<enemies.length;i++){
            if (enemies[i].hasTurn){
                break;
            }
        }
        if (check){
            turn+=1;
            console.log("turn" + turn);
            for (var i =0;i<allies.length;i++){
                allies[i].refreshTurn();
            }
            for (var i =0;i<enemies.length;i++){
                enemies[i].refreshTurn();
            }
        }
        check = true;
    }

    this.render = function (){
    }

}
