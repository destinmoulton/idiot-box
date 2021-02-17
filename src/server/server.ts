import path from 'path';
import express from 'express';

const app = express();

import ibdb from './db/IBDB';
import { setupSocketIO } from './socket.io/io';
import logger from './logger';

import dbconfig from './config/db.config';

const PORT = 3000;

const PUBLIC_PATH = path.resolve(__dirname, '../public');
app.use(express.static(PUBLIC_PATH));

// Allow all URI's; handle by react router
app.get('*', (req, res)=>{
    res.sendFile(path.join(PUBLIC_PATH, '/index.html'));
});

Promise.resolve()
    .then(()=>{
        ibdb.connect(dbconfig);
    })
    .then(()=>{
        try {
            return app.listen(PORT, ()=>{
                logger.log("\n---------------------------------------");
                logger.log("Idiot Box Server running on Port "+PORT);
                logger.log("---------------------------------------");
            });
        }
        catch(err){
            return Promise.reject(err);
        }
    })
    .then((server)=>{
        setupSocketIO(server);
    })
    .catch((err)=>{
        logger.error(err);
    })
