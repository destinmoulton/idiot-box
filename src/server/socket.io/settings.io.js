import io from './io';
import logger from '../logger';

export default function settingsIOListeners(socket){
    socket.on('settings.test', (msg)=>{
        logger.debug(msg);
    });
}