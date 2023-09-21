import ibdb from "../../db/IBDB";

import FilesModel from "../../models/db/FilesModel";
import SettingsModel from "../../models/db/SettingsModel";

const settingsModel = new SettingsModel(ibdb);
const filesModel = new FilesModel(ibdb);

const files = {
    recent_dirs: {
        get: {
            // Get recently used directories
            params: ["limit"],
            func: async (limit) => {
                return await filesModel.getRecentDirs(limit);
            },
        },
    },
};

export default files;
