import fs from "fs";
import path from "path";

const configFile = path.resolve("config/config.json");

if (!fs.existsSync(configFile)) {
    throw new Error("The config file does not exist. " + configFile);
}

let rawfile = fs.readFileSync(configFile, "utf-8");

export default JSON.parse(rawfile);
