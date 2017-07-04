// Run the sqlite migrations
import db from 'sqlite';

import dbconfig from './config/db.config';

Promise.resolve()
    .then(()=> db.open(dbconfig.filename))
    .then(()=> db.migrate({migrationsPath:dbconfig.migrationsPath}))
    .catch((err)=>console.log(err));