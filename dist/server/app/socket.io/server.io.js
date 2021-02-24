"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var os_1 = __importDefault(require("os"));
var path_1 = __importDefault(require("path"));
function serverIOListeners(socket) {
    socket.on('server.info.request', function () {
        var data = {
            hostname: os_1["default"].hostname(),
            pathSeparator: path_1["default"].sep
        };
        socket.emit('server.info.ready', data);
    });
}
exports["default"] = serverIOListeners;
//# sourceMappingURL=server.io.js.map