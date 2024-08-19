const mineflayerViewer = require('prismarine-viewer').mineflayer
const mineflayer = require('mineflayer')
const keypress = require('keypress');

const fs = require('fs')
const {loader: autoJump} = require('@nxg-org/mineflayer-auto-jump');
let canhit = true;
let fight = false;
let isonsight= false;
let isJumpReset=false;

let isConsume = false;
let lashealth=1000;



let canstafe = true;
let strafe=true;
let canflick = true;
let manualMode = true; // Manual mode flag

const bot = mineflayer.createBot({
    host : "localhost",
    port : "25565",
    username: "Coralap_Bot",
    
   // auth:'microsoft',
   

    version : "1.20.4"
});


bot.loadPlugin(autoJump);




bot.on("health",async(entity)=>{

    if(bot.health<lashealth){
        let target = bot.nearestEntity(({ type}) => type === 'player')
        if(target!==null){
            bot.lookAt(target.position.offset(0, 1.6, 0));
        }
        isJumpReset=true;
       
        bot.setControlState("forward",true);
        bot.setControlState("sprint",true);
        bot.setControlState("jump",true);
        let timer = setInterval(() => {
        bot.setControlState("jump",false);
        clearInterval(timer);
    }, 200);
        let timer1 = setInterval(() => {
            isJumpReset=false;
            bot.setControlState("sprint",false);
            bot.setControlState("forward",false);
         
            clearInterval(timer1);
        }, 200);
    }
    
 //   bot.chat(bot.health);
    if((bot.health<10 &&bot.food<20) || bot.food<16){




        if(!isConsume){
            let target = bot.nearestEntity(({ type}) => type === 'player')
     
            if(target!=null){
               
                let targetpos = target.position.offset(0, 1.6, 0);
                const direction = {
                    x: targetpos.x- bot.entity.position.x,
                    y:targetpos.y- bot.entity.position.y,
                    z:targetpos.z- bot.entity.position.z,
                  };
        
        
                const magnitude = Math.sqrt(direction.x ** 2 + direction.y ** 2 + direction.z ** 2);
                const normalizedDirection = {
                    x: direction.x / magnitude,
                    y: direction.y / magnitude,
                    z: direction.z / magnitude
                };
                const newPosition = {
                    x: bot.entity.position.x - normalizedDirection.x * 2,
                    y: bot.entity.position.y - normalizedDirection.y * 2,
                    z: bot.entity.position.z - normalizedDirection.z * 2
                    
                };
               targetpos.x=newPosition.x;
               targetpos.z=newPosition.z;
               
                bot.lookAt(targetpos);
            }
            isonsight=false;
            bot.setControlState("forward",true);
            bot.setControlState("sprint",true);
            bot.setControlState("jump",true);
            bot.activateItem(offhand=true);
            isConsume=true;
            let timer = setInterval(() => {
                bot.setControlState("forward",false);
                bot.setControlState("sprint",false);
                bot.setControlState("jump",false);

                isConsume=false;
                clearInterval(timer);
            },  1610);
            
        }
       
    }

    lashealth = bot.health;
});

bot.on("physicsTick",()=>{
   if(isConsume){
    bot.setControlState("forward",true);
    bot.setControlState("sprint",true);
    bot.setControlState("jump",true);

   }
 
    if(bot.entityAtCursor(4)===null){
        isonsight = false;
}else{isonsight=true;}
    if(fight){
    let target = bot.nearestEntity(({ type}) => type === 'player')
   
    if(bot.blockAt(bot.entity.position)!==null && bot.blockAt(bot.entity.position).name ==="water"){
        bot.setControlState("jump",true);
    }

    if(target!==null){


        
        if(strafe){
            if(canstafe&&bot.entity.position.distanceTo(target.position)<5){
                const randir = getRandomInt(1,3);
                if(randir===1){
                    bot.setControlState("right", true);
                    bot.setControlState("left", false);
                }else if(randir===2){
                    bot.setControlState('left', true);
                    bot.setControlState('right', false);
        
                }else{
                    bot.setControlState('left', false);
                    bot.setControlState('right', false);
                }
                canstafe=false
                let timer = setInterval(() => {
                    canstafe=true;
                   
                    clearInterval(timer);
                }, 250);
            }
    
            if(canflick&&bot.entity.position.distanceTo(target.position)<5){
                const randir = getRandomInt(1,3);
                if(randir===1){
                    bot.setControlState("right", true);
                    bot.setControlState("left", false);
                }else if(randir===2){
                    bot.setControlState('left', true);
                    bot.setControlState('right', false);
        
                }else{
                    bot.setControlState('left', false);
                    bot.setControlState('right', false);
                }
                canflick=false
                let timer = setInterval(() => {
                    canflick=true;
                   
                    clearInterval(timer);
                }, 500);
            }
        }
        
      if(!isConsume){
        bot.lookAt(target.position.offset(0, 1.6, 0));

      }




        if(bot.entity.position.distanceTo(target.position)>3){
            if(!isConsume){
                bot.setControlState('forward', true);
                bot.setControlState('sprint', true);
                bot.setControlState("back", false);
            }
    
            if(bot.entity.position.distanceTo(target.position)>4){
             //   bot.setControlState('left', false);
               // bot.setControlState('right', false);
            
            }

        
        }
        
        
        else{
            const randir = getRandomInt(1,8);
            if(randir===1){
                stap(target);

            }else{
                normalcombo(target);

            }
        }
        }
    }
});

