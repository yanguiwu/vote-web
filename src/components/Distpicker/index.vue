<template>
  <div>
    <el-select v-model='province' placeholder='省' clearable style='width: 33.33%;' @change='onProvinceChange'>
      <el-option
        v-for='item in provinceOptions'
        :key='item.id'
        :label='item.label'
        :value='item.id'
      />
    </el-select>
    <el-select v-model='city' placeholder='市' clearable style='width: 33.33%;' @change='onCityChange'>
      <el-option
        v-for='item in cityOptions'
        :key='item.id'
        :label='item.label'
        :value='item.id'
      />
    </el-select>
    <el-select v-model='area' placeholder='区' clearable style='width: 33.33%;' @change='onAreaChange'>
      <el-option
        v-for='item in areaOptions'
        :key='item.id'
        :label='item.label'
        :value='item.id'
      />
    </el-select>
  </div>
</template>
	
<script lang="ts">
import { defineComponent, ref, onMounted, SetupContext, toRefs, watch } from 'vue'
import { getSysRegionCodeTree } from '/@/api/util'

export default defineComponent({
  props: {
    modelValue: {
      type: Array,
      default: () => ([])
    }
  },
  emits: ['update:modelValue'],
  setup(props, context: SetupContext) {
    const treeData = ref([])
    let province = ref()
    let provinceOptions = ref([])
    let city = ref()
    let cityOptions = ref([])
    let area = ref()
    let areaOptions = ref([])
    let currentValue = ref([])
    let { modelValue } = toRefs(props)

    const initTreeData = async() => {
      let data = await getSysRegionCodeTree()
      console.log('treeData data',data)
      treeData.value = data
      if(data && data.length) {
        provinceOptions.value = data[0].children
      }
      if(modelValue.value.length && !currentValue.value.length) {
        currentValue.value = [...modelValue.value]
        initOptions()
      }
    }

    const initOptions = () => {
      if(currentValue.value.length > 0) {
        province.value = currentValue.value[0]
        mapTree(treeData.value)
      }
      if(currentValue.value.length > 1) {
        city.value = currentValue.value[1]
        mapTree(cityOptions.value, true)
      }
      if(currentValue.value.length > 2) {
        area.value = currentValue.value[2]
      }
    }

    onMounted(initTreeData)
    watch(modelValue, (newValue: any) => { // 直接监听
      if(newValue.length && newValue.join(',') !== currentValue.value.join(',')) {
        currentValue.value = newValue
        initOptions()
      }
    })
    

    let emit = () => {
      let _arry: any = []
      if(province.value) {
        _arry.push(province.value)
      } 
      if(city.value) {
        _arry.push(city.value)
      } 
      if(area.value) {
        _arry.push(area.value)
      } 
      currentValue.value = _arry
      context.emit('update:modelValue',_arry)
    }

    let mapTree = (tree: any, isArea?: boolean | undefined) => {
      tree.map((item: any) => {
        if(item.id === province.value || item.id === city.value) {
          if(isArea) {
            areaOptions.value = item.children
          }else {
            cityOptions.value = item.children
          }
        }else if(item.children) {
          mapTree(item.children)
        }
      })
    }

    let onProvinceChange = (value: any) => {
      city.value = ''
      area.value = ''
      cityOptions.value = []
      areaOptions.value = []
      if(value) {
        mapTree(treeData.value)
      }
      emit()
    }

    let onCityChange = (value: any) => {
      area.value = ''
      areaOptions.value = []
      if(value) {
        mapTree(cityOptions.value, true)
      }
      emit()
    }

    let onAreaChange = () => {
      emit()
    }
	
    return {
      treeData,
      province,
      provinceOptions,
      city,
      cityOptions,
      area,
      areaOptions,
      onCityChange,
      onProvinceChange,
      onAreaChange
    }
  }
})
</script>