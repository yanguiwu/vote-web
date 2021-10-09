<template>
  <div>
    <el-input
      v-if='!modelValue'
      size='medium'
      :placeholder='placeholder'
      suffix-icon='el-icon-edit'
      @focus='onFocuse'
    />
    <transition name='slide-fade'>
      <div v-if='modelValue'>
        <slot />
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent } from 'vue'
export default defineComponent({
  props: {
    placeholder : {
      type: String,
      default: ''
    },
    modelValue: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue'],
  setup(props, context) {
    const onFocuse = () => {
      console.log('modelValue1')
      context.emit('update:modelValue',true)
    } 
    return {
      onFocuse
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