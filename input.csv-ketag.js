const fs = require("fs")
const config = JSON.parse(fs.readFileSync('config.json', 'utf8'))['input.csv']
const lineByLine = require('n-readlines')
const simulationFile = config.file

console.log("file for simulation: ", simulationFile)


const extractor = str => {
    let arr = str.trim().split(";")
    let date = arr[0].substr(0, 10) + ' ' + arr[0].substr(11);

    return {
        timestamp: date,
        acceleration: arr[1],
        speed: arr[2]
    }
}


let liner = new lineByLine(simulationFile)
let lineNr = 0
let endOfStreamListeners = []

module.exports = {
    next: () => {
        let line = liner.next()
        if (line) {
            ++lineNr
        } else {
            if (lineNr > 0) {
                endOfStreamListeners.forEach(listener => listener())

                liner = new lineByLine(simulationFile)
                lineNr = 0
                line = liner.next()
            } else {
                throw "file seems to be empty or corrupt"
            }
        }
        return extractor(line.toString('utf8'))
    }
}