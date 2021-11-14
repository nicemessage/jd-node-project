const Utils = (function () {
    const tools = function (selector, context) {
    };
    //获取环境变量
    tools.prototype.mapValue = function (hostMap) {
        let key = process.env.NODE_ENV;
        if (typeof key == 'undefined' || key == '') {
            // key = 'domain'; // 生产环境本地调试
            // key = 'pTest';   // 预发环境本地调试
            // key = 'pDev';   // 准生产环境本地调试
            key = 'dev';   // 测试环境本地调试
        }
        if (typeof hostMap == 'undefined')
            throw new TypeError('host map is required');
        const mapped = {};
        mapped.env = key;
        for (const i in hostMap) {
            mapped[i] = hostMap[i][key]
        }
        return mapped;
    };
    const utils = new tools();

    return utils;
})();

module.exports = Utils;
