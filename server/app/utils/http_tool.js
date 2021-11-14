/**
 * http utility
 */
const request = require('request');
// var log = require('../logs/logger');
// var logOut = log.getLogger('custom');
// const Excel = require('exceljs');
const HttpUtil = {
    sendRemoteRequest: function(req, options, callback) {
        try {
            var opts = {
                method: options.method || 'post',
                headers: {
                    'Content-Type': options.contentType || 'application/json;charset=utf-8',
                    cookie: req.headers['cookie'],
                    'User-Agent': req.headers['user-agent']
                    // 'token': req.headers['token'],
                    // 'auth': req.headers['auth']
                },
                url: options.url,
                body: JSON.stringify(options.data)
            };
            request(opts, function(error, response, body) {
                // logOut.info(response.statusCode);
                if (!error && response.statusCode == 200) {
                    var responseData;

                    try {
                        responseData = JSON.parse(body);
                    } catch (err) {
                        responseData = {
                            error: 'NotLogin',
                            url: ''
                        };
                    }
                    // logOut.info(responseData);
                    callback.call(callback, null, responseData, response);
                    return true;
                } else if (!error && response.statusCode == 403) {
                    // logOut.info(error);
                    var responCode = {
                        error: 'NotPower'
                    };
                    callback.call(callback, null, responCode, response);
                    return true;
                } else {
                    // 将错误输出到接口相应里，方便观察调试
                    // logOut.info(error);
                    callback.call(callback, error, { code: 500, msg: '服务器繁忙，请稍后再试！' }, response);
                    return false;
                }
            });
        } catch (e) {
            callback.call(callback, error, { code: 500, msg: '服务器繁忙，请稍后再试' }, null);
            return false;
        }
    }
    // downLoadRequest: function(req, res, callback) {
    //     try {
    //         const workbook = new Excel.Workbook();
    //         let sheet = workbook.addWorksheet('2018-10报表');
    //         sheet.columns = [
    //             { header: '创建日期', key: 'create_time', width: 15 },
    //             { header: '单号', key: 'id', width: 15 },
    //             { header: '电话号码', key: 'phone', width: 15 },
    //             { header: '地址', key: 'address', width: 15 }
    //         ];
    //         const data = [
    //             {
    //                 create_time: '2018-10-01',
    //                 id: '787818992109210',
    //                 phone: '11111111111',
    //                 address: '深圳市'
    //             }
    //         ];
    //         sheet.addRows(data);
    //         workbook.xlsx.writeBuffer().then(function(buffer) {
    //             const responseData = {
    //                 stateCode: '3000',
    //                 data: buffer
    //             };
    //             callback.call(callback, null, responseData, null);
    //         });
    //     } catch (e) {
    //         callback.call(callback, error, { code: 1, msg: '下载文件失败，请稍后再试' }, null);
    //         return false;
    //     }
    // }
};
exports = module.exports = HttpUtil;
