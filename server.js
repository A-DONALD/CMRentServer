const logEvents = require('./logEvents');
const EventEmitter = require('events');

//create an instance of events
class MyEmitter extends EventEmitter { };
// initialize
const myEmitter = new MyEmitter();
// add the listener
myEmitter.on('log', (msg) => logEvents(msg));

setTimeout(() => {
    myEmitter.emit('log', 'Log event emitted!');
}, 4000);