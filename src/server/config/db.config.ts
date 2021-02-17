import path from 'path';

export default {
    filename: path.resolve(__dirname, '../../database/idiot-box.sqlite3'),
    migrationsPath: path.resolve(__dirname, '../../migrations')
};