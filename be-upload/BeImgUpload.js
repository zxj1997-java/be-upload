/** BeImgUpload.js **/
layui.define(['jquery', 'layer', 'form'], function (exports) {
    let $ = layui.jquery;
    let layer = layui.layer;
    // 获取当前加载的 JavaScript 文件的路径
    let scriptUrl = document.currentScript.src;

    function BeImgUpload(option) {
        // 提取路径中的目录部分
        let directoryPath = scriptUrl.substring(0, scriptUrl.lastIndexOf('/') + 1);
        layui.link(directoryPath + "common/common.css")
        this.option = option;
        //数据预处理
        if (!this.option.readonly) {
            option.readonly = false;
        }
        if (typeof this.option.value === 'string') {
            this.option.value = this.option.value.split(',');
        } else {
            this.option.value = this.option.value ? this.option.value : [];
        }

        this.init();
    }


    BeImgUpload.prototype.init = function () {
        $(this.option.id).append(`<input type="hidden" multiple class="upload-hidden-input" name="${this.option.name}"/>`);
        this.addImg();

        if (!this.option.readonly && this.option.value.length < this.option.num) {
            $(this.option.id).append(`
                <div class="upload-wapper">
                    <i class="upload-icon"></i>
                    <input type="file" class="upload-input" multiple accept="${this.option.type ? this.option.type : 'image/*'}">
                </div>`);
        }

        this.appendChange();
        this.clickEvent();
    }

    BeImgUpload.prototype.appendChange = function () {
        let that = this;

        $(this.option.id + " input[type=file]").on('change', function (event) {
            let files = event.target.files;
            if (files.length > that.option.num) {
                layer.msg("上传文件数量不得超过" + this.option.num + "个", {icon: 0});
            }
            for (let file of files) {
                that.processFile(file);
            }
            $(that.option.id + " input[type=file]").val("");
        });
        $(this).val('');
    }

    BeImgUpload.prototype.processFile = function (file) {
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
                        $(`<div class="image-section" data-id="${result.data.id}">
                                <img class="image-show" src="${global.downLoadUrl}${result.data.id}">
                                <div class="image-shade"></div>
                               ${that.option.readonly ? '' : '<i class="delete-icon"></i>'}
                                <i class="zoom-icon"></i>
                            </div>`).insertBefore(that.option.id + ' .upload-wapper');
                        that.option.value.push(result.data.id);
                        $(that.option.id + " input[name='" + that.option.name + "']").val(that.option.value.join(','));
                        that.showAddBtn();
                    },
                    error: function (xhr, status, error) {
                        layer.msg("上传失败", {icon: 2});
                    }
                });
            }
        }
    }

    BeImgUpload.prototype.addImg = function () {
        let that = this;
        if (this.option.value) {
            for (let i = 0; i < this.option.value.length; ++i) {
                $(that.option.id).append(`
                <div class="image-section" data-id="${this.option.value[i]}">
                    <img class="image-show" src="${global.downLoadUrl}${this.option.value[i]}">
                    <div class="image-shade"></div>
                   ${this.option.readonly ? '' : '<i class="delete-icon"></i>'}
                    <i class="zoom-icon"></i>
                </div>`);
            }
            $(this.option.id + " input[name='" + this.option.name + "']").val(this.option.value.join(','));
        }
    }

    BeImgUpload.prototype.clickEvent = function () {
        let that = this;
        $(this.option.id).on('click', '.delete-icon', function () {
            let id = $(this).parent(".image-section").data("id");
            $(this).parent(".image-section").remove();
            let index = that.option.value.indexOf(id);
            if (index !== -1) {
                that.option.value.splice(index, 1);
            }
            $(that.option.id + " input[name='" + that.option.name + "']").val(that.option.value.join(','));
            that.showAddBtn();
        });

        $(this.option.id).on('click', '.zoom-icon', function () {
            let images = []; // 存储所有图片的数组
            let currentIndex = $(this).closest('.image-section').index(); // 当前点击的图片在父容器中的索引

            // 遍历所有 .image-section 元素
            $(that.option.id + ' .image-section').each(function () {
                let src = $(this).find('.image-show').attr('src');
                images.push({src: src});
            });

            let topWin = that.findTopWindow(window);
            let i = topWin.layer.photos({
                photos: {
                    "title": "图片",
                    "start": currentIndex - 1,
                    "data": images
                },
            });
        });
    }

    BeImgUpload.prototype.showAddBtn = function () {
        let count = $(this.option.id + ' .image-section').length;
        if (this.option.num && count < this.option.num) {
            $(this.option.id).find(".upload-wapper").show();
        } else {
            $(this.option.id).find(".upload-wapper").hide();
        }
    }


    BeImgUpload.prototype.findTopWindow = function (currentWindow) {
        while (currentWindow !== currentWindow.parent) {
            currentWindow = currentWindow.parent;
        }
        return currentWindow;
    }

    exports('BeImgUpload', {
        render: function (option) {
            return new BeImgUpload(option);
        }
    });
});

