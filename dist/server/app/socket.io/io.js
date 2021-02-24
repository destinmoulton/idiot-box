"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.setupSocketIO = void 0;
var socket_io_1 = __importDefault(require("socket.io"));
var logger_1 = __importDefault(require("../logger"));
var api_io_1 = __importDefault(require("./api.io"));
var server_io_1 = __importDefault(require("./server.io"));
var io = {};
function setupSocketIO(server) {
    io = socket_io_1["default"].listen(server, { path: '/socket.io' });
    setupListeners(io);
}
exports.setupSocketIO = setupSocketIO;
function setupListeners(io) {
    io.on('connection', function (socket) {
        logger_1["default"].info("socket.io :: client connected");
        api_io_1["default"](socket);
        server_io_1["default"](socket);
    });
}
exports["default"] = io;
//# sourceMappingURL=io.js.map