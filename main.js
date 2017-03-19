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
        game.load.image('sky','assets/sky.png');
        game.load.image('sky','assets/block.png');
    }

    this.create =  function () {
        game.physics.startSystem(Phaser.Physics.BOX2D);
        game.stage.backgroundColor = '#2d2d2d';

        game.add.sprite (0,0,'sky');

        var block = game.add.sprite(150,150, 'block');

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
