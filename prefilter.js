raise 'this is not used.'

const readline = require('readline')
const buffer = require('@turf/buffer')

const p = async () => {
  const rl = readline.createInterface({
    input: process.stdin
  })
  for await (const line of rl) {
    f = JSON.parse(line)
    f.geometry = buffer(f.geometry, 1e-4 / Math.sqrt(2), {
      units: 'kilometers', steps: 1
    }).geometry
    process.stdout.write(`\x1e${JSON.stringify(f)}\n`)
  }
}

p()

