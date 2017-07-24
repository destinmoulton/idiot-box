import fs from 'fs';
import path from 'path';
import mkdirp from 'mkdirp';

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

    /**
     * 
     * sourceInfo:
     *     setting_id
     *     subpath
     *     filename
     * 
     * destInfo:
     *     setting_id
     *     subpath
     *     filename
     * 
     * @param object sourceInfo 
     * @param object destInfo 
     */
    move(sourceInfo, destInfo, destDirType){
        return this._settingsModel.getSingleByID(sourceInfo.setting_id)
                .then((sourceSetting)=>{
                    const fullSourcePath = path.join(sourceSetting.value, sourceInfo.subpath, sourceInfo.filename);
                    if (!fs.existsSync(fullSourcePath)) {
                        return Promise.reject(`FilesystemModel :: move() :: source path ${fullSourcePath} does not exist`);
                    }

                    return this._settingsModel.getSingle("directories", destDirType)
                            .then((destSetting)=>{
                                const baseDestDir = destSetting.value;
                                if (!fs.existsSync(baseDestDir)) {
                                    return Promise.reject(`FilesystemModel :: move() :: destination path ${baseDestDir} does not exist`);
                                }

                                const destPath = path.join(baseDestDir, destInfo.subpath);
                                if(!fs.existsSync(destPath)){
                                    if(!mkdirp.sync(destPath)){
                                        return Promise.reject(`FilesystemModel :: move() :: unable to make the destination dir ${destPath}`);
                                    }
                                }

                                const fullDestPath = path.join(destPath, destInfo.filename);
                                fs.renameSync(fullSourcePath, fullDestPath);
                                if(!fs.existsSync(fullDestPath)){
                                    return Promise.reject(`FilesystemModel :: move() :: unable to move file '${fullSourcePath}' to '${fullDestPath}'`)
                                }
                                return {
                                    original_path: fullSourcePath,
                                    new_path: fullDestPath
                                };
                            });
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