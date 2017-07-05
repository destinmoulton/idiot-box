'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = apiIOListeners;

var _error = require('../error');

var _error2 = _interopRequireDefault(_error);

var _logger = require('../logger');

var _logger2 = _interopRequireDefault(_logger);

var _IBDB = require('../db/IBDB');

var _IBDB2 = _interopRequireDefault(_IBDB);

var _FilesystemModel = require('../db/FilesystemModel');

var _FilesystemModel2 = _interopRequireDefault(_FilesystemModel);

var _SettingsModel = require('../db/SettingsModel');

var _SettingsModel2 = _interopRequireDefault(_SettingsModel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var filesystemModel = new _FilesystemModel2.default();
var settingsModel = new _SettingsModel2.default(_IBDB2.default);
var API_ENDPOINTS = {
    filesystem: {
        dir: {
            get: {
                params: ['path'],
                func: function func(path) {
                    return filesystemModel.getDirList(path);
                }
            }
        }
    },
    settings: {
        category: {
            get: {
                params: ['category'],
                func: function func(category) {
                    return settingsModel.getAllForCategory(category);
                }
            },
            add: {
                params: ['category', 'key', 'value'],
                func: function func(category, key, value) {
                    return settingsModel.addSetting(category, key, value);
                }
            },
            update: {
                params: ['id', 'category', 'key', 'value'],
                func: function func(id, category, key, value) {
                    return settingsModel.updateSetting(id, category, key, value);
                }
            }
        }
    }
};

var localSocket = {};
function apiIOListeners(socket) {
    localSocket = socket;
    var settingsModel = new _SettingsModel2.default(_IBDB2.default);
    socket.on('api.request', function (req) {
        if (!req.hasOwnProperty('id')) {
            apiError("Invalid request. No id provided.", req);
            return false;
        }

        var endpoints = req.endpoint.split('.');
        if (validateEndpoints(endpoints, req)) {
            var apiEndpoint = API_ENDPOINTS[endpoints[0]][endpoints[1]][endpoints[2]];

            if (validateEndpointParams(apiEndpoint.params, req)) {
                var endpointParams = prepareEndpointParams(apiEndpoint.params, req.params);
                return apiEndpoint.func.apply(apiEndpoint, _toConsumableArray(endpointParams)).then(function (data) {
                    var resp = {
                        id: req.id,
                        data: data,
                        request: req
                    };
                    socket.emit('api.response', resp);
                }).catch(function (err) {
                    return apiError("There was an issue when calling the model action. Check server logs/debugging.", req);
                });
            }
        }
    });
}

function apiError(message, originalRequest) {
    localSocket.emit('api.error', {
        message: 'API IO ERROR: ' + message,
        originalRequest: originalRequest
    });
}

function validateEndpoints(endpoints, originalRequest) {
    if (endpoints.length !== 3) {
        apiError('incorrect number of endpoints. Got ' + endpoints.length + '. Expecting model.section.action.', originalRequest);
        return false;
    }

    if (!API_ENDPOINTS.hasOwnProperty(endpoints[0])) {
        apiError('endpoint model \'' + endpoints[0] + '\' is invalid. Must be model.section.action.', originalRequest);
        return false;
    }

    if (!API_ENDPOINTS[endpoints[0]].hasOwnProperty(endpoints[1])) {
        apiError('endpoint section \'' + endpoints[1] + '\'is invalid. Must be model.section.action.', originalRequest);
        return false;
    }

    if (!API_ENDPOINTS[endpoints[0]][endpoints[1]].hasOwnProperty(endpoints[2])) {
        apiError('endpoint action \'' + endpoints[2] + '\'is invalid. Must be model.section.action.', originalRequest);
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
            apiError('the endpoint param \'' + param + '\' was not found in the request.', request);
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