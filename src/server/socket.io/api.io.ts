import error from "../error";
import logger from "../logger";

import APIendpoints from "./apiendpoints";

let localSocket: any = {};
export default async function apiIOListeners(socket) {
    localSocket = socket;
    socket.on("api.request", async (req) => {
        if (!req.hasOwnProperty("id")) {
            apiError("Invalid request. No id provided.", req);
            return false;
        }

        const endpoints = req.endpoint.split(".");
        if (validateEndpoints(endpoints, req)) {
            const apiEndpoint =
                APIendpoints[endpoints[0]][endpoints[1]][endpoints[2]];

            if (validateEndpointParams(apiEndpoint.params, req)) {
                const endpointParams = prepareEndpointParams(
                    apiEndpoint.params,
                    req.params
                );
                try {
                    const data = await apiEndpoint.func(...endpointParams);
                    console.log("api.io.ts data=", data);
                    const resp = {
                        id: req.id,
                        data,
                        request: req,
                    };
                    socket.emit("api.response", resp);
                } catch (err) {
                    apiError("MODEL ERROR :: " + err, req);
                }
            }
        }
    });
}

function apiError(message, originalRequest) {
    localSocket.emit("api.error", {
        message: `API IO ERROR :: ${message}`,
        request: originalRequest,
    });
}

function validateEndpoints(endpoints, originalRequest) {
    if (endpoints.length !== 3) {
        apiError(
            `incorrect number of endpoints. Got ${endpoints.length}. Expecting model.section.action.`,
            originalRequest
        );
        return false;
    }

    if (!APIendpoints.hasOwnProperty(endpoints[0])) {
        apiError(
            `endpoint model '${endpoints[0]}' is invalid. Must be model.section.action.`,
            originalRequest
        );
        return false;
    }

    if (!APIendpoints[endpoints[0]].hasOwnProperty(endpoints[1])) {
        apiError(
            `endpoint section '${endpoints[1]}'is invalid. Must be model.section.action.`,
            originalRequest
        );
        return false;
    }

    if (
        !APIendpoints[endpoints[0]][endpoints[1]].hasOwnProperty(endpoints[2])
    ) {
        apiError(
            `endpoint action '${endpoints[2]}'is invalid. Must be model.section.action.`,
            originalRequest
        );
        return false;
    }
    return true;
}

function validateEndpointParams(expectedParams, request) {
    if (expectedParams.length !== Object.keys(request.params).length) {
        apiError(
            "the number of endpoint params does not match the expectation.",
            request
        );
        return false;
    }

    expectedParams.forEach((param) => {
        if (!request.params.hasOwnProperty(param)) {
            apiError(
                `the endpoint param '${param}' was not found in the request.`,
                request
            );
        }
        return false;
    });

    return true;
}

function prepareEndpointParams(expectedParams, providedParams) {
    let paramArr = [];
    expectedParams.forEach((param) => {
        paramArr.push(providedParams[param]);
    });
    return paramArr;
}
