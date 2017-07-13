import FilesystemModel from '../../models/FilesystemModel';

const filesystemModel = new FilesystemModel();

export default filesystem = {
    dir: {
        get: {
            params: ['path'],
            func: (pathToList)=> filesystemModel.getDirList(pathToList)
        }
    }
};