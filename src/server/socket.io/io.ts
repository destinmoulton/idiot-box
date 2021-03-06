import http from 'http';
import socketio from 'socket.io';

import logger from '../logger';

import apiIOListeners from './api.io';

import serverIOListeners from './server.io';

let io = {}
export function setupSocketIO(server){
    io = socketio.listen(server, { path: '/socket.io'});
    setupListeners(io);
}

function setupListeners(io){
    io.on('connection', (socket)=>{
        logger.info("socket.io :: client connected");
        apiIOListeners(socket);
        serverIOListeners(socket);
    });
}

export default io;