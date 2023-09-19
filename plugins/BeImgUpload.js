/** BeImgUpload.js **/
layui.define(['jquery', 'layer', 'form'], function (exports) {
    let $ = layui.jquery;
    let layer = layui.layer;

    let render = function (option) {
        option.value = option.value ? option.value : [];
        $(option.id).append(`<input type="hidden" class="upload-hidden-input" name="${option.name}"/>`)
        addImg(option);
        $(option.id).append(`
            <div class="upload-wapper">
                <i class="upload-icon"></i>
                <input type="file" class="upload-input" accept="${option.type ? option.type : 'image/*'}">
            </div>`);
        appendChange(option);
        clickEvent(option);
    }

    let appendChange = function (option) {
        $(option.id + " input[type=file]").on('change', function (event) {
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
        if (file) {
            if (option.size && option.size <= file.size / 1024 / 1024) {
                layer.msg("上传文件大小不得超过" + option.size + "M", {icon: 0});
            } else {
                let that = $(this);
                let formData = new FormData();
                formData.append("file", file);
                // $.ajax({
                //     url: "http://localhost:8080/sys/file/add",
                //     data: formData,
                //     success: function (result) {
                $(`<div class="image-section" data-id="1111">
                    <img class="image-show" src="https://pic-zxj.oss-cn-shanghai.aliyuncs.com/20230626150654.png">
                    <div class="image-shade"></div>
                    <i class="delete-icon"></i>
                    <i class="zoom-icon"></i>
                </div>`).insertBefore(option.id + ' .upload-wapper');
                option.value.push("20230626150654");
                $(option.id + " input[name='" + option.name + "']").val(option.value.join(','))
                showAddBtn(option);
                //     },
                //     error: function (xhr, status, error) {
                //         layer.msg("删除失败", {icon: 2})
                //     }
                // });
            }
        }
    }

    //添加预览图片
    let addImg = function (option) {
        if (option.value) {
            for (let i = 0; i < option.value.length; i++) {
                $(option.id).append(`
                <div class="image-section" data-id="1111">
                    <img class="image-show" src="https://pic-zxj.oss-cn-shanghai.aliyuncs.com/${option.value[i]}">
                    <div class="image-shade"></div>
                    <i class="delete-icon"></i>
                    <i class="zoom-icon"></i>
                </div>`);
            }
            $(option.id + " input[name='" + option.name + "']").val(option.value.join(','))
            showAddBtn(option);
        }
    }


    //删除或者放大图片
    function clickEvent(option) {
        // 在此处执行点击删除图标后的逻辑
        $(option.id).on('click', '.delete-icon', function () {
            let that = $(this);
            let id = that.parent(".image-section").data("id");
            // $.ajax({
            //     url: "http://localhost:8080/sys/file/deleteId",
            //     data: {id: id},
            //     success: function (result) {
            that.parent(".image-section").remove();
            showAddBtn(option);
            let index = option.value.indexOf(id);
            if (index !== -1) {
                option.value.splice(index, 1);
            }
            $(option.id + " input[name='" + option.name + "']").val(option.value.join(','))
            //     },
            //     error: function (xhr, status, error) {
            //         layer.msg("删除失败", {icon: 2})
            //     }
            // });
        });

        // 在此处执行点击放大图标后的逻辑
        $(option.id).on('click', '.zoom-icon', function () {
            let img = $(this).parent(".image-section").children("img")[0];
            layer.open({
                type: 1,
                area: "auto", // 宽高
                title: false, // 不显示标题栏
                closeBtn: 1,
                shadeClose: true, // 点击遮罩关闭层
                content: "<img src='" + img.src + "' style='max-width: 900px;height: auto'/>"
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

    exports('BeImgUpload', {
        render
    });
});