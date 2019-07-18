"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = apiIOListeners;

var _error = _interopRequireDefault(require("../error"));

var _logger = _interopRequireDefault(require("../logger"));

var _apiendpoints = _interopRequireDefault(require("./apiendpoints"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var localSocket = {};

function apiIOListeners(socket) {
  localSocket = socket;
  socket.on('api.request', function (req) {
    if (!req.hasOwnProperty('id')) {
      apiError("Invalid request. No id provided.", req);
      return false;
    }

    var endpoints = req.endpoint.split('.');

    if (validateEndpoints(endpoints, req)) {
      var apiEndpoint = _apiendpoints["default"][endpoints[0]][endpoints[1]][endpoints[2]];

      if (validateEndpointParams(apiEndpoint.params, req)) {
        var endpointParams = prepareEndpointParams(apiEndpoint.params, req.params);
        return apiEndpoint.func.apply(apiEndpoint, _toConsumableArray(endpointParams)).then(function (data) {
          var resp = {
            id: req.id,
            data: data,
            request: req
          };
          socket.emit('api.response', resp);
        })["catch"](function (err) {
          return apiError("MODEL ERROR :: " + err, req);
        });
      }
    }
  });
}

function apiError(message, originalRequest) {
  localSocket.emit('api.error', {
    message: "API IO ERROR :: ".concat(message),
    request: originalRequest
  });
}

function validateEndpoints(endpoints, originalRequest) {
  if (endpoints.length !== 3) {
    apiError("incorrect number of endpoints. Got ".concat(endpoints.length, ". Expecting model.section.action."), originalRequest);
    return false;
  }

  if (!_apiendpoints["default"].hasOwnProperty(endpoints[0])) {
    apiError("endpoint model '".concat(endpoints[0], "' is invalid. Must be model.section.action."), originalRequest);
    return false;
  }

  if (!_apiendpoints["default"][endpoints[0]].hasOwnProperty(endpoints[1])) {
    apiError("endpoint section '".concat(endpoints[1], "'is invalid. Must be model.section.action."), originalRequest);
    return false;
  }

  if (!_apiendpoints["default"][endpoints[0]][endpoints[1]].hasOwnProperty(endpoints[2])) {
    apiError("endpoint action '".concat(endpoints[2], "'is invalid. Must be model.section.action."), originalRequest);
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
      apiError("the endpoint param '".concat(param, "' was not found in the request."), request);
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