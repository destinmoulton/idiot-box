import fs from "fs";
import path from "path";
import has from "lodash";
const configFile = path.resolve(__dirname, "../../../config/config.json");
const CONFIG_OBJECT_PATHS = [
    "paths.images.base",
    "paths.images.shows",
    "paths.images.movies",
    "paths.db.migrations",
    "paths.db.sqlite",
    "trakt.client_id",
    "trakt.client_secret",
];
if (!fs.existsSync(configFile)) {
    console.error(`config.ts :: The config file does not exist. ${configFile}`);
    throw new Error(`config.ts :: The config file does not exist. ${configFile}`);
}
let conf = null;
try {
    let rawfile = fs.readFileSync(configFile, "utf-8");
    conf = JSON.parse(rawfile);
    validateJSON(conf);
    doesFileExist(path.join(conf.paths.images.base, conf.paths.images.shows));
    doesFileExist(path.join(conf.paths.images.base, conf.paths.images.movies));
    doesFileExist(conf.paths.db.migrations);
    doesFileExist(conf.paths.db.sqlite);
}
catch (err) {
    throw err;
}
export default conf;
function validateJSON(configJSON) {
    for (const propPath of CONFIG_OBJECT_PATHS) {
        try {
            if (!has(configJSON, propPath)) {
                throw new Error(`config.ts :: config error :: ${propPath} is not set`);
            }
        }
        catch (err) {
            throw err;
        }
    }
}
function doesFileExist(path) {
    if (!fs.existsSync(path)) {
        throw new Error(`config.ts :: config path ${path} does not exist in filesystem`);
    }
}
//# sourceMappingURL=config.js.map