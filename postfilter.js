const readline = require('readline')
const { lengthToDegrees } = require('@turf/helpers')

const p = async () => {
  const rl = readline.createInterface({
    input: process.stdin
  })
  for await (const line of rl) {
    f = JSON.parse(line)
    lng = f.geometry.coordinates[0]
    lat = f.geometry.coordinates[1]
    half = lengthToDegrees(f.properties.spacing / 2, 'meters')
    f.geometry.type = 'Polygon'
    f.geometry.coordinates = [[
      [lng + half, lat - half],
      [lng + half, lat + half],
      [lng - half, lat + half],
      [lng - half, lat - half],
      [lng + half, lat - half]
    ]]
    process.stdout.write(`\x1e${JSON.stringify(f)}\n`)
  }
}

p()

