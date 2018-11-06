const moment = require('moment')
const getWaitMs = (lastMessage, currentMessage) => {
    let hasNoPreviousMessage = !lastMessage || moment(lastMessage.timestamp).isAfter(currentMessage.timestamp)
    let waitMs = hasNoPreviousMessage ? 0 : moment.duration(
        moment(currentMessage.timestamp).diff(moment(lastMessage.timestamp))
    ).asMilliseconds()
    return waitMs
}

const wait = waitMs => new Promise((resolve, _) => {
    setTimeout(resolve, waitMs)
})

const scheduler = (generator, sender, mapBeforeSend) => {
    const cloneObject = obj => JSON.parse(JSON.stringify(obj))

    const schedule = (lastMessage) => {
        let nextMessage = generator.next()
        let waitMs = getWaitMs(lastMessage, nextMessage)

        wait(waitMs)
            .then(() => sender.write(mapBeforeSend(cloneObject(nextMessage))))
            .then(() => schedule(nextMessage))
    }

    return {
        start: () => schedule(null)
    }
}


module.exports = scheduler