"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = __importDefault(require("events"));
const logger_1 = __importDefault(require("./logger"));
const emitter = new events_1.default();
emitter.on('uncaughtException', function (err) {
    logger_1.default.error(err);
});
exports.default = emitter;
//# sourceMappingURL=eventBus.js.map