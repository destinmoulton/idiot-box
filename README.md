## Idiot Box

Idiot Box is a Movie and TV media manager and player built for usage on the Raspberry Pi (omxplayer). Add TV shows and movies to your library using a Trakt API key. See new episodes and watch them by using the remote built into the navigation bar.

### Server

Dev URL: http://localhost:3000

#### Starting, Stopping, and Monitoring

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

#### Debugging Server

Open the Chrome Node.js DevTools.

### License

Idiot Box is freely available under the MIT License.
