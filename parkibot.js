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
    let path = [bot.entity.position.clone()]
    let target = bot.players[username]
    for (let i = 1; i < Math.ceil(target.entity.position.distanceTo(bot.entity.position)); i++) {

      let blocks = getAll(i, bot);
      blocks
        .filter(block => {
          return (bot.blockAt(block.position.offset(0,2,0)).type!=0)
        })
        .map(block => {
        block.distance = distance(bot.entity.position, block.position);
      })

      let smallest = smallest_distance(blocks);
      path.push(smallest);




      // generatePotentials(bot, target, blocks);
      try {
        // await bot.dig(smallest.block)
        bot.placeBlock(smallest.block, { x: 0, y: 1, z: 0 })

      } catch (error) {
        bot.chat("error placing block")
      }


    }
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

  for(let x = 0; x < radius*2; x++){
    for(let y =0; y < radius*2; y++){
      for(let z = 0; z < radius*2; z++){
        // index of block from 3 numbers
        let index = x * range * range + y * range + z
        let block = {
          block: bot.blockAt(bot.entity.position.offset(x - radius, y - radius, z - radius)),
          position: bot.entity.position.offset(x - radius, y - radius, z - radius),
          index,
          distance: 0
        };
        blocks.push(block)
        // if (block.block.type != 0){
        //   await bot.dig(block.block)
        // }
        if (block.block.type != 0) {
          continue;
        }
        try {
          bot.placeBlock(block.block, { x: 0, y: 1, z: 0 })

        } catch (error) {
          // bot.chat("error placing block")
        }


        // bot.chat("Block at: " + blocks[blocks.length - 1].position + " is " + blocks[blocks.length - 1].block.type)

      }
    }
  }
  // blocks.forEach(block => bot.chat("Block at: " + block.position + " is " + block.block.name));


  return blocks
}

function generatePotentials(bot, target, blocks){
  blocks.map(block => {
    if(block.block.type === 0){
      block.potential = -10000;
    } else {
    }
  });
  return blocks;
}

function distance(start, position){
  return Math.sqrt(Math.pow(start.x - position.x, 2) + Math.pow(start.y - position.y, 2) + Math.pow(start.z - position.z, 2));
}

function smallest_distance(blocks){
  let smallest = blocks[0];
  blocks.map(block => {
    if(block.distance < smallest.distance){
      smallest = block;
    }
  });
  return smallest;
}
