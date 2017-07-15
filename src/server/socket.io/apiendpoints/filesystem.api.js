import ibdb from '../../db/IBDB';

import FilesystemModel from '../../models/FilesystemModel';
import SettingsModel from '../../models/db/SettingsModel';

const settingsModel = new SettingsModel(ibdb);
const filesystemModel = new FilesystemModel(settingsModel);

const filesystem = {
    dir: {
        get: {
            params: ['path'],
            func: (pathToList)=> filesystemModel.getDirList(pathToList)
        }
    },
    trash: {
        execute: {
            params: ['source_path', 'filenames'],
            func: (sourcePath, filenames)=> filesystemModel.trash(sourcePath, filenames)
        }
    }
};

export default filesystem;