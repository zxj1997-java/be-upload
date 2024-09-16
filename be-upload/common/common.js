let global = {
    //上传文件地址
    uploadUrl: "/document/file/upload",
    //下载文件地址
    downLoadUrl: "/document/file/download?fileId=",
    //查询文件的详情信息
    findFileByIdUrl: "/assessment/findFileById"
}


// 假设 firstMod 模块文件所在路径在： /js/layui_exts/firstMod.js
layui.config({
    base: 'be-upload/' // 配置 Layui 第三方扩展模块存放的基础目录
}).extend({
    BeImgUpload: 'BeImgUpload', // 定义模块名和模块文件路径，继承 layui.config 的 base 路径
    BeFileUpload: 'BeFileUpload',
});