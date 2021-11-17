<template>
  <div class='layout flex h-screen'>
    <div class='layout-sidebar-mask fixed w-screen h-screen bg-black bg-opacity-25 z-20' :class='{"hidden": getMenubar.status !== 2 }' @click='changeCollapsed' />
    <div
      class='layout-sidebar flex flex-col h-screen transition-width duration-200 shadow'
      :class='{ 
        "w-64": getMenubar.status === 0 || getMenubar.status === 2, 
        "w-0": getMenubar.status === 3, 
        "w-16": getMenubar.status === 1, 
        "absolute z-30": getMenubar.status === 2 || getMenubar.status === 3, 
      }'
    >
      <div class='layout-sidebar-logo flex h-12 relative flex-center shadow-lg'>
        投票系统
      </div>
      <div class='layout-sidebar-menubar flex flex-1 overflow-hidden'>
        <layout-menubar />
      </div>
      <div v-if='orderList.length' class='left-bottom-fixed'>
        <!-- <el-collapse v-model='activeName' accordion>
          <el-collapse-item title='收起' name='1'> -->
        <div v-for='order in orderList' :key='order.id' class='order-list'>
          {{ order.subName }} 
          <span v-if='order.payStatus === 1 ' class='color-dark time'>
            {{ DateStringConvert(order.createTime) }}
          </span>
          <span v-else class='color-dark time'>
            {{ DateStringConvert(order.payTime) }}
          </span>
          <span class='num'>{{ order.payAmount }}</span> 
          <span v-if='order.payStatus === 1 ' class='color-danger'>
            未支付
          </span>
          <span v-else class='color-success'>
            已支付
          </span>
        </div>
        <!-- </el-collapse-item>
        </el-collapse> -->
      </div>
    </div>
    <div class='layout-main flex flex-1 flex-col overflow-x-hidden overflow-y-auto'>
      <div class='layout-main-navbar flex justify-between items-center h-12 shadow-sm overflow-hidden relative z-10'>
        <layout-navbar />
      </div>
      <div class='layout-main-content flex-1 overflow-hidden'>
        <layout-content />
      </div>
    </div>
    <div class='layout-sidebar-sidesetting fixed right-0 top-64 z-10'>
      <layout-side-setting />
    </div>
  </div>
</template>

<script lang='ts'>
import { defineComponent, onMounted, ref } from 'vue'
import LayoutContent from '/@/layout/components/content.vue'
import LayoutMenubar from '/@/layout/components/menubar.vue'
import LayoutNavbar from '/@/layout/components/navbar.vue'
import LayoutSideSetting from '/@/layout/components/sideSetting.vue'
import { throttle } from '/@/utils/tools'
import { useLayoutStore } from '/@/store/modules/layout'
import { voteQueryOrderList } from '/@/api/vote/index'
import { DateStringConvert } from '/@/utils/tools'

export default defineComponent ({
  name: 'Layout',
  components: {
    LayoutContent,
    LayoutMenubar,
    LayoutNavbar,
    LayoutSideSetting
  },
  setup() {
    const { changeTheme, changeDeviceWidth, changeCollapsed, getMenubar } = useLayoutStore()
    const orderList = ref([])
    let activeName = ref('1')
    changeTheme()

   
    onMounted(async() => {
      initOrderList()
      changeDeviceWidth()
      const throttleFn = throttle(300)
      let throttleF = async function() {
        await throttleFn()
        changeDeviceWidth()
      }
      window.addEventListener('resize', throttleF, true)
    })

    const initOrderList = async() => {
      let datas = await voteQueryOrderList({})
      let { data } = datas.data.body
      orderList.value = data
      setTimeout(() => {
        initOrderList()
      }, 2000)
    }
    return {
      getMenubar,
      changeCollapsed,
      orderList,
      activeName,
      DateStringConvert
    }
  }
})
</script>

<style lang='postcss' scoped>
  ::v-deep(.layout-sidebar-sidesetting .el-drawer__header) {
      margin-bottom: 0;
  }
  .left-bottom-fixed {
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 1000;
    background-color: #fff;
    padding: 10px;
    border: 1px solid #e0e0e0;
    font-size: 12px;
    .order-list {
      line-height: 1.3;
      margin-top: 10px;
    }
    .time {
      display: inline-block;
      vertical-align: top;
      width: 70px;
    }
    .num {
      min-width: 30px;
      display: inline-block;
      font-weight: bold;
      color: orange;
      font-size: 16px;
      margin: 0 3px
    }
  }

</style>