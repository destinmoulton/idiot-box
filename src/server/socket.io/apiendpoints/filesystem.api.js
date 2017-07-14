import FilesystemModel from '../../models/FilesystemModel';

const filesystemModel = new FilesystemModel();

const filesystem = {
    dir: {
        get: {
            params: ['path'],
            func: (pathToList)=> filesystemModel.getDirList(pathToList)
        }
    }
};

export default filesystem;