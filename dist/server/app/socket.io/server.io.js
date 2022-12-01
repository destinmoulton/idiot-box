"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const os_1 = __importDefault(require("os"));
const path_1 = __importDefault(require("path"));
function serverIOListeners(socket) {
    socket.on('server.info.request', () => {
        const data = {
            hostname: os_1.default.hostname(),
            pathSeparator: path_1.default.sep
        };
        socket.emit('server.info.ready', data);
    });
}
exports.default = serverIOListeners;
//# sourceMappingURL=server.io.js.map