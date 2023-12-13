import {makeConnection} from "../main.mjs";

function recievePublishedMessage(exchange) {
    makeConnection((err, connection) => {
        listenForPublishedMessageCallback(err, connection, exchange)
    })
}

function listenForPublishedMessageCallback(err, connection, exchange) {
    if (err) {
        console.log("Error connecting")
        console.error(err)
        return
    }

    connection.createChannel((err2, channel) => {
        listenForMessages(err2, channel, exchange)
    });
}


function listenForMessages(err, channel, exchange) {
    if (err) {
        console.log("Error creating channel")
        console.error(err)
        return
    }

    channel.assertExchange(exchange, 'fanout', {
        durable: false
    });

    channel.assertQueue('',
        {
            exclusive: true
        },
        function(queueErr, q) {
            if (queueErr) {
                console.log("Error connecting")
                console.error(queueErr)
                return
            }
            console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q.queue);
            channel.bindQueue(q.queue, exchange, '');//empty string means that we don't care about what queue we are binding to

            channel.consume(q.queue, function(msg) {
                if(msg.content) {
                    console.log(" [x] %s", msg.content.toString());
                }
            }, {
                noAck: true
            });
        });
}

function publishMessage(msg, exchange) {
    makeConnection((err, connection) => {
        publishMessageCallback(err, connection, exchange, msg)
    })
}

function publishMessageCallback(err, connection, exhange, msg) {
    if (err) {
        console.log("Error connecting")
        console.error(err)
        return
    }

    connection.createChannel((err2, channel) => {
        publishMessageToExchange(err2, channel, msg, exhange)
    })
    setTimeout(function() {
        connection.close()
        process.exit(0)
    }, 500)
}

function publishMessageToExchange(err, channel, msg, exchange) {
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
    publishMessage,
    recievePublishedMessage
}