<template>
  <div>
    <editor
      v-if='initEditor'
      :value='value'
      :type='type'
      :disabled='disabled'
      :contents-css='contentsCss'
      :font-size-default-label='fontSizeDefaultLabel'
      :inline='inline'
      @blur='onBlur'
      @focus='onFocus'
      @change='onChange'
    />
  </div>
</template>
<script lang="ts">
import editor from './editor.vue'
import { defineComponent, ref, onMounted, onUnmounted } from 'vue'
export default defineComponent({
  components: { editor },
  props: {
    value: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'Thread' // Thread,Minimal,Simple,Img
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
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  emits: ['blur', 'focus', 'input', 'change'],
  setup(props, context) {
    const initEditor = ref(false)
    const initUploadServer = () => {
      window.$.get(`${import.meta.env.VUE_APP_BASE_API}/upload/public/server`,(data: any) => {
        if (data.body) {
          window.CKEDITOR_UPLOAD_SERVER = data.body
          initEditor.value = true
        }
      })
    }
    const onBlur = () => {
      context.emit('blur')
    }
    const onFocus = () => {
      context.emit('focus')
    }
    const onChange = (value: string) => {
      context.emit('input', value)
      if (value) {
        context.emit('change', value)
      }
    }

    onMounted(() => {
      // CKEDITOR_UPLOAD_SERVER   文件上传的地址，如果不上传到第三方（七牛去）直接配置window.CKEDITOR_UPLOAD_SERVER="当前后端项目的上传地址"
      // CKEDITOR_UPLOAD_INIT     图片上传前授权地址（七牛云上传需授权）
      // CKEDITOR_UPLOAD_INIT     图片上传后处理（七牛云上传成功后需保存到业务）
      setTimeout(() => {
        if (window.CKEDITOR_UPLOAD_SERVER) {
          initEditor.value = true
        } else {
          initUploadServer()
        }
      }, 300)
      window.CKEDITOR_UPLOAD_INIT =
        `${import.meta.env.VUE_APP_BASE_API}/upload/public/init` // 图片上传前授权
      window.CKEDITOR_UPLOAD_FINISH =
        `${import.meta.env.VUE_APP_BASE_API}/upload/public/finish/other` // 图片上传后处理
    })
    onUnmounted(() => {
      window.CKEDITOR_UPLOAD_SERVER = ''
      window.CKEDITOR_UPLOAD_INIT = ''
      window.CKEDITOR_UPLOAD_FINISH = ''
    })

    return {
      initEditor,
      initUploadServer,
      onBlur,
      onFocus,
      onChange
    }
  }

})

</script>
<style scope>
.error-message {
  color: #ff4949;
  font-size: 12px;
}
</style>
<style lang="postcss">
.cke_textarea_inline {
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 5px;
  line-height: 1.4;
  min-height: 80px;
  img {
    max-width: 100%;
    vertical-align: top;
  }
}
</style>
