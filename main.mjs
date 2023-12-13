import {connect} from 'amqplib/callback_api.js';
import {plain} from 'amqplib/lib/credentials.js';
const username = 'guest';
const password = 'guest';

const opt = {
    credentials: plain(username, password)
};
const rabbitMqUrl = 'amqp://localhost:5672/';

function makeConnection(callback) {
    connect(rabbitMqUrl, opt, callback);
}

const directQueue = "test-direct"
const exchangeName = "logs"

export {
    directQueue,
    exchangeName,
    makeConnection
}
