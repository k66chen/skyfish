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

    this.movepanel = game.add.group();
    this.tempmovepanel;
    var testtext = game.add.text(0,0);

    this.getType = function (){
        return "unit" + global;
    }

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
        if (this.movedone){
            if (!this.infoswitch){
                this.x = this.spriteframe.x ;
                this.y = this.spriteframe.y ;

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
                this.movepanel.callAll ('events.onInputDown.add','events.onInputDown',this.move,this);
            }else{
                //this.infotext.destroy();
                this.movepanel.destroy();
                this.infoswitch = false;
            }
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
        //game.add.text (0,0,"x:"+event.x+"y:"+event.y);
        //   this.spriteframe.body.velocity.x= 150;
        this.infoswitch = false;
        //determine destination x and destination y
        var destx = event.x /50;
        var desty = event.y / 50;
        //var testtext = game.add.text (0,0,"x:"+this.spriteframe.x+"dx:"+destx);

        //game.physics.arcade.moveToXY (this.spriteframe,event.x,this.spriteframe.y,50,500); 
        this.spriteframe.body.moves = false;
        this.tempmovepanel = game.add.sprite (event.x,event.y,'trans');
        this.tempmovepanel.alpha = 0.5;
        this.movedone = false;
        movetween = game.add.tween(this.spriteframe).to({x:event.x,y:event.y},600);
        //x tween complete, add y tween
        movetween.onComplete.add(function (){
            this.movedone = true;
            this.tempmovepanel.destroy();
        },this);
        movetween.start();
        //movetweeny = game.add.tween(this.spriteframe).to({x:this.spriteframe.x,y:event.y},600);
        //movetweeny.start();

        this.movepanel.destroy();

        //update the local x and y
        this.x = this.spriteframe.x ;
        this.y = this.spriteframe.y ;

        /* 
           while (this.spriteframe.x < event.x){
        //this.spriteframe.body.velocity.x = 50;
        testtext.text = " "+this.spriteframe.x +" to:" + event.x;

        setTimeout (function (){
        this.spriteframe.x ++;
        }, 10);


        }
        */
        //this.spriteframe.body.velocity.x = 0;
    }


}
