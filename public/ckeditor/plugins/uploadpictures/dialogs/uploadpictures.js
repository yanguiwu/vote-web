CKEDITOR.dialog.add('uploadpictures', function(editor) {
  let imageHtml = '',
    uploader
  let lang = editor.lang.uploadpictures

  let initUpload = function() {
    let { fileSingleSizeLimit } = editor.config

    uploader = WebUploader.create({
      swf: CKEDITOR.getUrl('plugins/uploadpictures/webuploader/Uploader.swf'),
      server: window.CKEDITOR_UPLOAD_SERVER, // @TODO 通过接口去拿取
      pick: `.${editor.id} .ckeditor-uploadpictures-pick-btn`,
      compress: {
        width: 1200,
        height: 8000,
        quality: 90,
        allowMagnify: false,
        crop: false,
        preserveHeaders: true
      },
     
      headers: {
        'x-auth-token': '37e07447-a74a-4372-a652-c8434d7cd783'
      },
      resize: false,
      fileNumLimit: 10,
      threads: 1,
      fileVal: 'uploadFile',
      fileSingleSizeLimit: fileSingleSizeLimit * 1024 * 1024,
      accept: {
        title: 'Images',
        extensions: 'gif,jpg,jpeg,bmp,png,ico',
        mimeTypes:
          'image/gif,image/jpg,image/jpeg,image/bmp,image/png,image/ico'
      }
    })

    $('.js-start-upload-btn').on('click', function() {
      uploader.upload()
    })

    uploader.on('uploadBeforeSend', function(obj, data, headers) {
      return
      let sendData = {
        name: obj.file.name
      }
      console.log('window.CKEDITOR_UPLOAD_INIT',window.CKEDITOR_UPLOAD_INIT)
      // public和private
      if (window.CKEDITOR_UPLOAD_INIT) {
        $.ajaxSettings.async = false
        $.ajax({
          url: window.CKEDITOR_UPLOAD_INIT,
          data: JSON.stringify(sendData),
          type: 'post',
          contentType: false,
          dataType: 'json',
          processData: false,
          success: function(res) {
            res.body.paramNames.map(function(item) {
              data[item] = res.body.formData[item]
            })

            if (res.body.ignoreParams && res.body.ignoreParams.length > 0) {
              res.body.ignoreParams.map(function(item) {
                delete data[item]
              })
            }
          }
        })
        $.ajaxSettings.async = true
      }
    })

    uploader.on('error', function(errorCode) {
      if (errorCode == 'Q_TYPE_DENIED') {
        alert(
          lang.file_type_tip + uploader.options.accept[0].extensions.join(',')
        )
      } else if (errorCode == 'F_EXCEED_SIZE') {
        alert(
          lang.single_file_max_size_tip +
            filesize(uploader.options.fileSingleSizeLimit)
        )
      }
    })

    uploader.on('fileQueued', function(file) {
      $(`.${editor.id} .balloon-nofile`).remove()
      let $list = $(`.${editor.id} .balloon-filelist ul`)
      $list.append(
        `<li id="${ 
          file.id 
        }">` +
          `  <div class="file-name">${ 
            file.name 
          }</div>` +
          `  <div class="file-size">${ 
            filesize(file.size) 
          }</div>` +
          `  <div class="file-status">${ 
            lang.waiting_upload_text 
          }</div>` +
          `  <div class="file-remove">${ 
            lang.delete_text 
          }</div>` +
          '  <div class="file-progress"><div class="file-progress-bar" style="width: 0%;"></div></div>' +
          '</li>'
      )
    })

    $(`.${editor.id} .balloon-filelist`).delegate(
      '.file-remove',
      'click',
      function() {
        uploader.removeFile(
          $(this)
            .parent('li')
            .attr('id'),
          true
        )
        $(this)
          .parent()
          .remove()
      }
    )

    uploader.on('uploadProgress', function(file, percentage) {
      let $li = $(`.${editor.id} #${file.id}`)
      percentage = `${(percentage * 100).toFixed(2)}%`
      $li.find('.file-status').html(percentage)
      $li.find('.file-progress-bar').css('width', percentage)
    })

    uploader.on('uploadSuccess', function(file, response) {
      let sendData = {
        size: file.size,
        contentType: file.type,
        name: file.name
      }
      if (response && response.url) {
        sendData.path = response.url
      }
      if (response && response.key) {
        sendData.path = response.key
      }
      // if (response && response._raw) {
      //   var start = response._raw.indexOf("<Key>") + 5;
      //   var end = response._raw.indexOf("</Key>");
      //   sendData.path = response._raw.substr(start, end - start);
      // }
      console.log('sendData', sendData)
      if (window.CKEDITOR_UPLOAD_FINISH) {
        $.ajax({
          url: window.CKEDITOR_UPLOAD_FINISH,
          data: JSON.stringify(sendData),
          type: 'post',
          contentType: false,
          dataType: 'json',
          processData: false,
          success: function(res) {
            console.log('res', res)
            imageHtml += `<img src="${res.body}" />`
            let $li = $(`.${editor.id} #${file.id}`)
            $li.find('.file-status').html(lang.uploaded_text)
            $li.find('.file-progress-bar').css('width', '0%')
            $li.find('.file-remove').remove()
          }
        })
      } else {
        console.log('response', response)
        imageHtml += `<img src="${response.body.url}" />`
        let $li = $(`.${editor.id} #${file.id}`)
        $li.find('.file-status').html(lang.uploaded_text)
        $li.find('.file-progress-bar').css('width', '0%')
        $li.find('.file-remove').remove()
      }
    })
  }

  let onLoadDialog = function() {
    if (window.CKEDITOR_UPLOAD_SERVER) {
      initUpload()
    } else {
      alert('缺少上传地址，请刷新重试')
    }
  }
  let dialogDefinition = {
    title: editor.lang.uploadpictures.title,
    minWidth: 600,
    minHeight: 280,
    resizable: CKEDITOR.DIALOG_RESIZE_BOTH,
    buttons: [CKEDITOR.dialog.cancelButton, CKEDITOR.dialog.okButton],
    contents: [
      {
        id: 'uploadpictures',
        label: editor.lang.uploadpictures.title,
        title: editor.lang.uploadpictures.title,
        expand: true,
        elements: [
          {
            id: 'body',
            type: 'html',
            html: '<div class="js-uploadpictures-body"></div>'
          }
        ]
      }
    ],

    onLoad: function() {
      $(`.${editor.id} .js-uploadpictures-body`).css({
        'vertical-align': 'top'
      })
      $(`.${editor.id} .js-uploadpictures-body`).load(
        CKEDITOR.getUrl('plugins/uploadpictures/html/index_zh-cn.html'),
        onLoadDialog
      )
    },

    onOk: function() {
      if (uploader.isInProgress()) {
        alert(lang.waiting_finish_tip)
        return false
      }

      if (uploader.getFiles('inited').length > 0) {
        // 未点击上传
        if (!confirm(lang.confirm_clear_tip)) {
          return false
        }
      }
      console.log('imageHtml', imageHtml)
      if (imageHtml) {
        editor.insertHtml(imageHtml, 'unfiltered_html')
        // editor.insertElement(new CKEDITOR.dom.element.createFromHtml(imageHtml));
        imageHtml = '' // 清空
      }
      // 关闭对话框后清除上传列表，因为列表有数量限制
      uploader.reset()
      $(`.${editor.id} .balloon-filelist ul`).empty()
    }
  }

  return dialogDefinition
})
