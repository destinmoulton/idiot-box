import fs from 'fs';
import path from 'path';
import mkdirp from 'mkdirp';

import logger from '../logger';

export default class FilesystemModel {
    constructor(models){
        this._filesModel = models.filesModel;
        this._fileToEpisodeModel = models.fileToEpisodeModel;
        this._fileToMovieModel = models.fileToMovieModel;
        this._moviesModel = models.moviesModel;
        this._settingsModel = models.settingsModel;
        this._showSeasonEpisodesModel = models.showSeasonEpisodesModel;
    }

    getDirList(basePath, fullPath){
        if (!fs.existsSync(fullPath)) {
            return Promise.reject(`FilesystemModel Error: ${fullPath} does not exist.`);
        }
        const contents = fs.readdirSync(fullPath);
        const dirList = [];
        let promisesToRun = [];
        contents.forEach((filename) => {
            promisesToRun.push(this._collateFileInformation(basePath, fullPath, filename));
        });
        return Promise.all(promisesToRun);
    }

    _collateFileInformation(basePath, fullPath, filename){
        const subpath = fullPath.slice(basePath.length + 1);

        const info = fs.statSync(path.join(fullPath, filename));
        const isDirectory = info.isDirectory();
        const fileData = {
            name: filename,
            atime: info.atime,
            birthtime: info.birthtime,
            size: info.size,
            isDirectory,
            assocData: {}
        };

        if(isDirectory){
            return Promise.resolve(fileData);
        }

        return this._settingsModel.getSingleByCatAndVal("directories", basePath)
                .then((setting)=>{
                    if(!setting.hasOwnProperty('id')){
                        return Promise.resolve(fileData);
                    }
                    return this._filesModel.getSingleByDirectoryAndFilename(setting.id, subpath, filename)
                })
                .then((file)=>{
                    if(!file.hasOwnProperty('id')){
                        return Promise.resolve(fileData);
                    }
                    
                    if(file.mediatype === "movie"){
                        return this._fileToMovieModel.getSingleForFile(file.id)
                                .then((fileToMovie)=>{
                                    if(!fileToMovie.hasOwnProperty('movie_id')){
                                        return Promise.resolve(fileData);
                                    }
                                    return this._moviesModel.getSingle(fileToMovie.movie_id);
                                })
                                .then((movieInfo)=>{
                                    const assocData = {
                                        movie_id: movieInfo.id,
                                        file_id: file.id,
                                        title: movieInfo.title,
                                        type: "movie"
                                    }
                                    fileData.assocData = assocData;
                                    return Promise.resolve(fileData);
                                })
                    } else {
                        return this._fileToEpisodeModel.getSingleForFile(file.id)
                                .then((fileToEpisode)=>{
                                    if(!fileToEpisode.hasOwnProperty('episode_id')){
                                        return Promise.resolve(fileData);
                                    }
                                    return this._showSeasonEpisodesModel.getSingle(fileToEpisode.episode_id);
                                })
                                .then((episodeInfo)=>{
                                    
                                    const assocData = {
                                        episode_id: episodeInfo.id,
                                        file_id: file.id,
                                        title: episodeInfo.title,
                                        type: "show"
                                    };
                                    fileData.assocData = assocData;
                                    return Promise.resolve(fileData);
                                });
                    }
                })
    }

    /**
     * 
     * sourceInfo:
     *     setting_id
     *     subpath
     *     filename
     * 
     * destInfo:
     *     subpath
     *     filename
     * 
     * @param object sourceInfo 
     * @param object destInfo 
     */
    moveInSetDir(sourceInfo, destInfo, destDirType){
        return this._settingsModel.getSingleByID(sourceInfo.setting_id)
                .then((sourceSetting)=>{
                    const fullSourcePath = path.join(sourceSetting.value, sourceInfo.subpath, sourceInfo.filename);
                    if (!fs.existsSync(fullSourcePath)) {
                        return Promise.reject(`FilesystemModel :: moveInSetDir() :: source path ${fullSourcePath} does not exist`);
                    }

                    return this._settingsModel.getSingle("directories", destDirType)
                            .then((destSetting)=>{
                                const baseDestDir = destSetting.value;
                                if (!fs.existsSync(baseDestDir)) {
                                    return Promise.reject(`FilesystemModel :: moveInSetDir() :: destination path ${baseDestDir} does not exist`);
                                }

                                const destPath = path.join(baseDestDir, destInfo.subpath);
                                if(!fs.existsSync(destPath)){
                                    if(!mkdirp.sync(destPath)){
                                        return Promise.reject(`FilesystemModel :: moveInSetDir() :: unable to make the destination dir ${destPath}`);
                                    }
                                }

                                const fullDestPath = path.join(destPath, destInfo.filename);
                                fs.renameSync(fullSourcePath, fullDestPath);
                                if(!fs.existsSync(fullDestPath)){
                                    return Promise.reject(`FilesystemModel :: moveInSetDir() :: unable to move file '${fullSourcePath}' to '${fullDestPath}'`)
                                }
                                return {
                                    original_path: fullSourcePath,
                                    new_path: fullDestPath
                                };
                            });
                });
    }

    /**
     * Perform a direct move (ie between setting dirs)
     * on multiple items (files or dirs);
     * 
     * @param string sourcePath 
     * @param string destPath 
     * @param object itemsToRename 
     */
    directMoveMultiple(sourcePath, destPath, itemsToRename){
        let promisesToRun = [];

        const originalNames = Object.keys(itemsToRename);

        originalNames.forEach((sourceName)=>{
            const cmd = this.directMoveSingle(sourcePath, destPath, sourceName, itemsToRename[sourceName]);
            promisesToRun.push(cmd);
        });

        return Promise.all(promisesToRun);
    }

    /**
     * Perform a "direct" move -- possibly between two
     * setting directories.
     * 
     * To move within a setting directory, use moveInSetDir()
     * 
     * @param string sourcePath
     * @param string destPath
     * @param string sourceName
     * @param string destName
     */
    directMoveSingle(sourcePath, destPath, sourceName, destName){
        return new Promise((resolve, reject)=>{
            const fullSource = path.join(sourcePath, sourceName);
            if(!fs.existsSync(fullSource)){
                reject(`FilesystemModel :: directMoveSingle() :: source does not exist '${fullSource}'`)
            }

            const fullDest = path.join(destPath, destName);
            fs.renameSync(fullSource, fullDest);
            if(!fs.existsSync(fullDest)){
                reject(`FilesystemModel :: directMoveSingle() :: unable to rename '${fullSource}' to ${fullDest}`)
            }
            resolve(fullDest);
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