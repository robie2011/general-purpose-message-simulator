const fs = require("fs")
const config = JSON.parse(fs.readFileSync('config.json', 'utf8'))
console.log("input data function: ", config.input)
console.log("output data function: ", config.output)
console.log("before send mapper: ", config.beforeSendMapper)
console.log("------------------------------------------------")

const output = require(config.output)
const input = require(config.input)
const beforeSendMapper = require(config.beforeSendMapper)

const scheduler = require("./scheduler")

scheduler(input, output, beforeSendMapper).start()