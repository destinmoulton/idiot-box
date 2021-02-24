"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var eventBus_1 = __importDefault(require("../eventBus"));
function errorIOListeners(socket) {
    eventBus_1["default"].on('error', function (message) {
        socket.emit('error', { message: message });
    });
}
exports["default"] = errorIOListeners;
//# sourceMappingURL=error.io.js.map