import {connect} from 'amqplib/callback_api.js';
import {plain} from 'amqplib/lib/credentials.js';
import {createConnectionCallbackListenForMessage, createConnectionCallbackSendMessage} from "./direct-msg.mjs";
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

const direct_queue = "test-direct"

export {
    sendMessage,
    recieveMessage,
    direct_queue
}
