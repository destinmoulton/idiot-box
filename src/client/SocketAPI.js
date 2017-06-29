import io from 'socket.io-client';

// Example conf. You can move this to your config file.
const host = 'http://localhost:3000';
const socketPath = '/socket.io';

export default class SocketAPI {
  socket;

  connect() {

    this.socket = io.connect(host, { path: socketPath });
    return new Promise((resolve, reject) => {
      this.socket.on('connect', () => resolve());
      this.socket.on('connect_error', (error) => reject(error));
    });
  }

  disconnect() {
    return new Promise((resolve) => {
      this.socket.disconnect(() => {
        this.socket = null;
        resolve();
      });
    });
  }

  emit(event, data) {
    return new Promise((resolve, reject) => {
      if (!this.socket) return reject('No socket connection.');
      console.log(`SocketAPI :: emit :: event = ${event}`);
      return this.socket.emit(event, data, (response) => {
        
        // Response is the optional callback that you can use with socket.io in every request. See 1 above.
        if (response.error) {
          console.error(response.error);
          return reject(response.error);
        }

        return resolve();
      });
    });
  }

  on(event, fun) {
    
    // No promise is needed here, but we're expecting one in the middleware.
    return new Promise((resolve, reject) => {
      if (!this.socket) return reject('No socket connection.');
      console.log(`SocketAPI :: on :: event = ${event}`);
      this.socket.on(event, fun);
      resolve();
    });
  }

  off(event, fun) {
    return new Promise((resolve, reject) => {
      if (!this.socket) return reject('No socket connection.');

      if(typeof fun === 'function'){
        this.socket.off(event, fun);
      } else {
        this.socket.off(event);
      }
      resolve();
    });
  }
}