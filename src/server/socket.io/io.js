import http from 'http';
import socketio from 'socket.io';

import logger from '../logger';

import settingsIOListeners from './settings.io';
import filesystemIOListeners from './filesystem.io';

let io = {}
export function setupSocketIO(server){
    io = socketio.listen(server, { path: '/socket.io'});
    setupListeners(io);
}

function setupListeners(io){
    io.on('connection', (socket)=>{
        logger.info("socket.io :: client connected");
        settingsIOListeners(socket);
        filesystemIOListeners(socket);
    });
}

export default io;