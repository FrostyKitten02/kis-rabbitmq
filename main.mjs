import {connect} from 'amqplib/callback_api.js';
import {plain} from 'amqplib/lib/credentials.js';
import {createConnectionCallbackListenForMessage, createConnectionCallbackSendMessage} from "./direct/direct-msg.mjs";
import {listenForPublishedMessageCallback, publishMessageCallback} from "./publish-subscribe.mjs";
const username = 'guest';
const password = 'guest';

const opt = {
    credentials: plain(username, password)
};
const rabbitMqUrl = 'amqp://localhost:5672/';

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


function publishMessage(msg, exchange) {
    connect(rabbitMqUrl, opt, (err, connection) => {
       publishMessageCallback(err, connection, exchange, msg)
    })
}


function recievePublishedMessage(exchange) {
    connect(rabbitMqUrl, opt, (err, connection) => {
        listenForPublishedMessageCallback(err, connection, exchange)
    })
}

const directQueue = "test-direct"
const exchangeName = "logs"


export {
    sendMessage,
    recieveMessage,
    directQueue,
    exchangeName,
    recievePublishedMessage,
    publishMessage
}
