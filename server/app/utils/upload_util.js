/**
 * Created by ljw on 2017/4/10.
 */

const express = require('express');
const router = express.Router();
// var httpUtil = require("./http_util.js");
// var serviceAPI = serverObj.api; //DMP 后台接口地址
const request = require('request');

//接口实例post 客群
router.post('/*', function (req, res) {
       req.pipe(request.post({url:serverObj.api+req.url,gzip:true},function (error, response, body) {
        res.send(JSON.parse(body));
    }))
});


module.exports = router;
