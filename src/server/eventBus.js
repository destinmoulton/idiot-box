import EventEmitter from 'events';

import logger from './logger';
const emitter = new EventEmitter();

emitter.on('uncaughtException', function (err) {
    logger.error(err);
});

export default emitter;