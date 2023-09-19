/** BeUpload.js **/
layui.define(['jquery', 'layer', 'form'], function (exports) {
    let $ = layui.jquery;
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
    }


    // 在此处执行对文件的自定义处理逻辑
    let processFile = function (option, file) {
        console.log(file)
        if (option.size >= file.size / 1024 / 1024) {
            $(option.id).prepend(`
            <div class="image-section" data-id="1111">
                <img class="image-show" src="https://picx.zhimg.com/70/v2-d094166746ca67d2a2ed61042e2675ce_1440w.avis?source=172ae18b&biz_tag=Post">
                <div class="image-shade"></div>
                <i class="delete-icon"></i>
                <i class="zoom-icon"></i>
            </div>`);

            showAddBtn(option);
        }
        else{
            console.log("文件太大")
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
            console.log("放大图标");
        });
    }

    //显示或隐藏添加按钮
    function showAddBtn(option) {
        let count = $(option.id + ' .image-section').length;
        if (count >= option.num) {
            $(option.id).children().last().hide();
        } else {
            $(option.id).children().last().show();
        }
    }

    exports('BeUpload', {
        render
    });
});