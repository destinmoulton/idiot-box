class Logger{
    log(){
        console.log(...arguments);
    }

    error(){
        console.error(...arguments);
    }

    info(){
        console.info(...arguments);
    }
}

export default new Logger();