// 假设 firstMod 模块文件所在路径在： /js/layui_exts/firstMod.js
layui.config({
    base: '/plugins/' // 配置 Layui 第三方扩展模块存放的基础目录
}).extend({
    BeUpload: 'BeUpload', // 定义模块名和模块文件路径，继承 layui.config 的 base 路径
});