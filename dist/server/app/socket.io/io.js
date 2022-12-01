"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSocketIO = void 0;
const socket_io_1 = require("socket.io");
const logger_1 = __importDefault(require("../logger"));
const api_io_1 = __importDefault(require("./api.io"));
const server_io_1 = __importDefault(require("./server.io"));
let io = {};
function setupSocketIO(server) {
    //io = Server.listen(server, { path: '/socket.io'});
    io = new socket_io_1.Server(server, { path: '/socket.io' });
    setupListeners(io);
}
exports.setupSocketIO = setupSocketIO;
function setupListeners(io) {
    io.on('connection', (socket) => {
        logger_1.default.info("socket.io :: client connected");
        (0, api_io_1.default)(socket);
        (0, server_io_1.default)(socket);
    });
}
exports.default = io;
//# sourceMappingURL=io.js.map