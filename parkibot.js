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

    getAll(10, bot);
    bot.on("physicsTick",async ()=>{
      bot.setControlState("forward",true);
      closest_block=bot.blockAt(bot.entity.position.offset(0,50,0));



      bot.lookAt(Vec3(roundhalf(closest_block.position.x),closest_block.position.y,roundhalf(closest_block.position.z)))
      bot.setControlState("forward",true);


    });

  }

});
function roundhalf(value) {
  if(value>0){
    return value+0.7;
  }else{
    return value-0.7;
  }
}

function getAll(radius, bot){
  let blocks = []

  const range = radius * 2;

  for(let x = 1; x <= radius*2; x++){
    for(let y =1; y <= radius*2; y++){
      for(let z = 1; z <= radius*2; z++){
        // index of block from 3 numbers
        let index = x * range * range + y * range + z
        blocks.push({
          block: bot.blockAt(bot.entity.position.offset(x, y, z)),
          position: bot.entity.position.offset(x, y, z),
          index,
          potential: 0
        })
        console.log(index)
        // bot.chat("Block at: " + blocks[blocks.length - 1].position + " is " + blocks[blocks.length - 1].block.type)

      }
    }
  }
  blocks = blocks.filter(block => block.block.type !== 0)
  // blocks.forEach(block => bot.chat("Block at: " + block.position + " is " + block.block.name));


  return blocks
}

function generatePotentials(blocks){
  blocks.map(block => {
    if(block.block.type === 0){
      block.potential = -10000;
    } else {
      block.potential = distance(block.index.position);
    }
  });
}

function distance(position){
  return Math.sqrt(position.x * position.x + position.y * position.y + position.z * position.z);
}
