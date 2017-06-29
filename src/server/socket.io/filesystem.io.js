import fs from 'fs';
import path from 'path';
import io from './io';
import logger from '../logger';

export default function filesystemIOListeners(socket){
    socket.on('filesystem.dir.list', (options)=>{
        
        if(!fs.existsSync(options.parentDir)){
            socket.emit('filesystem.error', { message:`${options.parentDir} does not exist.` })
        }
        const contents = fs.readdirSync(options.parentDir);
        const dirList = [];
        contents.forEach((name)=>{
            const info = fs.statSync(path.join(options.parentDir, name));
            const data = {
                name,
                ino: info.ino,
                atime: info.atime,
                birthtime: info.birthtime,
                size: info.size,
                isDirectory: info.isDirectory()
            };
            dirList.push(data);

        });
        socket.emit('filesystem.dir.ready', dirList);
    });
}