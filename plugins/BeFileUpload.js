/** BeFileUpload.js **/
layui.define(['jquery', 'layer', 'form'], function (exports) {
    let $ = layui.jquery;
    let layer = layui.layer;

    function BeFileUpload(option) {
        this.option = option;
        //数据预处理
        if (!this.option.readonly) {
            option.readonly = false;
        }
        if (typeof this.option.value === 'string') {
            return this.option.value.split(',');
        } else {
            this.option.value = this.option.value ? this.option.value : [];
        }
        this.init();
    }

    BeFileUpload.prototype.init = function () {
        $(this.option.id).css("display", "grid");
        $(this.option.id).append(`<input type="hidden" class="upload-hidden-input" name="${this.option.name}"/>`);
        this.addFiles();

        if (!this.option.readonly && this.option.value.length < this.option.num) {
            $(this.option.id).append(`
            <div class="doc-tips-group block">
                <span class="doc-tips block">≤10M,支持 doc, docx, xls, xsx</span>
                <div class="doc-uploadBtn">
                    <i style="font-style: normal;">上传</i>
                    <input class="upload-input" type="file" accept="${this.option.type ? this.option.type : 'image/*'}"/>
                </div>
            </div>`);
        }

        this.appendChange();
        this.clickEvent();
    };

    BeFileUpload.prototype.appendChange = function () {
        let that = this;
        $(this.option.id + " input[type=file]").on('change', function (event) {
            let files = event.target.files;
            let file = files[0];
            that.processFile(file);
            $(that.option.id + " input[type=file]").val("");
        });
        $(this).val('');
    };

    BeFileUpload.prototype.processFile = function (file) {
        let that = this;
        if (file) {
            if (that.option.size && that.option.size <= file.size / 1024 / 1024) {
                layer.msg("上传文件大小不得超过" + that.option.size + "M", {icon: 0});
            } else {
                let formData = new FormData();
                formData.append("file", file);
                $.ajax({
                    url: global.uploadUrl,
                    data: formData,
                    type: "post",
                    processData: false,
                    contentType: false,
                    success: function (result) {
                        $(that.option.id).append(`
                            <div data-id="${result.id}" class="doc-item-bg">
                                <img class="doc-img" src="${that.getFileType(file)}">
                                <div class="block doc-info-detail">
                                    <span class="doc-title">${result.fileName}</span> 
                                    <span class="doc-desc">${Math.round(result.fileSize / 1024)}KB</span>
                                </div>
                                <div class="block doc-icon-group">
                                    <img class="doc-icon download" src="./common/img/doc_download.png">
                                    <img class="doc-icon delete" src="./common/img/doc_delete.png">
                                </div>
                            </div>`
                        );
                        that.value.push(result.id);
                        $(that.option.id + " input[name='" + that.option.name + "']").val(that.value.join(','));
                        that.showAddBtn();
                    },
                    error: function (xhr, status, error) {
                        layer.msg("上传失败", {icon: 2});
                    }
                });
            }
        }
    };

    BeFileUpload.prototype.addFiles = function () {
        let that = this;
        if (that.value) {
            $(that.option.id + " input[name='" + that.option.name + "']").val(that.value.join(','));
            that.showAddBtn();
            $.ajax({
                url: global.findFileByIdUrl,
                data: JSON.stringify(that.value),
                contentType: 'application/json;charset=UTF-8',
                type: "post",
                success: function (result) {
                    for (let i = 0; i < result.length; i++) {
                        $(that.option.id).append(`
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
                            </div>`
                        );
                    }
                },
                error: function (xhr, status, error) {
                    layer.msg("获取失败", {icon: 2});
                }
            });
        }
    };

    BeFileUpload.prototype.clickEvent = function () {
        let that = this;
        // Execute logic when clicking on delete icon
        $(this.option.id).on('click', '.delete', function () {
            let that = $(this);
            let id = that.parent().parent(".doc-item-bg").data("id");
            that.parent().parent(".doc-item-bg").remove();
            that.showAddBtn();
            let index = that.value.indexOf(id);
            if (index !== -1) {
                that.value.splice(index, 1);
            }
            $(that.option.id + " input[name='" + that.option.name + "']").val(that.value.join(','));
        });

        // 单击下载图标时执行逻辑
        $(this.option.id).on('click', '.download', function () {
            let that = $(this);
            let id = that.parent().parent(".doc-item-bg").data("id");
            window.open(global.downLoadUrl + id);
        });
    };

    BeFileUpload.prototype.showAddBtn = function () {
        let count = $(this.option.id + ' .doc-item-bg').length;
        if (this.option.num && count >= this.option.num) {
            $(".doc-uploadBtn").hide();
        } else {
            $(".doc-uploadBtn").show();
        }
    };

    BeFileUpload.prototype.getFileType = function (file) {
        const extension = file.name.split('.').pop().toLowerCase();

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
    };

    exports('BeFileUpload', {
        render: function (option) {
            return new BeFileUpload(option);
        }
    });
});
