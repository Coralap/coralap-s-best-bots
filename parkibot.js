const mineflayerViewer = require('prismarine-viewer').mineflayer
const mineflayer = require('mineflayer')

const fs = require('fs')
const {loader: autoJump} = require('@nxg-org/mineflayer-auto-jump');
const { Schematic } = require('prismarine-schematic');
const { finished } = require('stream');
const { BlockList } = require('net');

Vec3 = require("vec3")

let placedblock=false;

const bot = mineflayer.createBot({
    host : "localhost",
    port : "25565",
    username: "parki",
    
   // auth:'microsoft',
   

    version : "1.20.4"
});

bot.loadPlugin(autoJump);

// 

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
   // if(message==="")
  if(message ==="follow"){
    let target = bot.players[username]
    
     bot.on("physicsTick",async ()=>{
       closest_block=bot.blockAt(bot.entity.position.offset(0,50,0));
     
        for (let x = -1; x < 2; x++) {
          for (let z = -1; z < 2; z++) {
            
            if(bot.blockAt(bot.entity.position.offset(x,0,z))!==null &&bot.blockAt(bot.entity.position.offset(x,0,z))!==bot.blockAt(bot.entity.position.offset(0,0,0)) && closest_block.position.distanceTo(target.entity.position)>bot.blockAt(bot.entity.position.offset(x,0,z)).position.distanceTo(target.entity.position)){

              if(bot.blockAt(bot.entity.position.offset(x,1,z)).type===0 &&bot.blockAt(bot.entity.position.offset(x,2,z)).type===0){
                closest_block = bot.blockAt(bot.entity.position.offset(x,0,z))

              }
            }
              
            
          }
          
        }
        bot.lookAt(Vec3(roundhalf(closest_block.position.x),closest_block.position.y,roundhalf(closest_block.position.z)))
       bot.setControlState("forward",true);


    });

  }

});
function roundhalf(value) {
  if(value>0){
    return value+0.5;
  }else{
    return value-0.5;
  }
}