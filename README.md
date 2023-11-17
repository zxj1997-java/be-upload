### 示例地址
https://zhang_xing_ju.gitee.io/be-upload/index.html
### 使用说明
```java
//查询文件详情
@PostMapping("/findFileById")
@ResponseBody
public ResponseEntity findFileById(@RequestBody String[] ids) {
    List<File> files = fileService.queryForList(ids);
    return ResponseEntity.ok(files);
}

//文件上传
@PostMapping({"/upload"})
public ResponseEntity<File> upload(@RequestParam MultipartFile file) {
    return ResponseEntity.ok(ileService.upload(file));
}


//文件下载
@GetMapping({"/download"})
public ResponseEntity<Void> download(String fileId) throws Exception {
 
}
```


1. 修改文件相关的后台接口地址
[common.js](layui_exts%2Fbe-upload%2Fcommon%2Fcommon.js)
```js
let global = {
    //上传文件地址
    uploadUrl: "/file/upload",
    //下载文件地址
    downLoadUrl: "/file/download?id=",
    //查询文件的详情信息
    findFileByIdUrl: "/file/findById"
}
```
2.引入相关的css js

```js
<link href="be-upload/common/common.css" rel="stylesheet">
    <script src="be-upload/common/common.js"></script>
```

3. 像layui的其他组件一样使用即可
```js
layui.use(['BeImgUpload'], function () {
    let beImgUpload = layui.BeImgUpload;

    //图片上传，会把图片的id通过逗号拼接成字符串，保存时通过name属性发送
    beImgUpload.render({
        id: "#imgupload",
        name: "imgIds",
        num: 5,   //图片数量限制
        size: 10, //10M, 大小限制
        readonly: false, //非只读
        type: ".png,.jpg,.jpeg",
        value: ['fileId1', 'fileId2']   //图片初始化，是图片id可以是数组,也可以是以,拼接的字符串
    });
})
```


### 使用示例 见下方代码
[file-upload-demo.html](file-upload-demo.html)
[img-upload-demo.html](img-upload-demo.html)

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>文件上传示例</title>
    <!-- 引入 layui.css -->
    <link href="./layui/css/layui.css" rel="stylesheet">
    <link href="be-upload/common/common.css" rel="stylesheet">
</head>
<body>
<div id="fileupload"></div>
</body>
<!-- 引入 layui.js -->
<script src="./layui/layui.js"></script>
<script src="be-upload/common/common.js"></script>
<script>
    layui.use(['BeImgUpload'], function () {
        let beImgUpload = layui.BeImgUpload;

        //图片上传，会把图片的id通过逗号拼接成字符串，保存时通过name属性发送
        beImgUpload.render({
            id: "#imgupload",
            name: "imgIds",
            num: 5,   //图片数量限制
            size: 10, //10M, 大小限制
            readonly: false, //非只读
            type: ".png,.jpg,.jpeg",
            value: ['fileId1', 'fileId2']   //图片初始化，是图片id可以是数组,也可以是以,拼接的字符串
        });
    })
</script>
</html>
```
### 效果图
![img.png](img%2Fimg.png)
![img_1.png](img%2Fimg_1.png)
![img_2.png](img%2Fimg_2.png)