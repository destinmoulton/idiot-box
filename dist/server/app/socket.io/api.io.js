"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var apiendpoints_1 = __importDefault(require("./apiendpoints"));
var localSocket = {};
function apiIOListeners(socket) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            localSocket = socket;
            socket.on("api.request", function (req) { return __awaiter(_this, void 0, void 0, function () {
                var endpoints, apiEndpoint, endpointParams, data, resp, err_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!req.hasOwnProperty("id")) {
                                apiError("Invalid request. No id provided.", req);
                                return [2 /*return*/, false];
                            }
                            endpoints = req.endpoint.split(".");
                            if (!validateEndpoints(endpoints, req)) return [3 /*break*/, 4];
                            apiEndpoint = apiendpoints_1["default"][endpoints[0]][endpoints[1]][endpoints[2]];
                            if (!validateEndpointParams(apiEndpoint.params, req)) return [3 /*break*/, 4];
                            endpointParams = prepareEndpointParams(apiEndpoint.params, req.params);
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, apiEndpoint.func.apply(apiEndpoint, endpointParams)];
                        case 2:
                            data = _a.sent();
                            resp = {
                                id: req.id,
                                data: data,
                                request: req
                            };
                            socket.emit("api.response", resp);
                            return [3 /*break*/, 4];
                        case 3:
                            err_1 = _a.sent();
                            apiError("MODEL ERROR :: " + err_1, err_1.stack);
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            }); });
            return [2 /*return*/];
        });
    });
}
exports["default"] = apiIOListeners;
function apiError(message, originalRequest) {
    localSocket.emit("api.error", {
        message: "API IO ERROR :: " + message,
        request: originalRequest
    });
}
function validateEndpoints(endpoints, originalRequest) {
    if (endpoints.length !== 3) {
        apiError("incorrect number of endpoints. Got " + endpoints.length + ". Expecting model.section.action.", originalRequest);
        return false;
    }
    if (!apiendpoints_1["default"].hasOwnProperty(endpoints[0])) {
        apiError("endpoint model '" + endpoints[0] + "' is invalid. Must be model.section.action.", originalRequest);
        return false;
    }
    if (!apiendpoints_1["default"][endpoints[0]].hasOwnProperty(endpoints[1])) {
        apiError("endpoint section '" + endpoints[1] + "'is invalid. Must be model.section.action.", originalRequest);
        return false;
    }
    if (!apiendpoints_1["default"][endpoints[0]][endpoints[1]].hasOwnProperty(endpoints[2])) {
        apiError("endpoint action '" + endpoints[2] + "'is invalid. Must be model.section.action.", originalRequest);
        return false;
    }
    return true;
}
function validateEndpointParams(expectedParams, request) {
    if (expectedParams.length !== Object.keys(request.params).length) {
        apiError("the number of endpoint params does not match the expectation.", request);
        return false;
    }
    expectedParams.forEach(function (param) {
        if (!request.params.hasOwnProperty(param)) {
            apiError("the endpoint param '" + param + "' was not found in the request.", request);
        }
        return false;
    });
    return true;
}
function prepareEndpointParams(expectedParams, providedParams) {
    var paramArr = [];
    expectedParams.forEach(function (param) {
        paramArr.push(providedParams[param]);
    });
    return paramArr;
}
//# sourceMappingURL=api.io.js.map