bot.on("login",()=>{

   
bot.autoJumper.enable();
console.log("login good");
mineflayerViewer(bot,{viewDistance:12,firstPerson:true})
const path = [bot.entity.position.clone()]
bot.on('move', () => {
  if (path[path.length - 1].distanceTo(bot.entity.position) > 1) {
    path.push(bot.entity.position.clone())
    bot.viewer.drawLine('path', path)
  }
});
});




bot.on("chat",async(username,message,translate,jsonMsg,matches) =>{
    if(message ==="start"){
        fight =true;
    }else if(message==="stop"){
        bot.setControlState('forward', false);
        bot.setControlState('sprint', false);
        bot.setControlState("back",false);
        bot.setControlState('right', false);
        bot.setControlState('jump', false);
        bot.setControlState('left', false);


        fight = false;
    }
});

function getRandomInt(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
  }

  function normalcombo(target){
    strafe =true;
    if(!isJumpReset){
    bot.setControlState('forward', false);
    bot.setControlState('sprint', false);
    bot.setControlState("back",false);
    }
   //bot.setControlState("forward",false);
   if(canhit&&isonsight&&!isConsume){
     
       if(!isJumpReset){
        bot.setControlState('forward', true);
        bot.setControlState('sprint', true);
      
       }
       canhit=false;
       bot.attack(target,true);
       if(!isJumpReset){
        bot.setControlState('forward', false);
        bot.setControlState('sprint', false);
        bot.setControlState("back",true);
       }

       let timer = setInterval(() => {
           canhit=true;
          
           clearInterval(timer);
       }, 625);
       if(!isJumpReset){
        bot.setControlState("forward",false);

       }
       
       //bot.setControlState('left', false);
       //bot.setControlState('right', false);
   }
   
   if(bot.entity.position.distanceTo(target.position)<2.7){
       bot.setControlState("back",true);
       
   }
  }

  function stap(target){
    strafe =false;
    if(!isJumpReset){
    bot.setControlState('forward', false);
    bot.setControlState('sprint', false);
  
    bot.setControlState("right",false);
    bot.setControlState("left",false);
    }
   //bot.setControlState("forward",false);
   if(canhit&&isonsight&&!isConsume){
     
       if(!isJumpReset){
        if(!bot.getControlState("back")){
            bot.setControlState('forward', true);
            bot.setControlState('sprint', true);
        }

      
       }
       canhit=false;
       bot.attack(target,true);
       if(!isJumpReset){
        bot.setControlState('forward', false);
        bot.setControlState('sprint', false);
        bot.setControlState("back",true);
       }

       let timer = setInterval(() => {
           canhit=true;
         bot.setControlState("back",false)
           clearInterval(timer);
       }, 625);


       if(!isJumpReset){
        bot.setControlState("forward",false);

       }
       
       //bot.setControlState('left', false);
       //bot.setControlState('right', false);
   }
   
   if(bot.entity.position.distanceTo(target.position)<2.7){
       bot.setControlState("back",true);
       
   }
  }
  keypress(process.stdin);

  process.stdin.on("keypress", (ch, key) => {
      if (manualMode) {
          if (key.name === 'w') {
            if(bot.getControlState("forward")){
                bot.setControlState('forward', false);

            }else{
                bot.setControlState('forward', true);
            }
          }else if (key.name === 's') {
            if (bot.getControlState('back')) {
                bot.setControlState('back', false);
            } else {
                bot.setControlState('back', true);
            }
        } else if (key.name === 'a') {
            if (bot.getControlState('left')) {
                bot.setControlState('left', false);
            } else {
                bot.setControlState('left', true);
            }
        } else if (key.name === 'd') {
            if (bot.getControlState('right')) {
                bot.setControlState('right', false);
            } else {
                bot.setControlState('right', true);
            }
        } else if (key.name === 'space') {
            if (bot.getControlState('jump')) {
                bot.setControlState('jump', false);
            } else {
                bot.setControlState('jump', true);
            }
        }else if (key.name === 'n') {
            if (fight) {
                console.log("fightoff");
                bot.setControlState('forward', false);
                bot.setControlState('sprint', false);
                bot.setControlState("back",false);
                bot.setControlState('right', false);
                bot.setControlState('jump', false);
                bot.setControlState('left', false);
                fight=false;
            } else {
                console.log("on");

                fight=true;
            }
        }
        
      }
  
  });


  process.stdin.setRawMode(true);
  process.stdin.resume();
