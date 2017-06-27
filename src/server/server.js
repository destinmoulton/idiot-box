import path from 'path';
import express from 'express';

import db from 'sqlite';

import logger from './logger';

const app = express();

const PORT = 3000;
const DB_PATH = path.resolve(__dirname, '../database/idiot-box.sqlite3');

const PUBLIC_PATH = path.resolve(__dirname, '../public');

app.use(express.static(PUBLIC_PATH));

app.get('/', (req, res)=>{
    res.sendFile(path.join(PUBLIC_PATH, '/index.html'));
});

Promise.resolve()
    .then(()=>{
        db.open(DB_PATH)
    })
    .then(()=>{
        app.listen(PORT, ()=>{
            console.log("\n---------------------------------------");
            console.log("Idiot Box Server running on Port "+PORT);
            console.log("---------------------------------------");
        });
    })
    .catch((err)=>{
        logger.error(err);
    })
