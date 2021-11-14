/**
 * http utility
 */
const request = require('request');

const HttpUtil = {
    sendRemoteRequest: function (req, options, callback) {
        try {
            const opts = {};
            opts.method = options.method || 'post';
            opts.headers = req.headers;
            delete opts.headers["host"];
            delete opts.headers["content-length"];
            opts.headers["content-type"] = 'application/json;charset=utf-8';
            opts.url = options.url;
            if (HttpUtil.isJson(options.data)) {
                opts.body = JSON.stringify(options.data);
            } else {
                opts.body = options.data;
            }

            console.log("url====>" + options.url);
            request(opts, function (error, response, body) {
                if (!error && response.statusCode == 401) {
                    callback.call(callback, null, { code: 401, msg: "您已经失去登录状态！" }, response);
                } else if (!error && response.statusCode == 200) {
                    const responseData = JSON.parse(body);
                    callback.call(callback, null, responseData, response);
                    return true;
                } else {
                    console.log("real error====>", body)
                    callback.call(callback, error, { code: 500, msg: "服务器繁忙，请稍后再试！" }, response);
                    return false;
                }
            });
        } catch (e) {
            console.log(e);
            callback.call(callback, e, { code: 500, msg: "服务器繁忙，请稍后再试" }, null);
            return false;
        }
    },
    //是否是json对象
    isJson: function (obj) {
        const json = typeof (obj) == "object" && Object.prototype.toString.call(obj).toLowerCase() == "[object object]" && !obj.length;
        return json;
    }
};
exports = module.exports = HttpUtil;
