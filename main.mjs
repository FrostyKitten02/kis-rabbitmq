import {connect} from 'amqplib/callback_api.js';
import {plain} from 'amqplib/lib/credentials.js';
const username = 'guest';
const password = 'guest';

const opt = {
    credentials: plain(username, password)
};
const rabbitMqUrl = 'amqp://localhost:5672/';

async function createConnectionCallbackSendMessage(err, connection, msg, queue) {
     if (err) {
         console.log("Connection failed")
         console.error(err);
         return
     }

    await connection.createChannel((err, channel) => {
        sendMessageCallback(err, channel, msg, queue)
    });
    setTimeout( () => {
        console.warn("Closing connection")
        connection.close()
        process.exit(0)
        }, 100
    )
}

async function createConnectionCallbackListenForMessage(err, connection, queue) {
    if (err) {
        console.log("Connection failed")
        console.error(err);
        return
    }

    await connection.createChannel((err, channel) => {
        receiveMessageCallback(err, channel, queue)
    });
}



function sendMessageCallback(err, channel, msg, queue) {
    if (err) {
        console.log("Channel failed")
        console.error(err);
        return
    }

    channel.assertQueue(queue, {
        durable: false
    });

    console.log(" [x] Sending message to direct_queue: ", queue, " msg:", msg)
    channel.sendToQueue(queue, Buffer.from(msg));
}

function receiveMessageCallback(err, channel, queue) {
    if (err) {
        console.log("Channel failed")
        console.error(err);
        return
    }

    channel.assertQueue(queue, {
        durable: false
    });

    channel.consume(queue, function(msg) {
        console.log(" [x] Received %s from %s", msg.content.toString(), queue);
    }, { noAck: true }) //noAck: true means that the message will be deleted from the queue as soon as it is consumed
}

//direct_queue
function sendMessage(msg, queue) {
    connect(rabbitMqUrl, opt, async (err, connection) => {
        await createConnectionCallbackSendMessage(err, connection, msg, queue)
    })
}

function recieveMessage(queue) {
    connect(rabbitMqUrl, opt, async (err, connection) => {
       await createConnectionCallbackListenForMessage(err, connection, queue)
    })
}

const direct_queue = "test-direct"

export {
    sendMessage,
    recieveMessage,
    direct_queue
}