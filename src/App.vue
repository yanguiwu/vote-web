<template>
  <router-view />
</template>

<script lang='ts'>
import { defineComponent } from 'vue'
import { changeThemeDefaultColor } from '/@/utils/changeThemeColor'

export default defineComponent ({
  name: 'App',
  setup() {
    window.CKEDITOR_UPLOAD_SERVER = 'http://api.yanguiwu.com/yanguiwu'
    changeThemeDefaultColor()
  }
})
</script>
