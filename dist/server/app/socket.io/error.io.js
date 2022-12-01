"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const eventBus_1 = __importDefault(require("../eventBus"));
function errorIOListeners(socket) {
    eventBus_1.default.on('error', (message) => {
        socket.emit('error', { message });
    });
}
exports.default = errorIOListeners;
//# sourceMappingURL=error.io.js.map