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
    }

    let appendChange = function (option) {
        $("input[name='" + option.name + "']").on('change', function (event) {
            // 获取选择的文件列表
            let files = event.target.files;
            let file = files[0];
            // 可以将文件对象传递给其他函数进行进一步处理
            processFile(file);
        });
    }


    // 在此处执行对文件的自定义处理逻辑
    function processFile(file) {
        console.log(file)

    }

    exports('BeUpload', {
        render
    });
});