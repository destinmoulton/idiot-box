import error from '../error';
import logger from '../logger';
import ibdb from '../db/IBDB';

import FilesystemModel from '../models/FilesystemModel';
import SettingsModel from '../db/SettingsModel';
const filesystemModel = new FilesystemModel();
const settingsModel = new SettingsModel(ibdb);
const API_ENDPOINTS = {
    filesystem: {
        dir: {
            get: {
                params: ['path'],
                func: (pathToList)=> filesystemModel.getDirList(pathToList)
            }
        }
    },
    settings: {
        category: {
            get: {
                params: ['category'],
                func: (category)=>settingsModel.getAllForCategory(category)
            },
            add: {
                params: ['category', 'key', 'value'],
                func: (category, key, value)=> settingsModel.addSetting(category, key, value)
            },
            update: {
                params: ['id', 'category', 'key', 'value'],
                func: (id, category, key, value)=> settingsModel.updateSetting(id, category, key, value)
            }
        }
    }
}

let localSocket = {};
export default function apiIOListeners(socket){
    localSocket = socket;
    const settingsModel = new SettingsModel(ibdb);
    socket.on('api.request', (req)=>{
        if(!req.hasOwnProperty('id')){
            apiError("Invalid request. No id provided.", req);
            return false;
        }

        const endpoints = req.endpoint.split('.');
        if(validateEndpoints(endpoints, req)){
            const apiEndpoint = API_ENDPOINTS[endpoints[0]][endpoints[1]][endpoints[2]];

            if(validateEndpointParams(apiEndpoint.params, req)){
                const endpointParams = prepareEndpointParams(apiEndpoint.params, req.params)
                return apiEndpoint.func(...endpointParams)
                    .then((data)=>{
                        const resp = {
                            id: req.id,
                            data,
                            request: req
                        };
                        socket.emit('api.response', resp);
                    })
                    .catch((err)=> apiError("MODEL ERROR :: "+err, req))
                    
            }
        }
    });
}

function apiError(message, originalRequest){
    localSocket.emit('api.error', {
        message: `API IO ERROR :: ${message}`,
        request: originalRequest
    });
}

function validateEndpoints(endpoints, originalRequest){
    if(endpoints.length !== 3){
        apiError(`incorrect number of endpoints. Got ${endpoints.length}. Expecting model.section.action.`, originalRequest);
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

    if(!API_ENDPOINTS[endpoints[0]][endpoints[1]].hasOwnProperty(endpoints[2])){
        apiError(`endpoint action '${endpoints[2]}'is invalid. Must be model.section.action.`, originalRequest);
        return false;
    }
    return true;
}

function validateEndpointParams(expectedParams, request){
    if(expectedParams.length !== Object.keys(request.params).length){
        apiError("the number of endpoint params does not match the expectation.", request);
        return false;
    }

    expectedParams.forEach((param)=>{
        if(!request.params.hasOwnProperty(param)){
            apiError(`the endpoint param '${param}' was not found in the request.`, request);
        }
        return false;
    });

    return true;
}

function prepareEndpointParams(expectedParams, providedParams){
    let paramArr = [];
    expectedParams.forEach((param)=>{
        paramArr.push(providedParams[param]);
    });
    return paramArr;
}