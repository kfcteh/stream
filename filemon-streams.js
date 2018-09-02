const { Transform } = require('stream')

const lineSeperatedToObject = ({ debug = false }) => {
  const lineSeperatedToObjectTransform = Object.create(new Transform({
    readableObjectMode: true,
    transform: function (chunk, encoding, callback) {
      const chunkToString = chunk.toString()
      const splitByNewLine = chunkToString.split('\n')
      if (splitByNewLine.length > 0 && splitByNewLine[splitByNewLine.length - 1] === '') {
        splitByNewLine.pop()
      }
      let currentTime = new Date().getTime()
      this.totalLines += splitByNewLine.length
      this.byteLength += chunk.length
      this.push
        ({
          totalLines: this.totalLines,
          byteLength: this.byteLength,
          elapsedTime: parseInt(currentTime) - parseInt(this.startTime)
        })
      if (debug) {
        console.log(`
----------DEBUG Incoming text chunk-------
  ${chunkToString}
------------------------------------------`)
      }
      callback()
    }
  }))

  lineSeperatedToObjectTransform.totalLines = 0
  lineSeperatedToObjectTransform.byteLength = 0
  lineSeperatedToObjectTransform.startTime = new Date().getTime()

  return lineSeperatedToObjectTransform
}


const objectToReport = ({ debug = false }) => {

  const objectToReportTransform = Object.create(new Transform({
    writableObjectMode: true,
    transform(chunk, encoding, callback) {
      const msecToSec = 1000
      const { elapsedTime, totalLines, byteLength } = chunk
      const elapsedTimeInSec = elapsedTime / msecToSec
      this.push(`
**********************************************************************
The elapsed time (sec) is: ${elapsedTimeInSec}, the file contains: ${totalLines} lines, the byte length is: ${byteLength} bytes and the throughput rate in bytes per sec is: ${byteLength / elapsedTimeInSec}
**********************************************************************`)

      if (debug) {
        console.log(`
----------DEBUG Incoming object chunk------
  ${JSON.stringify(chunk)}
-------------------------------------------
        `)
      }
      callback()
    }
  }))
  return objectToReportTransform
}

module.exports = { lineSeperatedToObject, objectToReport }