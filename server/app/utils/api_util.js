const express = require('express');
const router = express.Router();
const httpUtil = require("./http_util.js");
const service = serverObj.api;

//接口实例
router.get('/*', function (req, res) {

    httpUtil.sendRemoteRequest(req, { data: req.query, url: service + req.url, method: "get" }, function (err, result, response) {

        if (result.code == 401) {
            result.sso=response.headers.location
        }

        res.send(result);
    });
});
router.post('/*', function (req, res) {
    httpUtil.sendRemoteRequest(req, { data: req.body, url: service + req.url, method: "post" }, function (err, result, response) {
        if (result.code == 401) {
            result.sso=response.headers.location
        }
        res.send(result);
    });
});

router.put('/*', function (req, res) {
    httpUtil.sendRemoteRequest(req, { data: req.query, url: service + req.url, method: "put" }, function (err, result, response) {
        if (result.code == 401) {
            result.sso=response.headers.location
        }
        res.send(result);
    });
});

router.delete('/*', function (req, res) {
    httpUtil.sendRemoteRequest(req, { data: req.query, url: service + req.url, method: "delete" }, function (err, result, response) {
        if (result.code == 401) {
            result.sso=response.headers.location
        }
        res.send(result);
    });
});

module.exports = router;
