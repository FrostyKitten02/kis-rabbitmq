import {exchange} from "./main.mjs";


function publishMessageCallback(err, connection, exhange, msg) {
    if (err) {
        console.log("Error connecting")
        console.error(err)
        return
    }

    connection.createChannel((err2, channel) => {
        publihsMessageToExchange(err2, channel, msg, exchange)
    })
    setTimeout(function() {
        connection.close()
        process.exit(0)
    }, 500)
}

function publihsMessageToExchange(err, channel, msg, exchange) {
    if (err) {
        console.log("Error creating channel")
        console.error(err)
        return
    }

    channel.assertExchange(exchange, 'fanout', {
        durable: false
    });
    channel.publish(exchange, '', Buffer.from(msg))//empty string means that we don't want to send to any specific queue
    console.log(" [x] Sent %s", msg)
}



export {
    publishMessageCallback
}