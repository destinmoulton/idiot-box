"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.doesErrorExist = void 0;
var eventBus_1 = __importDefault(require("./eventBus"));
var errors = [];
eventBus_1["default"].on("error", function (msg) {
    errors.push(msg);
    //logger.error("ERROR::"+msg);
});
function error(message) {
    errors.push(message);
    eventBus_1["default"].emit("error", message);
}
exports["default"] = error;
function doesErrorExist(msg) {
    return errors.includes(msg);
}
exports.doesErrorExist = doesErrorExist;
//# sourceMappingURL=error.js.map