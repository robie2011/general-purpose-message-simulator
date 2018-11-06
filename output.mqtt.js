const fs = require("fs")
const config = JSON.parse(fs.readFileSync('config.json', 'utf8'))['output.mqtt']
const mqtt = require('mqtt')
const client = mqtt.connect(config.url, config.options)

module.exports = {
    write: obj => new Promise((resolve, reject) => {
        client.publish(config.topic, JSON.stringify(obj), err => {
            if (err) reject(err)
            else {
                resolve()
                console.debug(`mqtt sent [${config.topic}@${config.url}]: ${obj.timestamp}`)
            }
        })
    })
}
