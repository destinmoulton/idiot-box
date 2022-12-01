"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const express_1 = __importDefault(require("express"));
const express_basic_auth_1 = __importDefault(require("express-basic-auth"));
const app = (0, express_1.default)();
const IBDB_1 = __importDefault(require("./db/IBDB"));
const io_1 = require("./socket.io/io");
const logger_1 = __importDefault(require("./logger"));
const config_1 = __importDefault(require("./config"));
const PUBLIC_PATH = path_1.default.resolve(__dirname, "../public");
// Enable http basic auth
app.use((0, express_basic_auth_1.default)({ challenge: true, users: config_1.default.users, realm: "ibox" }));
app.use(express_1.default.static(PUBLIC_PATH));
// Allow all URI's; handle by react router
app.get("*", (0, express_basic_auth_1.default)({ challenge: true, users: config_1.default.users, realm: "ibox" }), (req, res) => {
    res.sendFile(path_1.default.join(PUBLIC_PATH, "/index.html"));
});
(async () => {
    try {
        await IBDB_1.default.connect(config_1.default);
        let server = app.listen(config_1.default.port, () => {
            logger_1.default.log("\n---------------------------------------");
            logger_1.default.log("Idiot Box Server running on Port " + config_1.default.port);
            logger_1.default.log("---------------------------------------");
        });
        (0, io_1.setupSocketIO)(server);
    }
    catch (err) {
        throw new Error(err);
    }
})();
//# sourceMappingURL=server.js.map