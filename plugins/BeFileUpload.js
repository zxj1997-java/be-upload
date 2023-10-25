/** BeImgUpload.js **/
layui.define(['jquery', 'layer', 'form'], function (exports) {
    let $ = layui.jquery;
    let layer = layui.layer;

    let render = function (option) {
        $(option.id).css("display", "grid")

        option.value = option.value ? option.value : [];
        $(option.id).append(`<input type="hidden" class="upload-hidden-input" name="${option.name}"/>`)
        $(option.id).append(`
            <div class="doc-tips-group block">
            <span class="doc-tips block" style=>≤10M,支持 doc, docx, xls, xsx
            </span>
            <div class="doc-uploadBtn">
                <i style="font-style: normal;">上传</i>
                <input class="upload-input" type="file" accept="${option.type ? option.type : 'image/*'}"/>
            </div>
        </div>`);
        addImg(option);
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
            $(option.id + " input[type=file]").val(""); // 强制清除输入框的值
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
                let formData = new FormData();
                formData.append("file", file);
                $.ajax({
                    url: ctx_ + "document/file/upload",
                    data: formData,
                    type: "post",
                    processData: false,  // 禁止对数据进行序列化
                    contentType: false,  // 不设置请求头的 Content-Type
                    success: function (result) {
                        $(option.id).append(`
                        <div data-id="${result.id}" class="doc-item-bg">
                            <img class="doc-img" 
                            src="${getFileType(file)}">
                            <div class="block doc-info-detail">
                                <span class="doc-title">${result.fileName}</span> 
                                <span class="doc-desc">${Math.round(result.fileSize / 1024)}KB</span>
                            </div>
                            <div class="block doc-icon-group">
                                <img class="doc-icon download" src="./common/img/doc_download.png">
                                <img class="doc-icon delete" src="./common/img/doc_delete.png">
                            </div>
                        </div>`);
                        option.value.push(result.id);
                        $(option.id + " input[name='" + option.name + "']").val(option.value.join(','))
                        showAddBtn(option);
                    },
                    error: function (xhr, status, error) {
                        layer.msg("上传失败", {icon: 2})
                    }
                });
            }
        }
    }

    //添加预览图片
    let addImg = function (option) {
        if (option.value) {
            $(option.id + " input[name='" + option.name + "']").val(option.value.join(','))
            showAddBtn(option);
            $.ajax({
                url: ctx_ + "work/user/findFileById",
                data: JSON.stringify(option.value),
                contentType: 'application/json;charset=UTF-8',
                type: "post",
                success: function (result) {
                    for (let i = 0; i < result.length; i++) {
                        $(option.id).append(`
                        <div data-id="${result[i].id}" class="doc-item-bg">
                            <img class="doc-img" src="./common/img/icon-image.png">
                            <div class="block doc-info-detail">
                                <span class="doc-title">${result[i].fileName}</span> 
                                <span class="doc-desc">${Math.round(result[i].fileSize / 1024)}KB</span>
                            </div>
                            <div class="block doc-icon-group">
                                <img class="doc-icon download" src="./common/img/doc_download.png">
                                <img class="doc-icon delete" src="./common/img/doc_delete.png">
                            </div>
                        </div>`);
                    }
                },
                error: function (xhr, status, error) {
                    layer.msg("获取失败", {icon: 2})
                }
            });
        }
    }


    //删除或者放大图片
    function clickEvent(option) {
        // 在此处执行点击删除图标后的逻辑
        $(option.id).on('click', '.delete', function () {
            let that = $(this);
            let id = that.parent().parent(".doc-item-bg").data("id");
            that.parent().parent(".doc-item-bg").remove();
            showAddBtn(option);
            let index = option.value.indexOf(id);
            if (index !== -1) {
                option.value.splice(index, 1);
            }
            $(option.id + " input[name='" + option.name + "']").val(option.value.join(','));
        });

        // 在此处执行点击放大图标后的逻辑
        $(option.id).on('click', '.download', function () {
            let that = $(this);
            let id = that.parent().parent(".doc-item-bg").data("id");
            window.open(ctx_ + "document/file/download?fileId=" + id)
        });
    }

    //显示或隐藏添加按钮
    function showAddBtn(option) {
        let count = $(option.id + ' .doc-item-bg').length;
        if (option.num && count >= option.num) {
            $(".doc-uploadBtn").hide();
        } else {
            $(".doc-uploadBtn").show();
        }
    }

    function getFileType(file) {
        // 获取文件的扩展名
        const extension = file.name.split('.').pop().toLowerCase();

        // 定义常见文件类型和对应的扩展名列表
        const documentExtensions = ['doc', 'docx', 'odt'];
        const spreadsheetExtensions = ['xls', 'xlsx', 'ods'];
        const imageExtensions = ['jpg', 'jpeg', 'png', 'gif'];
        const pptExtensions = ['ppt', 'pptx', 'odp'];
        const archiveExtensions = ['zip', 'rar', '7z'];
        const textExtensions = ['txt', 'csv'];

        if (documentExtensions.includes(extension)) {
            return './common/img/icon-doc.png';
        } else if (spreadsheetExtensions.includes(extension)) {
            return './common/img/icon-xsl.png';
        } else if (imageExtensions.includes(extension)) {
            return './common/img/icon-image.png';
        } else if (pptExtensions.includes(extension)) {
            return './common/img/icon-ppt.png';
        } else if (archiveExtensions.includes(extension)) {
            return './common/img/icon-zip.png';
        } else if (textExtensions.includes(extension)) {
            return './common/img/icon-txt.png';
        } else {
            return './common/img/icon-file.png';
        }
    }


    exports('BeFileUpload', {
        render
    });
});