import error from '../error';
import ibdb from '../db/IBDB';
import io from './io';
import logger from '../logger';

import SettingsModel from '../db/SettingsModel';

export default function settingsIOListeners(socket){
    const settingsModel = new SettingsModel(ibdb);
    socket.on('settings.get.category', (options)=>{
        settingsModel.getAllForCategory(options.category)
            .then((settings)=>{
                socket.emit('settings.data.category', settings);
            })
            .catch((err)=> error(err));
    });

    socket.on('settings.add.request', (options)=>{
        settingsModel.addSetting(options.category, options.category, options.value)
            .then(()=>{
                socket.emit('settings.add.complete', {status:"success"});
            })
            .catch((err)=>error(err));
    });

    socket.on('settings.update.request', (options)=>{
        settingsModel.updateSetting(options.id, options.category, options.key, options.value)
            .then(()=>{
                socket.emit('settings.update.complete', {status:"success"});
            })
            .catch((err)=>error(err));
    });
}