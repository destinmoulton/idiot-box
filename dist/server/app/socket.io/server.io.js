import os from 'os';
import path from 'path';
export default function serverIOListeners(socket) {
    socket.on('server.info.request', () => {
        const data = {
            hostname: os.hostname(),
            pathSeparator: path.sep
        };
        socket.emit('server.info.ready', data);
    });
}
//# sourceMappingURL=server.io.js.map