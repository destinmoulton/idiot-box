import fs from "fs";
import path from "path";
import mkdirp from "mkdirp";

import logger from "../logger";

import FilesModel from "./db/FilesModel";
import FileToEpisodeModel from "./db/FileToEpisodeModel";
import FileToMovieModel from "./db/FileToMovieModel";
import MoviesModel from "./db/MoviesModel";
import SettingsModel from "./db/SettingsModel";
import ShowSeasonEpisodesModel from "./db/ShowSeasonEpisodesModel";
export default class FilesystemModel {
    _filesModel: FilesModel;
    _fileToEpisodeModel: FileToEpisodeModel;
    _fileToMovieModel: FileToMovieModel;
    _moviesModel: MoviesModel;
    _settingsModel: SettingsModel;
    _showSeasonEpisodesModel: ShowSeasonEpisodesModel;
    constructor(models) {
        this._filesModel = models.filesModel;
        this._fileToEpisodeModel = models.fileToEpisodeModel;
        this._fileToMovieModel = models.fileToMovieModel;
        this._moviesModel = models.moviesModel;
        this._settingsModel = models.settingsModel;
        this._showSeasonEpisodesModel = models.showSeasonEpisodesModel;
    }

    async getDirList(basePath, fullPath) {
        if (!fs.existsSync(fullPath)) {
            throw new Error(
                `FilesystemModel :: getDirList :: ${fullPath} does not exist.`
            );
        }
        const contents = fs.readdirSync(fullPath);
        const dirList = [];
        let promisesToRun = [];
        return contents.map(async (filename) => {
            return await this._collateFileInformation(
                basePath,
                fullPath,
                filename
            );
        });
    }

    async _collateFileInformation(basePath, fullPath, filename) {
        const subpath = fullPath.slice(basePath.length + 1);

        const info = fs.statSync(path.join(fullPath, filename));
        const isDirectory = info.isDirectory();
        const fileData = {
            name: filename,
            atime: info.atime,
            birthtime: info.birthtime,
            size: info.size,
            isDirectory,
            assocData: {},
        };

        if (isDirectory) {
            return fileData;
        }

        const setting = await this._settingsModel.getSingleByCatAndVal(
            "directories",
            basePath
        );
        if (!setting.hasOwnProperty("id")) {
            return fileData;
        }
        const file = await this._filesModel.getSingleByDirectoryAndFilename(
            setting.id,
            subpath,
            filename
        );
        if (!file.hasOwnProperty("id")) {
            return fileData;
        }

        if (file.mediatype === "movie") {
            return await this._getMovieFileInfo(file, fileData);
        } else {
            return await this._getEpisodeFileInfo(file, fileData);
        }
    }

    /**
     * Get the movie file information for collation
     * @param object FilesModel file row.
     * @param object Object to append collation
     */
    async _getMovieFileInfo(file, fileCollate) {
        const fileToMovie = await this._fileToMovieModel.getSingleForFile(
            file.id
        );
        if (!fileToMovie.hasOwnProperty("movie_id")) {
            return fileCollate;
        }
        const movieInfo = await this._moviesModel.getSingle(
            fileToMovie.movie_id
        );
        const assocData = {
            movie_id: movieInfo.id,
            file_id: file.id,
            title: movieInfo.title,
            type: "movie",
            year: movieInfo.year,
        };
        fileCollate.assocData = assocData;
        return fileCollate;
    }

