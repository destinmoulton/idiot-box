
import path from 'path';

import ibdb from '../../db/IBDB';
import logger from '../../logger';

import FilesModel from './FilesModel';
import SettingsModel from './SettingsModel';

describe("FilesModel", ()=>{
    let settingsModel = {};
    let filesModel = {};
    beforeEach(() => {

        const dbConfig = {
            inMemory: true
        };

        const migConfig = {
            migrationsPath: path.resolve(__dirname, '../../../migrations')
        };

        return ibdb.connect(dbConfig)
            .then(() => {
                return ibdb._db.migrate(migConfig);
            })
            .then(()=>{
                filesModel = new FilesModel(ibdb);
                settingsModel = new SettingsModel(ibdb);
            });
    });

    afterEach(()=>{
        ibdb.close();
    });

    it("adds a file", ()=>{
        const filename = "testfilename.tst";
        const subpath = "test/path/here";
        const mediatype = "show";
        let setting_id = 0;
        expect.assertions(4);
        return settingsModel.addSetting("directories", "youtube", "/mnt/youtube")
            .then((setting)=>{
                setting_id = setting.id;
                return filesModel.addFile(setting_id, subpath, filename, mediatype);
            })
            .then((file)=>{
                expect(file.directory_setting_id).toBe(setting_id);
                expect(file.subpath).toBe(subpath);
                expect(file.filename).toBe(filename);
                expect(file.mediatype).toBe(mediatype);
            });
    });
});