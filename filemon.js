const { lineSeperatedToObject, objectToReport } = require('./filemon-streams')
const param = process.argv[2]
const config = {
  debug: false
}

if (param && typeof param === 'string' && param.split('--').slice(1)[0] === 'debug') {
  config.debug = true
}

process.stdin.pipe(lineSeperatedToObject(config)).pipe(objectToReport(config)).pipe(process.stdout)

