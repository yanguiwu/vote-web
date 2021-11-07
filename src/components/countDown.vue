<template>
  {{ diffMs }}
  <countdown
    :time='diffMs'
    format='DD天HH小时mm分ss秒'
  />
</template>

<script lang="ts">
import { defineComponent, toRefs } from 'vue'
import Countdown from 'vue3-countdown'
export default defineComponent({
  components: { Countdown },
  props: {
    startTime: {
      type: String,
      default: ''
    },
    endTime: {
      type: String,
      default: ''
    }
  },
  setup(props, context) {
    let { startTime, endTime } = toRefs(props)
    let diffMs = 0
    if(startTime.value && endTime.value) {
      diffMs = Math.ceil((new Date(startTime.value).getTime() - new Date(endTime.value).getTime()) / 1000)
    }
    return {
      diffMs
    }
  }
})
</script>

<style lang='postcss'>
.slide-fade-enter-active {
  transition: all .5s ease;
}

.slide-fade-enter-from{
  transform: translateY(-5px);
  opacity: 0;
}
</style>