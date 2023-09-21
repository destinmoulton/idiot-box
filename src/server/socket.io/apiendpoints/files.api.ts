import path from "path";

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
                const dirs = await filesModel.getRecentDirs(limit);

                const ret = [];
                for (const dir of dirs) {
                    const set = await settingsModel.getSingleByID(dir.directory_setting_id);
                    const full_dir = path.join(set.value, dir.subpath);
                    ret.push({path: full_dir});
                }

                return ret;
            },
        },
    },
};

export default files;
