//handles syntax for a generic unit on the field
var unit = function (game){
    this.spriteframe;
    this.hp;
    this.sp;
    this.movement;
    
    //x and y coordinates in the grid (multiplied by 50) 10x16
    this.x;
    this.y;

    this.infotext;
    this.infoswitch = false;

    
    
    this.create = function (sprite, hp, sp, movement,x,y){

       this.hp = hp;
       this.sp = sp;
       this.movement = movement;

       this.x = x*50;
       this.y = y*50;
       this.spriteframe = game.add.sprite (this.x,this.y,sprite); 
       game.physics.arcade.enable (this.spriteframe);
       //this.spriteframe.body.gravity.y = 300;
       //this.spriteframe.collideWorldBounds = true;

       //create on click functions    
       //
       this.spriteframe.inputEnabled = true;
       this.spriteframe.events.onInputDown.add(this.click,this);
    }

    this.click = function (){
        if (!this.infoswitch){
            this.infotext = game.add.text (this.x+50,this.y+10,"hp: "+this.hp + " Mv: " + this.movement);
            this.infoswitch = true;
        }else{
            this.infotext.destroy();
            this.infoswitch = false;
        }
    }

}
