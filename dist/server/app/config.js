"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const lodash_1 = __importDefault(require("lodash"));
const configFile = path_1.default.resolve(__dirname, "../../../config/config.json");
const CONFIG_OBJECT_PATHS = [
    "paths.images.base",
    "paths.images.shows",
    "paths.images.movies",
    "paths.db.migrations",
    "paths.db.sqlite",
    "trakt.client_id",
    "trakt.client_secret",
];
if (!fs_1.default.existsSync(configFile)) {
    console.error(`config.ts :: The config file does not exist. ${configFile}`);
    throw new Error(`config.ts :: The config file does not exist. ${configFile}`);
}
let conf = null;
try {
    let rawfile = fs_1.default.readFileSync(configFile, "utf-8");
    conf = JSON.parse(rawfile);
    validateJSON(conf);
    doesFileExist(path_1.default.join(conf.paths.images.base, conf.paths.images.shows));
    doesFileExist(path_1.default.join(conf.paths.images.base, conf.paths.images.movies));
    doesFileExist(conf.paths.db.migrations);
    doesFileExist(conf.paths.db.sqlite);
}
catch (err) {
    throw err;
}
exports.default = conf;
function validateJSON(configJSON) {
    for (const propPath of CONFIG_OBJECT_PATHS) {
        try {
            if (!(0, lodash_1.default)(configJSON, propPath)) {
                throw new Error(`config.ts :: config error :: ${propPath} is not set`);
            }
        }
        catch (err) {
            throw err;
        }
    }
}
function doesFileExist(path) {
    if (!fs_1.default.existsSync(path)) {
        throw new Error(`config.ts :: config path ${path} does not exist in filesystem`);
    }
}
//# sourceMappingURL=config.js.map