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

var _SettingsModel = require('../db/SettingsModel');

var _SettingsModel2 = _interopRequireDefault(_SettingsModel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var settingsModel = new _SettingsModel2.default(_IBDB2.default);
var API_ENDPOINTS = {
    settings: {
        category: {
            get: {
                params: ['category'],
                call: function call(category) {
                    return settingsModel.getAllForCategory(category);
                }
            },
            add: {
                params: ['category', 'key', 'value'],
                call: function call(category, key, value) {
                    return settingsModel.addSetting(category, key, value);
                }
            },
            update: {
                params: ['id', 'category', 'key', 'value'],
                call: function call(id, category, key, value) {
                    return settingsModel.updateSetting(id, category, key, value);
                }
            }
        }
    }
};
function apiIOListeners(socket) {
    var settingsModel = new _SettingsModel2.default(_IBDB2.default);
    socket.on('api.request', function (req) {
        if (!req.hasOwnProperty('id')) {
            apiError("Invalid request. No id provided.", req);
            return false;
        }

        var endpoints = req.endpoint.split('.');
        if (validateEndpoints(endpoints)) {
            var apiEndpoint = API_ENDPOINTS[endpoints[0]][endpoints[1]][endpoints[2]];

            if (validateEndpointParams(apiEndpoint.params, req.params, req)) {
                apiEndpoint.call.apply(apiEndpoint, _toConsumableArray(req.params)).then(function (data) {
                    var resp = {
                        id: req.id,
                        data: data,
                        request: req
                    };
                    socket.emit('api.response', data);
                }).catch(function (err) {
                    return apiError("There was an issue when calling the model action. Check server logs/debugging.", req);
                });
            }
        }
    });
}

function apiError(message, originalRequest) {
    socket.emit('api.error', {
        message: 'API IO ERROR: ' + message,
        originalRequest: originalRequest
    });
}

function validateEndpoints(endpoints, originalRequest) {
    if (endpoints.length !== 2) {
        apiError("endpoint format is invalid. Must be model.section.action.", originalRequest);
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

    if (!API_ENDPOINTS[endpoints[0]][endpoints[1]].hasOwnProperty(endpoints[1])) {
        apiError('endpoint action \'' + endpoints[2] + '\'is invalid. Must be model.section.action.', originalRequest);
        return false;
    }
    return true;
}

function validateEndpointParams(expectedParams, request) {
    if (expectedParams.length !== request.params.length) {
        apiError("the number of endpoint params does not match the expectation.", request);
        return false;
    }

    expectedParams.forEach(function (param) {
        if (!request.params.find(param)) {
            apiError('the endpoint param \'' + param + '\' was not found in the request.', request);
        }
        return false;
    });

    return true;
}