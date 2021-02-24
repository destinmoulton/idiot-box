"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var events_1 = __importDefault(require("events"));
var logger_1 = __importDefault(require("./logger"));
var emitter = new events_1["default"]();
emitter.on('uncaughtException', function (err) {
    logger_1["default"].error(err);
});
exports["default"] = emitter;
//# sourceMappingURL=eventBus.js.map