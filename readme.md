# General Purpose Message Simulator
This script generates messages from a given input source to a given output sink. 
For example it can read from a csv-file (implemented) and generate MQTT messages (implemented).

Messages produced from `input` plugin (see below) are expected to have a `timestamp` field with date formatted like `2018-11-25 14:23:14:142`. 
Timestamp is used to calculate waiting time between two messages.

## Plugins

**Implemented plugins**
* INPUT
  * CSV-File input (`input.csv`)
* OUTPUT
  * Console Output (`output.console`)
  * MQTT Output (`output.mqtt`)
* TRANSFORMER
  * id - do nothing (`mapper.id`)
  * setDateTimeNow (`mapper.setDateTimeNow`)

### Implement your Input
Feed data generator with message object. Input modules should be implemented according to this pattern:

```javascript
module.exports = {
    next: () => {
        // run your calculations
        return {
            timestamp: "2018-11-25 14:23:14:142", // timestamp is required
            data1: "", // your data
            data2: "" // your data etc.
        }
    }
}
```
Examples: See `input.csv.js`

### Implement your Output
Message generator writes messages to a given output. Output module export is an object containing a `write(object)` function and returns a Promise-Object.

Output modules should be implemented according to this pattern:

```javascript
module.exports = {
    write: obj => new Promise((resolve, reject) => {
        console.log(`sent: ${obj.timestamp} ${obj.acceleration} ${obj.speed}`)
        resolve()
    })
}
```

Examples: See `output.console.js`, `output.mqtt.js`

### Implement your Message Transformer
You have the opportunity to transform messages before they are send to output plugin. Transformation Plugin should be implemented according to this pattern:

Example #1
```javascript
// this function do not transform the object
const id = obj => obj
module.exports = id
```


Example #2
```javascript
const moment = require("moment")
const transformTimeStampToNow = obj => {
    obj.timestamp = moment().format("YYYY-MM-DD HH:mm:ss.SSS")
    return obj
}

module.exports = transformTimeStampToNow
```




## Configuration
Required Configuration
  * `output`: Which plugin feeds our generator
  * `input`: Which plugin use our generator to write messages
  * `beforeSendMapper`: function is called to transform message before it is send to `output` plugin. This can be used to transform e.g. timestamp to current time.

Other configurations are plugin specific. E.g. for MQTT `output.mqtt.options` object is passed to client generation. See https://www.npmjs.com/package/mqtt#client

```json
{
    "output": "./output.mqtt",
    "output.mqtt": {
        "url": "mqtts://mqtt.ketag.io",
        "topic": "test",
        "options": {
            "username": "???",
            "password": "???",
            "clientId": "test-client"
        }
    },
    "input": "./input.csv-ketag",
    "input.csv": {
        "file": "./data/Rad2.csv"
    },
    "beforeSendMapper": "./mapper.setDateTimeNow"
}
```


# Example
File: `data/testdata.csv`
```csv
2018-10-16 14:40:44.036;-1.52648950205082e-3;0.0
2018-10-16 14:40:48.037;-1.52648950205082e-3;0.0
2018-10-16 14:40:54.038;-1.52648950205082e-3;0.0
2018-10-16 14:41:10.039;-1.52648950205082e-3;0.0
```

File: `config.json``
```json
{
    "output": "./output.console",
    "input": "./input.csv",
    "input.csv": {
        "file": "./data/testdata.csv"
    },
    "beforeSendMapper": "./mapper.setDateTimeNow"
}
```