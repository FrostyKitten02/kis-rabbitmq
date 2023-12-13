import {connect} from 'amqplib/callback_api.js';
import {plain} from 'amqplib/lib/credentials.js';
import {createConnectionCallbackListenForMessage, createConnectionCallbackSendMessage} from "./direct/direct-msg.mjs";
import {publishMessageCallback} from "./publish-subscribe.mjs";
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
        if (err) {
            console.log("Error connecting")
            console.error(err)
            return
        }

        connection.createChannel(function(cErr, channel) {
            if (cErr) {
                console.log("Error creating channel")
                console.error(cErr)
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
        });
    })
}

const directQueue = "test-direct"
const exchange = "logs"


export {
    sendMessage,
    recieveMessage,
    directQueue,
    exchange,
    recievePublishedMessage,
    publishMessage
}
