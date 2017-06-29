import path from 'path';
import express from 'express';

const app = express();

import ibdb from './db/IBDB';
import { setupSocketIO } from './socket.io/io';
import logger from './logger';

import dbconfig from './config/db';

const PORT = 3000;
const PUBLIC_PATH = path.resolve(__dirname, '../public');

app.use(express.static(PUBLIC_PATH));

app.get('*', (req, res)=>{
    res.sendFile(path.join(PUBLIC_PATH, '/index.html'));
});

Promise.resolve()
    .then(()=>{
        ibdb.connect(dbconfig);
    })
    .then(()=>{
        return app.listen(PORT, ()=>{
            console.log("\n---------------------------------------");
            console.log("Idiot Box Server running on Port "+PORT);
            console.log("---------------------------------------");
            
        });

    })
    .then((server)=>{
        setupSocketIO(server);
    })
    .catch((err)=>{
        logger.error(err);
    })
