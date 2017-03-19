//handles syntax for a generic unit on the field
var unit = function (game){
    this.spriteframe;
    this.hp;
    this.sp;
    this.movement;
    
    
    this.create = function (sprite, hp, sp, movement){
       this.spriteframe = game.add.sprite (200,200,sprite); 
       game.physics.arcade.enable (this.spriteframe);
       //this.spriteframe.body.gravity.y = 300;
       //this.spriteframe.collideWorldBounds = true;

        
    }

}
