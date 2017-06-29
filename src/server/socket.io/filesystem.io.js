import fs from 'fs';
import path from 'path';
import io from './io';
import logger from '../logger';

export default function filesystemIOListeners(socket){
    socket.on('filesystem.dir.list', (options)=>{
        
        if(!fs.existsSync(options.path)){
            socket.emit('filesystem.error', { message:`${options.path} does not exist.` })
        }
        const contents = fs.readdirSync(options.path);
        const dirList = [];
        contents.forEach((name)=>{
            const info = fs.statSync(path.join(options.path, name));
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