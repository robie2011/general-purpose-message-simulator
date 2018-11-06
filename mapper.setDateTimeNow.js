const moment = require("moment")

const transformTimeStampToNow = obj => {
    obj.timestamp = moment().format("YYYY-MM-DD HH:mm:ss.SSS")
    return obj
}

module.exports = transformTimeStampToNow