const fs = require('fs').promises
const { Schematic } = require('prismarine-schematic')
Vec3 = require("vec3")
async function main () {
  // Read a schematic (sponge or mcedit format)
  const schematic = await Schematic.read(await fs.readFile('schematics/trapdoor.schem'))
  pos = Vec3(0,0,0)
  console.log(schematic.getBlock(pos).name.includes("trapdoor"))
  // Write a schematic (sponge format)
}

main()