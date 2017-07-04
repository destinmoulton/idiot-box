import error from '../error';
import logger from '../logger';
import ibdb from '../db/IBDB';


import SettingsModel from '../db/SettingsModel';
const settingsModel = new SettingsModel(ibdb);
const API_ENDPOINTS = {
    settings: {
        category: {
            get: {
                params: ['category'],
                call: (category)=> settingsModel.getAllForCategory(category)
            },
            add: {
                params: ['category', 'key', 'value'],
                call: (category, key, value)=> settingsModel.addSetting(category, key, value)
            },
            update: {
                params: ['id', 'category', 'key', 'value'],
                call: (id, category, key, value)=> settingsModel.updateSetting(id, category, key, value)
            }
        }
    }
}
export default function apiIOListeners(socket){
    const settingsModel = new SettingsModel(ibdb);
    socket.on('api.request', (req)=>{
        if(!req.hasOwnProperty('id')){
            apiError("Invalid request. No id provided.", req);
            return false;
        }

        const endpoints = req.endpoint.split('.');
        if(validateEndpoints(endpoints)){
            const apiEndpoint = API_ENDPOINTS[endpoints[0]][endpoints[1]][endpoints[2]];

            if(validateEndpointParams(apiEndpoint.params, req.params, req)){
                apiEndpoint.call(...req.params)
                    .then((data)=>{
                        const resp = {
                            id: req.id,
                            data,
                            request: req
                        };
                        socket.emit('api.response', data);
                    })
                    .catch((err)=> apiError("There was an issue when calling the model action. Check server logs/debugging.", req))
            }
        }
    });
}

function apiError(message, originalRequest){
    socket.emit('api.error', {
        message: `API IO ERROR: ${message}`,
        originalRequest
    });
}

function validateEndpoints(endpoints, originalRequest){
    if(endpoints.length !== 2){
        apiError("endpoint format is invalid. Must be model.section.action.", originalRequest);
        return false;
    }

    if(!API_ENDPOINTS.hasOwnProperty(endpoints[0])){
        apiError(`endpoint model '${endpoints[0]}' is invalid. Must be model.section.action.`, originalRequest);
        return false;
    }

    if(!API_ENDPOINTS[endpoints[0]].hasOwnProperty(endpoints[1])){
        apiError(`endpoint section '${endpoints[1]}'is invalid. Must be model.section.action.`, originalRequest);
        return false;
    }

    if(!API_ENDPOINTS[endpoints[0]][endpoints[1]].hasOwnProperty(endpoints[1])){
        apiError(`endpoint action '${endpoints[2]}'is invalid. Must be model.section.action.`, originalRequest);
        return false;
    }
    return true;
}

function validateEndpointParams(expectedParams, request){
    if(expectedParams.length !== request.params.length){
        apiError("the number of endpoint params does not match the expectation.", request);
        return false;
    }

    expectedParams.forEach((param)=>{
        if(!request.params.find(param)){
            apiError(`the endpoint param '${param}' was not found in the request.`, request);
        }
        return false;
    });

    return true;
}