/** BeUpload.js **/
layui.define(['jquery', 'layer', 'form'], function (exports) {
    let $ = layui.jquery;
    let layer = layui.layer;

    let render = function (option) {
        $(option.id).append(`
            <div class="upload-wapper">
                <i class="upload-icon"></i>
                <input type="file" name="${option.name}" class="upload-input" accept="image/*">
            </div>`)

        appendChange(option);
        clickEvent(option);
    }

    let appendChange = function (option) {
        $("input[name='" + option.name + "']").on('change', function (event) {
            // 获取选择的文件列表
            let files = event.target.files;
            let file = files[0];
            // 可以将文件对象传递给其他函数进行进一步处理
            processFile(option, file);
        });
        // 清除已选中的文件
        $(this).val('');
    }


    // 在此处执行对文件的自定义处理逻辑
    let processFile = function (option, file) {
        console.log(file)
        if (file) {
            if (option.size && option.size <= file.size / 1024 / 1024) {
                layer.msg("上传文件大小不得超过" + option.size + "M", {icon: 0});
            } else {
                $(option.id).prepend(`
            <div class="image-section" data-id="1111">
                <img class="image-show" src="https://pic-zxj.oss-cn-shanghai.aliyuncs.com/20230710110151.png">
                <div class="image-shade"></div>
                <i class="delete-icon"></i>
                <i class="zoom-icon"></i>
            </div>`);
                showAddBtn(option);
            }
        }
    }

    //删除或者放大图片
    function clickEvent(option) {
        // 在此处执行点击删除图标后的逻辑
        $(option.id).on('click', '.delete-icon', function () {
            console.log("删除图标");
            $(this).parent(".image-section").remove();
            showAddBtn(option);
        });

        // 在此处执行点击放大图标后的逻辑
        $(option.id).on('click', '.zoom-icon', function () {
            let img = $(this).parent(".image-section").children("img")[0];
            layer.open({
                type: 1,
                area: "auto", // 宽高
                title: false, // 不显示标题栏
                closeBtn: 0,
                shadeClose: true, // 点击遮罩关闭层
                content: "<img src='"+img.src+"' style='max-width: 900px;height: auto'/>"
            });
        });
    }

    //显示或隐藏添加按钮
    function showAddBtn(option) {
        let count = $(option.id + ' .image-section').length;
        if (option.num && count >= option.num) {
            $(option.id).children().last().hide();
        } else {
            $(option.id).children().last().show();
        }
    }

    exports('BeUpload', {
        render
    });
});