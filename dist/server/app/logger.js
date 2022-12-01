"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Logger {
    log(...args) {
        console.log(...args);
    }
    error(...args) {
        console.error(...args);
    }
    info(...args) {
        console.info(...args);
    }
}
exports.default = new Logger();
//# sourceMappingURL=logger.js.map