const mineflayerViewer = require('prismarine-viewer').mineflayer
const mineflayer = require('mineflayer')

const fs = require('fs')
const {loader: autoJump} = require('@nxg-org/mineflayer-auto-jump');
const { Schematic } = require('prismarine-schematic');
const { posix } = require('path');
const { finished } = require('stream');
const { BlockList } = require('net');
const pathfinder = require('mineflayer-pathfinder').pathfinder
const Movements = require('mineflayer-pathfinder').Movements
const { GoalNear } = require('mineflayer-pathfinder').goals

let placedblock=false;

const bot = mineflayer.createBot({
    host : "localhost",
    port : "25565",
    username: "bilbal_bot",
    
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
 
   main().then( schem=>{
    
    const size = schem.size;
    firstpos = bot.entity.position;
    const defaultMove = new Movements(bot)
    defaultMove.canDig = false;
    defaultMove.scafoldingBlocks.push(bot.registry.itemsByName['netherrack'].id) // Add nether rack to allowed scaffolding items

    bot.pathfinder.setMovements(defaultMove)

    let z =-1;
    let x=-1;
    let y =0;
    finish =true;
    bot.on("physicsTick",async ()=>{
      placedblock = false;
      
      const target = firstpos.offset(x,y,z);
      const blockpos = target.offset(-firstpos.x,-firstpos.y,-firstpos.z)
            if(!bot.pathfinder.isMoving()&&finish){
            
              finish=false;
              if(schem.getBlock(blockpos).name!=="air"){
                face =schem.getBlock(blockpos).getProperties().facing;
                istrap =schem.getBlock(blockpos).name.includes("trapdoor");
                if(face==="north" &&!istrap){
                  await bot.pathfinder.goto(new GoalNear(target.x,target.y+1,target.z+2,1))
                }else if(face ==="west" &&!istrap ){
                  await bot.pathfinder.goto(new GoalNear(target.x+2,target.y+1,target.z,1))

                }else if (face ==="south"&&!istrap){
                  await bot.pathfinder.goto(new GoalNear(target.x,target.y+1,target.z-2,1))

                }else if (face ==="east"&&!istrap){
                  await bot.pathfinder.goto(new GoalNear(target.x-2,target.y+1,target.z,1))

                }
                else if(face==="south" &&istrap){
                  await bot.pathfinder.goto(new GoalNear(target.x,target.y+1,target.z+2,1))
                }else if(face ==="east" &&istrap ){
                  await bot.pathfinder.goto(new GoalNear(target.x+2,target.y+1,target.z,1))

                }else if (face ==="north"&&istrap){
                  await bot.pathfinder.goto(new GoalNear(target.x,target.y+1,target.z-2,1))

                }else if (face ==="west"&&istrap){
                  await bot.pathfinder.goto(new GoalNear(target.x-2,target.y+1,target.z,1))

                }
                 else{
                  await bot.pathfinder.goto(new GoalNear(target.x-1,target.y+1,target.z,1))

                }
                
                await placeBlockSafely(target,schem,blockpos)
                
              }

              finish = true;
             // bot.chat("/item replace entity @s container.0 with minecraft:"+schem.getBlock(blockpos).name)
            //  if(schem.getBlock(blockpos).name!=="air"){
               

            //  }else{
            //    z+=1;
            //  }
 
                z+=1;

            
              
            }
   
            if(z >size.z){
              x+=1;
              z=0;
            }
            if(x>size.x){
              y+=1;
              x=0;
              z=0;
            }

          
    });
  
          //  bot.placeBlock(bot.blockAt(bot.entity.position.offset(x,y,z)),{x:0,y:1,z:0})
          



  bot.chat("ok!");




    
  });


  }

  

});

async function main () {
  // Read a schematic (sponge or mcedit format)
  const file = fs.readFileSync('schematics/trapdoor.schem');
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

async function placeBlockSafely(target,schem,blockpos) {
  try {
      // Attempt to place the block, waiting for the operation to complete.
      bot.setQuickBarSlot(0);
      if(schem.getBlock(blockpos).name!=="air"){
        bot.setControlState("sneak",true);
        if(bot.blockAt(target.round().offset(0,-1,0)).name==="air"){
    
          try{
           

            bot.chat("/item replace entity @s container.0 with minecraft:dirt")

            await bot.lookAt(target.round(),true);
              await bot.placeBlock(bot.blockAt(target.round().offset(0, -1, 0)), {x: 0, y: 1, z: 0});
       

          
          }catch(erro){

          }

        }
        bot.chat("/item replace entity @s container.0 with minecraft:"+schem.getBlock(blockpos).name)
        await bot.lookAt(target.round(),true);

        if(schem.getBlock(blockpos).metadata==1 || schem.getBlock(blockpos).getProperties().half=="top"){
          await bot.placeBlock(bot.blockAt(target.round().offset(0, 0, 0)), {x: 0, y: -1, z: 0});

        }
        else{
          await bot.placeBlock(bot.blockAt(target.round().offset(0, -1, 0)), {x: 0, y: 1, z: 0});

        }

        
      }
      placedblock=true;
      bot.setControlState("sneak",false);

    //  console.log('Block placed successfully.');
  } catch (error) {
      // Handle any errors that occur during the block placement.
      bot.chat("cant place block")

      placedblock=true
  }
}
//9:44