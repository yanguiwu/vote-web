<template>
  <div v-loading='loading' class='editor'>
    <textarea :id='cid' :disabled='disabled' />
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, toRefs, onMounted, onUnmounted, watch, getCurrentInstance } from 'vue'
export default defineComponent({
  props: {
    value: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'Thread' // Thread,Minimal,Simple
    },
    contentsCss: {
      type: String,
      default: ''
    },
    fontSizeDefaultLabel: {
      type: String,
      default: ''
    },
    inline: {
      type: [Boolean],
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  emits: ['change', 'blur', 'focus'],
  setup(props, context) {
    let ckeditor: any = null
    let uploader: any = null

    let cid = ref((Math.random() * 10000).toFixed().toString())
    let loading = ref(true)

    let { value, type, contentsCss, fontSizeDefaultLabel, inline, disabled } = toRefs(props)

    const initUploader = () => {
      uploader = WebUploader.create({
        swf: CKEDITOR.getUrl('plugins/uploadpictures/webuploader/Uploader.swf'),
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
          title: 'Images',
          extensions: 'gif,jpg,jpeg,bmp,png,ico',
          mimeTypes: 'image/*'
        }
      })
      uploader.on('uploadBeforeSend', function(obj, data, headers) {
        $.ajaxSettings.async = false
        let sendData = {
          name: obj.file.name
        }
        console.log('sendData', sendData)
        $.ajax({
          url: `${window.VUE_APP_BASE_API}/upload/public/init`,
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
      })
      uploader.on('uploadSuccess', (file, response) => {
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
        $.ajax({
          url: `${window.VUE_APP_BASE_API}/upload/public/finish/other`,
          data: JSON.stringify(sendData),
          type: 'post',
          contentType: false,
          dataType: 'json',
          processData: false,
          success: res => {
            CKEDITOR.instances[this.cid].insertHtml(
              `<img src="${res.body}" alt="" />`
            )
          },
          error: function() {}
        })
      })
    }
    const SetCKEditor = (id: any) => {
      const internalInstance = getCurrentInstance()
      console.log('internalInstance',internalInstance)
      console.log('internalInstance',document)
      CKEDITOR.instances[id].on('instanceReady', function(e) {
        ckeditor.setData(value)
        this.document.on('paste', function(e) {
          let { items } = e.data.$.clipboardData
          for (let i = 0; i < items.length; ++i) {
            let item = items[i]
            if (item.kind == 'file' && item.type == 'image/png') {
              let imgFile = item.getAsFile()
              if (!imgFile) {
                return true
              }
              uploader.addFiles(imgFile)
              uploader.upload()
              return false
            }
          }
        })
      })
    } 
    const regiterUploader = () => {
      if (window.CKEDITOR_UPLOAD_SERVER) {
        initUploader()
      }
    }
    const initCKEditor = () => {
      let op = {
        toolbar: type.value,
        contentsCss: contentsCss.value,
        fontSize_defaultLabel: fontSizeDefaultLabel.value
      }
      console.log('CKEDITOR2',inline)
      if (false) {
        CKEDITOR.disableAutoInline = false
        ckeditor = CKEDITOR.inline(cid.value, op)
      } else {
        ckeditor = CKEDITOR.replace(cid.value, op)
      }
      loading.value = false
      ckeditor.on('change', function() {
        context.emit('change', ckeditor.getData())
      })
      ckeditor.on('blur', function() {
        context.emit('blur')
        context.emit('change', ckeditor.getData()) // fixIE上中午输入无法触发change事件
      })
      ckeditor.on('focus', function() {
        context.emit('focus')
      })
      regiterUploader()
      SetCKEditor(cid.value)
    }

    onMounted(() => {
      initCKEditor()
    })

    onUnmounted(() => {
      ckeditor.destroy()
    })

    watch(value,(newValue:string) => {
      if (newValue !== ckeditor.getData()) {
        if (CKEDITOR.instances[cid.value]) {
          CKEDITOR.instances[cid.value].destroy()
          loading.value = true
          setTimeout(() => {
            initCKEditor()
          }, 300)
        }
      }
    })

    return {
      cid,
      ckeditor,
      uploader,
      loading
    }
  }

})

</script>

<style lang="postcss" scoped>
.editor {
  textarea {
    border: none;
  }
}
</style>
