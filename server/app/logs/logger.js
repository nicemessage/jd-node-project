const log4js = require('log4js');
log4js.configure({//daysToKeep保留天数
    // appenders: { cheese: { type: "dateFile", filename: serverObj.path, pattern: ".yyyy-MM-dd", keepFileExt: true ,maxLogSize: 1024*1024*1024, backups: 3,daysToKeep:1, } },
    appenders: { cheese: { type: "file", filename: serverObj.path, keepFileExt: true ,maxLogSize: 1024*1024*1024, backups: 3,daysToKeep:3, } },
    categories: { default: { appenders: ['cheese'], level: 'info' } }
});
module.exports = log4js;
