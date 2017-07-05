import fs from 'fs';
import path from 'path';

export default class FilesystemModel {
    getDirList(path){
        return new Promise((resolve, reject)=>{
            if (!fs.existsSync(path)) {
                reject(`FilesystemModel Error: ${path} does not exist.`);
            }
            const contents = fs.readdirSync(path);
            const dirList = [];
            contents.forEach((name) => {
                const info = fs.statSync(path.join(path, name));
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
            resolve(dirList);
        });
    }
}