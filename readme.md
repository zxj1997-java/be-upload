### 使用说明
使用示例 见下方代码
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
    <link href="plugins/common/common.css" rel="stylesheet">
</head>
<body>
<div id="fileupload"></div>
</body>
<!-- 引入 layui.js -->
<script src="./layui/layui.js"></script>
<script src="plugins/common/common.js"></script>
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
            value: ['fileId1', 'fileId2']  //图片初始化，是图片id数组
        });
    })
</script>
</html>
```
### 效果图
![edit.png](img%2Fedit.png)
![detail.png](img%2Fdetail.png)