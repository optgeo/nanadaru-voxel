const Parser = require('json-text-sequence').parser
const buffer = require('@turf/buffer')

const p = new Parser()
  .on('data', f => {
    f.properties.height = f.geometry.coordinates[2]
    f.properties.intensity = Math.round(f.properties.intensity / 256.0)
    f.properties.asprsclass = parseInt(f.properties.asprsclass, 2)
    delete f.properties.gpstime
    delete f.properties.return_num
    delete f.properties.angle
    delete f.properties.return_tot
    f.geometry = buffer(f.geometry, 1e-4 / Math.sqrt(2), {
      units: 'kilometers', steps: 1
    }).geometry
    f.tippecanoe = {
      minzoom: f.properties.intensity > 10 ? 12 : 16
    }
    if (f.properties.asprsclass != 2) {
      f.tippecanoe.minzoom = 16
    }
    process.stdout.write(`\x1e${JSON.stringify(f)}\n`)
  })
  .on('truncated', buf => {
    console.error('Truncated:', buf)
  })
  .on('invalid', buf => {
    console.error('Invalid:', buf)
  })
  .on('finish', () => {
    console.error('filter.js done.')
  })

process.stdin.pipe(p)
