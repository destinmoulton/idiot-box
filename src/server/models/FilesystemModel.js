import fs from 'fs';
import path from 'path';

export default class FilesystemModel {
    getDirList(pathToList){
        return new Promise((resolve, reject)=>{
            if (!fs.existsSync(pathToList)) {
                reject(`FilesystemModel Error: ${pathToList} does not exist.`);
            }
            const contents = fs.readdirSync(pathToList);
            const dirList = [];
            contents.forEach((name) => {
                const info = fs.statSync(path.join(pathToList, name));
                const data = {
                    name,
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