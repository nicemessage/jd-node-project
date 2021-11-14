// 读取 modules 目录下的路由文件，并合并这些文件中的配置到一个数组中
const files = require.context('./modules', false, /\.ts$/);
const routerConfig: any[] = [];
files.keys().forEach(key => {
    // 读取文件的配置
    const modules = files(key).default;
    if (Array.isArray(modules)) {
        routerConfig.push(...modules);
    } else {
        routerConfig.push(modules);
    }
});

export default routerConfig;
