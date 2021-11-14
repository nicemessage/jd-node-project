const path = require('path');
function resolve(dir) {
    return path.join(__dirname, dir);
}
// sql editor
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

module.exports = {
    configureWebpack: {
        performance: {
            hints: 'warning',
            //入口起点的最大体积 整数类型（以字节为单位）
            maxEntrypointSize: 50000000,
            //生成文件的最大体积 整数类型（以字节为单位 300k）
            maxAssetSize: 30000000,
            //只给出 js 文件的性能提示
            assetFilter: function (assetFilename) {
                return assetFilename.endsWith('.js');
            }
        }
    },
    chainWebpack: config => {
        config.resolve.alias.set('@', resolve('src'));

        config.module
            .rule("svg")
            .exclude.add(path.resolve("src/assets/svg"))
            .end();
        config.module
            .rule("icons")
            .test(/\.svg$/)
            .include.add(path.resolve("src/assets/svg"))
            .end()
            .use("svg-sprite-loader")
            .loader("svg-sprite-loader")
            .options({
                symbolId: "icon-[name]"
            });
        config.plugin("monaco-editor").use(MonacoWebpackPlugin, [{
            languages: ['sql', 'mysql', 'pgsql'],
            filename: "static/js/[name].worker.[contenthash].js",
            publicPath: "/",
        }])
    },
    css: {
        extract: process.env.NODE_ENV == 'dev' ? false : true,
        // css预设器配置项
        loaderOptions: {
            sass: {
                // @是src的别名
                prependData: "@import '@/assets/scss/tool.scss';"
            }
        },
        requireModuleExtension: true
    },
    devServer: {
        host: 'local.101bank.sh',//'fuse-tag.jd.com',
        port: '3001',
        open: true,
        proxy: 'http://127.0.0.1:13003',
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
        },
    },
    publicPath: '/',
    //基本路径
    outputDir: './server/dist',
    runtimeCompiler: true,
    assetsDir: 'static',
    productionSourceMap: false,
};
