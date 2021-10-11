(function() {
  "use strict";
  var uploader = null;
  var uploading = false;

  function initUpload(editor) {
    uploader = WebUploader.create({
      swf: CKEDITOR.getUrl("plugins/uploadpictures/webuploader/Uploader.swf"),
      server: window.CKEDITOR_UPLOAD_SERVER, // @TODO 通过接口去拿取
      compress: {
        width: 1200,
        height: 8000,
        quality: 90,
        allowMagnify: false,
        crop: false,
        preserveHeaders: true
      },
      resize: false,
      fileNumLimit: 10,
      threads: 1,
      fileSingleSizeLimit: 1024 * 1024 * 1024,
      accept: {
        title: "Images",
        extensions: "gif,jpg,jpeg,bmp,png,ico",
        mimeTypes: "image/*"
      }
    });

    uploader.on("uploadBeforeSend", function(obj, data, headers) {
      var sendData = {
        name: obj.file.name
      };
      if (window.CKEDITOR_UPLOAD_INIT) {
        $.ajaxSettings.async = false;
        $.ajax({
          url: window.CKEDITOR_UPLOAD_INIT,
          data: JSON.stringify(sendData),
          type: "post",
          contentType: false,
          dataType: "json",
          processData: false,
          success: function(res) {
            res.body.paramNames.map(function(item) {
              data[item] = res.body.formData[item];
            });

            if (res.body.ignoreParams && res.body.ignoreParams.length > 0) {
              res.body.ignoreParams.map(function(item) {
                delete data[item];
              });
            }
          }
        });
        $.ajaxSettings.async = true;
      }
    });
    uploader.on("uploadSuccess", function(file, response) {
      var sendData = {
        size: file.size,
        contentType: file.type,
        name: file.name
      };
      if (response && response.url) {
        sendData.path = response.url;
      }
      if (response && response.key) {
        sendData.path = response.key;
      }
      // if (response && response._raw) {
      //   var start = response._raw.indexOf("<Key>") + 5;
      //   var end = response._raw.indexOf("</Key>");
      //   sendData.path = response._raw.substr(start, end - start);
      // }
      if (window.CKEDITOR_UPLOAD_FINISH) {
        $.ajax({
          url: window.CKEDITOR_UPLOAD_FINISH,
          data: JSON.stringify(sendData),
          type: "post",
          contentType: false,
          dataType: "json",
          processData: false,
          success: function(res) {
            console.log("res", res);
            editor.insertHtml('<img src="' + res.body + '" />');
            CKEDITOR.dialog.getCurrent().hide();
            uploading = false;
          },
          error: function() {
            uploading = false;
          }
        });
      }
    });
  }

  function iframeSrcPath(srcpath) {
    var filename = "dialogs/kityformula.js",
      scripts = document.getElementsByTagName("script"),
      script = null,
      len = scripts.length;

    for (var i = 0; i < scripts.length; i++) {
      if (scripts[i].src.indexOf(filename) != -1) {
        script = scripts[i];
        break;
      }
    }

    if (script) {
      var src = script.src;
      src = src.substr(0, src.lastIndexOf("/") + 1);

      return src + srcpath;
    }
  }

  function KityformulaDialog(editor) {
    //防止modal关闭后重新打开创建多个iframe导致BUG
    if ($("#editorContainer_" + editor.name).length > 0) {
      $("#editorContainer_" + editor.name).remove();
    }
    var html =
      '<iframe scrolling="no" id="editorContainer_' +
      editor.name +
      '" src="' +
      iframeSrcPath("../kityformula/index.html") +
      '" style="width: 100% !important; height: 300px !important"></iframe>';

    if (window.CKEDITOR_UPLOAD_SERVER) {
      initUpload(editor);
    } else {
      alert("缺少上传地址，请刷新重试");
    }
    return {
      title: "公式编辑器",
      minWidth: 780,
      minHeight: 300,
      resizable: CKEDITOR.DIALOG_RESIZE_NONE,
      buttons: [
        CKEDITOR.dialog.cancelButton,
        {
          type: "button",
          id: "buttonId",
          label: "确定",
          title: "My title",
          className: "cke_dialog_ui_button_ok",
          onClick: function() {
            if (uploading) {
              return;
            }
            uploading = true;
            var kfe = $("#editorContainer_" + editor.name)[0].contentWindow.kfe;
            kfe.execCommand("get.image.data", function(_data) {
              console.log("data.img", _data.img);
              var file = dataURLtoFile(_data.img);
              uploader.addFiles(file);
              uploader.upload();
            });
          }
        }
      ],
      contents: [
        {
          id: "kityformula",
          label: "公式编辑器",
          title: "公式编辑器",
          expand: true,
          padding: 0,
          elements: [
            {
              type: "html",
              html: html
            }
          ]
        }
      ],
      onLoad: function() {},
      onShow: function() {
        var kfe = $("#editorContainer_" + editor.name)[0].contentWindow.kfe;
        if (kfe) {
          kfe.execCommand("render", "\\placeholder");
        }
      },
      onHide: function() {},
      onCancel: function() {
        // alert('onCancel');
      }
    };
  }
  function dataURLtoFile(dataurl, filename) {
    //将base64转换为文件
    var arr = dataurl.split(","),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    // return new File([u8arr], filename, { type: mime });
    return new Blob([u8arr], { type: mime });
  }

  CKEDITOR.dialog.add("kityformula", function(editor) {
    return KityformulaDialog(editor);
  });
})();
