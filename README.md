## Idiot Box

Idiot Box is a Movie and TV media manager and player built for usage on the Raspberry Pi (omxplayer). Add TV shows and movies to your library using a Trakt API key. See new episodes and watch them by using the remote built into the navigation bar.

### Server

Dev URL: http://localhost:3000

Update Script: `node ./dist/server/app/scripts/daily_update.js`

### Installation

Clone the repo:

`git clone https://github.com/destinmoulton/idiot-box.git`

Install dependencies:

`npm install`

Copy `config/config.template.json` to `config/config.json` and alter the values to match your configuration.

#### Starting, Stopping, and Monitoring

The npm pm2 package is used to persist the server.

```sh
$ npm install -g pm2
```

To start the server, run:

```sh
$ npm run start-server

# To get info about running Idiot Box server instance:
$ pm2 show idiot-box

# To stop Idiot Box server:
$ pm2 stop idiot-box

# To monitor Idiot Box cpu and memory:
$ pm2 monit
```

#### Debugging Server

To build the server:

`npm run compile-server`

Open the Chrome Node.js DevTools.

### Dev Notes

To build the frontend:

`npm run compile-react`

### License

MIT
