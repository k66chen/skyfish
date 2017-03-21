//creates canvas and calls the various game states
//
//
//
var global = "scope test";
var grid = []; //this is the 2d array that holds all the map data! (10x16)

//since there can only be one movepanel at a time, decare it here
var movepanel;

var pausing = false; //if true, disables input until it's false


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
        game.load.image('block','assets/block.png');
        game.load.image('ball','assets/sprites/balls.png');
        game.load.image('dude','assets/dude.png');
        game.load.image('plat','assets/kan.png');
        game.load.image('goblin','assets/gob.png');
        game.load.image('trans','assets/transparent_tile.png');
    }

    this.create =  function () {

        //create our grid that spans the 500x800 (10cellsx14cells)
        grid = new Array (10);        
        for (var i = 0;i < 10; i++){
            grid[i] = new Array(16);
        }
         
        game.physics.startSystem(Phaser.Physics.BOX2D);
        game.stage.backgroundColor = '#2d2d2d';

        game.add.sprite (0,0,'sky');

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

        var player = new unit(game); 
        var enemy = new unit(game);
        player.create('Platinum','plat',50,50,3,3,5);
        grid[3][5] = player;
        enemy.create('Goblin','goblin',50,50,2,1,3);
        grid[1][3] = enemy;

        block.inputEnabled = true;
        var text;
        //set up mouse controls
        block.events.onInputDown.add (function (){
            text = game.add.text (5,5,"clicked" + player.getType());
        })
        block.events.onInputUp.add (function (){
            text.destroy();
        })




    }

    this.update = function(){
    }

    this.render = function (){
    }

}
