module.exports = {
    write: obj => new Promise((resolve, reject) => {
        console.log(`sent: ${obj.timestamp} ${obj.acceleration} ${obj.speed}`)
        resolve()
    })
}