    /**
     * Get the episode-file information for collation.
     * @param Object FilesModel file row.
     * @param Object Object to append collation
     */
    async _getEpisodeFileInfo(file, fileCollate) {
        const fileToEpisode = await this._fileToEpisodeModel.getSingleForFile(
            file.id
        );
        if (!fileToEpisode.hasOwnProperty("episode_id")) {
            return fileCollate;
        }
        const episodeInfo = await this._showSeasonEpisodesModel.getSingle(
            fileToEpisode.episode_id
        );
        const assocData = {
            episode_id: episodeInfo.id,
            file_id: file.id,
            title: episodeInfo.title,
            type: "show",
        };
        fileCollate.assocData = assocData;
        return fileCollate;
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
    async moveInSetDir(sourceInfo, destInfo, destDirType) {
        const sourceSetting = await this._settingsModel.getSingleByID(
            sourceInfo.setting_id
        );
        const fullSourcePath = path.join(
            sourceSetting.value,
            sourceInfo.subpath,
            sourceInfo.filename
        );
        if (!fs.existsSync(fullSourcePath)) {
            throw new Error(
                `FilesystemModel :: moveInSetDir() :: source path ${fullSourcePath} does not exist`
            );
        }

        const destSetting = await this._settingsModel.getSingle(
            "directories",
            destDirType
        );
        const baseDestDir = destSetting.value;
        if (!fs.existsSync(baseDestDir)) {
            throw new Error(
                `FilesystemModel :: moveInSetDir() :: destination path ${baseDestDir} does not exist`
            );
        }

        const destPath = path.join(baseDestDir, destInfo.subpath);
        if (!fs.existsSync(destPath)) {
            if (!mkdirp.sync(destPath)) {
                throw new Error(
                    `FilesystemModel :: moveInSetDir() :: unable to make the destination dir ${destPath}`
                );
            }
        }

        const fullDestPath = path.join(destPath, destInfo.filename);
        fs.renameSync(fullSourcePath, fullDestPath);
        if (!fs.existsSync(fullDestPath)) {
            throw new Error(
                `FilesystemModel :: moveInSetDir() :: unable to move file '${fullSourcePath}' to '${fullDestPath}'`
            );
        }
        return {
            original_path: fullSourcePath,
            new_path: fullDestPath,
        };
    }

    /**
     * Perform a direct move (ie between setting dirs)
     * on multiple items (files or dirs);
     *
     * @param string sourcePath
     * @param string destPath
     * @param object itemsToRename
     */
    directMoveMultiple(sourcePath, destPath, itemsToRename) {
        let promisesToRun = [];

        const originalNames = Object.keys(itemsToRename);

        originalNames.forEach((sourceName) => {
            const cmd = this.directMoveSingle(
                sourcePath,
                destPath,
                sourceName,
                itemsToRename[sourceName]
            );
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
    directMoveSingle(sourcePath, destPath, sourceName, destName) {
        return new Promise((resolve, reject) => {
            const fullSource = path.join(sourcePath, sourceName);
            if (!fs.existsSync(fullSource)) {
                reject(
                    `FilesystemModel :: directMoveSingle() :: source does not exist '${fullSource}'`
                );
            }

            const fullDest = path.join(destPath, destName);
            fs.renameSync(fullSource, fullDest);
            if (!fs.existsSync(fullDest)) {
                reject(
                    `FilesystemModel :: directMoveSingle() :: unable to rename '${fullSource}' to ${fullDest}`
                );
            }
            resolve(fullDest);
        });
    }

    async trash(sourcePath, filenames) {
        if (!fs.existsSync(sourcePath)) {
            throw new Error(
                `FilesystemModel :: trash() :: sourcePath: ${sourcePath} does not exist.`
            );
        }

        const row = await this._settingsModel.getSingle("directories", "Trash");
        const trashPath = row.value;
        if (!fs.existsSync(trashPath)) {
            throw new Error(
                `FilesystemModel :: trash() :: trash directory: ${trashPath} does not exist.`
            );
        }

        let succeeded = [];
        let failures = [];
        filenames.forEach((filename) => {
            const origFilePath = path.join(sourcePath, filename);
            const trashFilePath = path.join(trashPath, filename);

            fs.renameSync(origFilePath, trashFilePath);
            succeeded.push(filename);
        });
        return {
            succeeded,
            failures,
        };
    }
}
