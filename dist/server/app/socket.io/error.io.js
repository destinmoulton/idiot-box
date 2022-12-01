import bus from '../eventBus';
export default function errorIOListeners(socket) {
    bus.on('error', (message) => {
        socket.emit('error', { message });
    });
}
//# sourceMappingURL=error.io.js.map