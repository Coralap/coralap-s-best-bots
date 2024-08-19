const mineflayerViewer = require('prismarine-viewer').mineflayer
const mineflayer = require('mineflayer')
const keypress = require('keypress');
vec3=require('vec3');
const fs = require('fs')
const {loader: autoJump} = require('@nxg-org/mineflayer-auto-jump');
const { Schematic } = require('prismarine-schematic');
const { off } = require('process');
const pathfinder = require('mineflayer-pathfinder').pathfinder
const Movements = require('mineflayer-pathfinder').Movements
const { GoalNear } = require('mineflayer-pathfinder').goals
const bot = mineflayer.createBot({
    host : "localhost",
    port : "25565",
    username: "Build_Bot",
    
   // auth:'microsoft',
   

    version : "1.20.4"
});

bot.loadPlugin(autoJump);
bot.loadPlugin(pathfinder)
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


  if(message==="build"){

   main().then(schem=>{
    const size = schem.size;
    firstpos = bot.entity.position;
    const defaultMove = new Movements(bot)

    bot.pathfinder.setMovements(defaultMove)
    let z =0;
    for (let y = 0; y < size.y; y++) {
      for (let x = 0; x < size.x; x++) {
        for ( z = 0; z < size.z; z++) {
          const target = bot.entity.position.offset(x,y,z);
    bot.pathfinder.setGoal(new GoalNear(target.x,target.y,target.z,0))
          if(bot.pathfinder.isMoving){
            z-=1;
          }
            bot.placeBlock(bot.blockAt(bot.entity.position.offset(x,y,z)),{x:0,y:1,z:0})
          
        }
      
      }
      
    }



  bot.chat("ok!");




    
  });


  }



});

async function main () {
  // Read a schematic (sponge or mcedit format)
  const file = fs.readFileSync('schematics/coolhedad.schem');
  const schematic = await Schematic.read(file)
  
  // Write a schematic (sponge format)
  return (schematic);
}
function wait(ms){
  var start = new Date().getTime();
  var end = start;
  while(end < start + ms) {
    end = new Date().getTime();
 }
}