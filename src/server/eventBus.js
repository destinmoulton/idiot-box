import EventEmitter from 'events';
const emitter = new EventEmitter();

emitter.on('uncaughtException', function (err) {
    console.error(err);
});

export default emitter;