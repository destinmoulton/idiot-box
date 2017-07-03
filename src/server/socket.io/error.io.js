import bus from '../eventBus';
import io from './io';

export default function errorIOListeners(socket){
    bus.on('error', (message)=>{
        socket.emit('error', {message});
    });
}