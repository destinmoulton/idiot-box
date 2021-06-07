import path from "path";
import express from "express";
import basicAuth from "express-basic-auth";

const app: any = express();

import ibdb from "./db/IBDB";
import { setupSocketIO } from "./socket.io/io";
import logger from "./logger";

import config from "./config";

const PORT = 3000;

const PUBLIC_PATH = path.resolve(__dirname, "../public");

// Enable http basic auth
app.use(basicAuth({ challenge: true, users: config.users, realm: "ibox" }));
app.use(express.static(PUBLIC_PATH));

// Allow all URI's; handle by react router
app.get(
    "*",
    basicAuth({ challenge: true, users: config.users, realm: "ibox" }),
    (req, res) => {
        res.sendFile(path.join(PUBLIC_PATH, "/index.html"));
    }
);

(async () => {
    try {
        await ibdb.connect(config);
        logger.log(config);
        let server = app.listen(PORT, () => {
            logger.log("\n---------------------------------------");
            logger.log("Idiot Box Server running on Port " + PORT);
            logger.log("---------------------------------------");
        });
        setupSocketIO(server);
    } catch (err) {
        throw new Error(err);
    }
})();
