## Idiot Box

Idiot Box is a Movie and TV manager written with the Raspberry Pi in mind.

#### Server

##### Starting, Stopping, and Monitoring
The npm pm2 package is used to persist the server.
```sh
$ npm install -g pm2
```
To start the server, run:
```sh
$ npm run start:server

# To get info about running Idiot Box server instance:
$ pm2 show idiot-box

# To stop Idiot Box server:
$ pm2 stop idiot-box

# To monitor Idiot Box cpu and memory:
$ pm2 monit
```

##### Debugging Server

Open the Chrome Node.js DevTools.
