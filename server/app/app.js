const express = require('express');
const path = require('path');
const logger = require('morgan');
const swig = require('swig')
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const Utils = require('./utils/utils_tools.js');
const history = require('connect-history-api-fallback');


//通过环境变量接口地址等获取信息
global.serverObj = Utils.mapValue(require('./conf/api_config'));

const app = express();
// session 用户登录
const session = require('express-session');
app.use(session({
    secret: 'label',
    //store: store,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 86400000 }
}));

app.use(bodyParser.json({ limit: '2000mb' }));
app.use(bodyParser.urlencoded({ limit: '2000mb', extended: true }));

app.set("env", "production");
app.enable("view cache");//将app.get('view cache')设置为true，节点视图缓存
app.use(logger('dev'));//在控制台可以看到有日志输出，日志内容包括请求方法、请求状态、远程地址、请求时间等信息
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));// 解析 application/x-agiletag-form-urlencoded
app.use(cookieParser());//读取cookie

app.use('/favicon.ico', express.static(path.join(__dirname, '../dist/favicon.ico')));
app.use('/static', express.static(path.join(__dirname, '../dist/static')));

app.set('views', path.join(__dirname, '../dist'));
app.engine('html', swig.renderFile);
app.set('view engine', 'html');

const http = require("http");
const server = http.createServer(app);
server.setTimeout(0);//设置超时时间  0是不会超时

const domainMiddleware = require("domain-middleware");
app.use(domainMiddleware({
    server: server,
    killTimeout: 10000
}));

app.HttpServer = server;

// console.log('Node Env:', serverObj.env);

// 心跳检测
app.get('/heart', (req, res) => {
    res.send('app is ok, drink more hot water.')
})

app.get('/getEnv', (req, res) => {
    return res.json({
        stateCode: '3000',
        data: serverObj.env
    })
})


// 挂载路由
app.use('/api', require('./utils/api_util'));            //node接口

//文件上传
app.use('/upload', require('./utils/upload_util'));            //node接口

app.get('/*', (req, res, next) => {
    res.render("index", { title: 'TanGo!', login: global.serverObj.erp });
});


// 接口404
app.use(function (req, res, next) {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});


module.exports = app;
