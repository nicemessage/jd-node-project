const log4js = require('log4js');

const injectGlobal = (logger) => { // 全局注入
    global.Logger = logger;
}

const injectConsole = (logger) => { // 重写console方法
    console.trace = logger.trace.bind(logger);
    console.debug = logger.debug.bind(logger);
    console.log = logger.info.bind(logger);
    console.info = logger.info.bind(logger);
    console.warn = logger.warn.bind(logger);
    console.error = logger.error.bind(logger);
}

const init = () => {
    log4js.configure({
        replaceConsole: true,
        pm2: true,
        appenders: {
            out: {
                type: 'console', layout: {
                    type: 'coloured'
                }
            },
        },
        categories: {
            default: { appenders: ['out'], level: 'info' },
        }
    });
    const logger = log4js.getLogger('console');

    injectGlobal(logger);
    injectConsole(logger);
}


const Logs = {
    init,
};

module.exports = Logs;
