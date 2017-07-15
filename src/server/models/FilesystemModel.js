import fs from 'fs';
import path from 'path';

export default class FilesystemModel {
    constructor(settingsModel){
        this._settingsModel = settingsModel;
    }

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

    trash(sourcePath, filenames){
        return new Promise((resolve, reject)=>{
            if (!fs.existsSync(sourcePath)) {
                reject(`FilesystemModel :: trash() :: sourcePath: ${sourcePath} does not exist.`);
            }

            return this._settingsModel.getSingle("directories", "Trash")
                .then((row)=>{
                    const trashPath = row.value;
                    if (!fs.existsSync(trashPath)) {
                        reject(`FilesystemModel :: trash() :: trash directory: ${trashPath} does not exist.`);
                    }

                    let succeeded = [];
                    let failures = [];
                    filenames.forEach((filename)=>{
                        const origFilePath = path.join(sourcePath, filename);
                        const trashFilePath = path.join(trashPath, filename);
                        
                        if(fs.renameSync(origFilePath, trashFilePath)){
                            succeeded.push(filename);
                        } else {
                            failures.push(filename);
                        }
                    });
                    resolve({
                        succeeded,
                        failures
                    });
                })
                .catch((err)=>{
                    reject(err);
                });
        });
    }
}