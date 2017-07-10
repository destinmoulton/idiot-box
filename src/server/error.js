import bus from './eventBus';
import logger from './logger';

let errors = [];
bus.on("error", (msg)=>{
    errors.push(msg);
    //logger.error("ERROR::"+msg);
});

export default function error(message){
    errors.push(message);
    bus.emit("error", message);
}

export function doesErrorExist(msg){
    return errors.includes(msg);
}