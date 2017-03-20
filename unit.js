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

    this.movepanel = game.add.group();
    
    this.create = function (name,sprite, hp, sp, movement,x,y){
       this.name = name;
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
            //this.infotext = game.add.text (this.x+50,this.y+10,this.name + " Hp: "+this.hp + " Mv: " + this.movement);
            //show movement panels

            //this.infotext.fill = "#ff0044";
            this.infoswitch = true;

            this.movepanel = game.add.group();

            //determine movable tiles in the game
            for (i = 1; i< this.movement+1; i++){
                this.movepanel.create(this.x + 50*i,this.y,'trans');
                this.movepanel.create (this.x - 50*i,this.y,'trans');
                this.movepanel.create (this.x,this.y+50*i,'trans');
                this.movepanel.create (this.x,this.y-50*i,'trans');
                //diagonal panels
                //this.movepanel.create (this.x-50*(i-1),this.y-50*(i-1),'trans');
            }
            this.movepanel.setAll ('inputEnabled',true);
            this.movepanel.setAll ('alpha',0.2);
            this.movepanel.callAll ('events.onInputDown.add','events.onInputDown',this.move);
        }else{
            //this.infotext.destroy();
            this.movepanel.destroy();
            this.infoswitch = false;
        }
    }

    this.movepanelInputAdd =function (){
        this.movepanel.inputEnabled = true;
        this.movepanel.alpha = 0.2;
     //   this.movepanel.events.onInputDown.add(this.move,self);

    }

    this.move = function (event){
        //move the player depending on which movepanel was picked (panel in mouse event)
        event.alpha = 0.5;
        //this.spriteframe.body.velocity.x= 50;
        this.infoswitch = false;
    }


}
