//creates canvas and calls the various game states
//
//
//

window.onload = function (){
    game = new Phaser.Game (500,800,Phaser.CANVAS,'gameContainer');

    game.state.add ("Game", gameState); 

    game.state.start("Game",true,false);

     
}

var gameState = function (game){

    this.preload = function (){
        game.load.image('sky','assets/grass.png');
        game.load.image('block','assets/block.png');
        game.load.image('ball','assets/sprites/balls.png');
        game.load.image('dude','assets/dude.png');
        game.load.image('plat','assets/kan.png');
        game.load.image('trans','assets/transparent_tile.png');
    }

    this.create =  function () {

        //create our grid that spans the 500x800 (10cellsx14cells)
        game.physics.startSystem(Phaser.Physics.BOX2D);
        game.stage.backgroundColor = '#2d2d2d';

        game.add.sprite (0,0,'sky');

        var block = game.add.sprite(150,150, 'block');
        var block = game.add.sprite(300,500, 'block');
        //3,3 3,4, 4,3, 4,4 are blocked

        var player = new unit(game); 
        player.create('Platinum','plat',50,50,3,3,5);

        block.inputEnabled = true;
        var text;
        //set up mouse controls
        block.events.onInputDown.add (function (){
            text = game.add.text (5,5,"clicked");
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
