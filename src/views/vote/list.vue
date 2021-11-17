<template>
  <el-card>
    <template #header>	
      <div class='justify-between'>
        <span>投票评选列表</span>
        <span>
          <el-button type='success' size='mini' @click='handleCreateClick'>添加活动</el-button>
        </span>
      </div>
    </template>
    <el-form :inline='true' :model='formData' class='demo-form-inline'>
      <el-form-item>
        <el-input v-model='formData.title' size='mini' placeholder='输入主题名关键字' style='width: 146px' class='mr-2' />
        开始日期：
        <el-date-picker v-model='formData.startTime' size='small' type='datetime' style='width: 200px' format='YYYY-MM-DD HH:mm:ss' value-format='YYYYMMDDHHmmss' />
        <el-date-picker v-model='formData.endTime' size='small' type='datetime' style='width: 200px' format='YYYY-MM-DD HH:mm:ss' value-format='YYYYMMDDHHmmss' class='mr-2' />
        <el-button type='primary' size='mini' class='mr-5' @click='handleSearch'>搜索</el-button>
        <el-button type='danger' size='mini' @click='()=>handleChangeFilter()'>全部活动</el-button>
        <el-button type='primary' size='mini' @click='()=>handleChangeFilter("infoStatus", 2)'>进行中</el-button>
        <el-button type='primary' size='mini' @click='()=>handleChangeFilter("infoStatus", 3)'>已结束</el-button>
        <el-button type='primary' size='mini' @click='()=>handleChangeFilter("infoStatus", 1)'>未开始</el-button>
        <div>
          <el-button type='primary' size='mini' @click='()=>handleChangeFilter("todayStatus", 4)'>今日开始</el-button>
          <el-button type='primary' size='mini' @click='()=>handleChangeFilter("todayStatus", 5)'>今日结束</el-button>
          <!-- <el-button type='primary' size='mini'>礼物记录</el-button>
          <el-button type='primary' size='mini'>投票记录</el-button>
          <el-button type='primary' size='mini'>举报记录</el-button> -->
          <!-- <el-button type='primary' size='mini'>2021-10-10</el-button>
          <el-button type='primary' size='mini'>2021-10-11</el-button>
          <el-button type='primary' size='mini'>2021-10-12</el-button> -->
        </div>
      </el-form-item>
    </el-form>
    <el-divider v-if='isAdmin' class='mt-1 mb-4' />
    <div v-if='isAdmin' class='mb-2'>
      <el-button type='danger' size='mini' @click='handleBetchDelete'>批量删除</el-button>
    </div>
    <el-table :data='listData' border @selection-change='handleSelectionChange'>
      <el-table-column v-if='isAdmin' type='selection' width='55' :selectable='selectable' />
      <el-table-column
        prop='fileWebPath'
        label='图片'
      >
        <template #default='scope'>
          <img :src='scope.row.fileWebPath' height='50px'>
        </template>
      </el-table-column>

      <el-table-column
        prop='title'
        label='活动名称'
      />
      <el-table-column label='投票时间' width='150px'>
        <template #default='scope'>
          {{ DateStringConvert(scope.row.startVoteTime) }}
          <br>
          {{ DateStringConvert(scope.row.endVoteTime) }}
          <br>
          <el-button v-if='scope.row.countDown && scope.row.countDown > 0 && scope.row.infoStatus == 2' size='mini' type='success'> 
            <Countdown :time='scope.row.countDown* 1000' format='DD天HH小时mm分ss秒' />
          </el-button>
        </template>
      </el-table-column>
      <el-table-column
        label='选手数量'
        prop='subNum'
        width='60px'
      />
      <el-table-column label='投票量' min-width='100px' class='text-center'>
        <template #default='scope'>
          <span class='color-danger'>{{ scope.row.ticketNum }}</span> / {{ scope.row.voteNum }}
        </template>
      </el-table-column>
      <el-table-column label='礼物' min-width='120px' width='60px'>
        <template #default='scope'>
          <div class='color-danger text-center'>{{ scope.row.payAmount }}</div> 
        </template>
      </el-table-column>
      <el-table-column
        label='浏览量'
        width='120px'
      >
        <template #default='scope'>
          <div class='text-left'> {{ scope.row.visitNum + scope.row.initialNum }}</div>
          <div class='justify-between'>
            <el-input
              v-model='listData[scope.$index].addInitialNum'
              style='width: 60px;'
              type='number'
              size='mini'
            />
            <el-button icon='el-icon-plus' size='mini' @click='() => handleAddVisitNum(scope.row)' />
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop='invitationName'
        label='链接'
        width='70px'
      >
        <template #default='scope'>
          <QrcodeVue :value='getUrl(scope.row)' size='50' level='H' />
        </template>
      </el-table-column>
      <el-table-column
        prop='infoStatus'
        width='60px'
        label='状态'
      >
        <template #default='scope'>
          <div>
            <div v-if='scope.row.infoStatus == 2' class='color-success'>{{ infoStatusStr(scope.row.infoStatus) }}</div>
            <div v-else class='color-danger'>{{ infoStatusStr(scope.row.infoStatus) }}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop='remark'
        label='备注'
        width='60px'
      />
      <el-table-column label='操作' width='270px'>
        <template #default='scope'>
          <div class='text-left'>
            <el-button
              size='mini'
              type='info'
              @click='()=>handleGoPlayer(scope.row.id, "voteListPlayer")'
            >选管</el-button>
            <!-- <el-button
            size='mini'
            type='info'
            @click='()=>handleGoPlayer(scope.row.id, "voteListComplain")'
          >举报</el-button> -->
            <el-button
              size='mini'
              type='info'
              @click='()=>handleGoPlayer(scope.row.id, "voteListPay")'
            >礼物</el-button>
            <el-button
              size='mini'
              type='info'
              @click='()=>handleGoPlayer(scope.row.id, "voteListRecord")'
            >投票</el-button>
            <el-button
              size='mini'
              type='info'
              @click='()=>handleCopyVote(scope.row.id)'
            >复制添加</el-button>
            <div class='mt-2'>
              <el-button
                size='mini'
                type='info'
                @click='()=>handleGoPlayer(scope.row.id, "voteListRand")'
              >添加随机投票</el-button>
              <!-- status  0未发布 1已发布 2已删除 3已关闭 -->
              <el-button
                v-if='scope.row.status === 0'
                size='mini'
                type='info'
                @click='()=> handleChangeStatus(scope.row.id,1)'
              >开启</el-button>
              <el-button
                v-if='scope.row.status === 1 && isAdmin'
                size='mini'
                type='info'
                @click='()=> handleChangeStatus(scope.row.id,3)'
              >关闭</el-button>
              <el-button
                v-if='scope.row.status === 0'
                size='mini'
                type='info'
                @click='()=>handleGoPlayer(scope.row.id, "voteListEdit")'
              >编辑</el-button>
              <el-button
                v-if='scope.row.status != 0'
                size='mini'
                type='info'
                @click='()=>handleGoPlayer(scope.row.id, "voteListShow")'
              >查看</el-button>
              <el-button
                v-if='scope.row.status === 0 || isAdmin '
                size='mini'
                type='info'
                @click='()=>handleDelete(scope.row.id)'
              >删除</el-button>
            </div>
          </div>
        </template>
      </el-table-column>
    </el-table>
    
    <el-pagination layout='prev, pager, next' :total='pageData.recordCount' @current-change='pCurrentChange' />
  </el-card>
</template>
  
<script lang="ts">
import { ref,defineComponent, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { queryVoteList, copyVote, editStatus, voteUpdateView } from '/@/api/vote/index'
import { ElMessage , ElMessageBox } from 'element-plus'
import { DateStringConvert, statusStr, infoStatusStr } from '/@/utils/tools'
import QrcodeVue from 'qrcode.vue'
import { useLayoutStore } from '/@/store/modules/layout'
import Countdown from 'vue3-countdown'
const { getUserInfo } = useLayoutStore()
const isAdmin = getUserInfo.type == 'isAdmin'

const initPageData = () => {
  return {
    current: 1,
    size: 10,
    recordCount: 0,
    count: 1
  }
}
const initFormData = () => {
  return { 
    startTime: '',
    endTime: '',
    title: '',
    status: '', // 1 未开始 2 进行中 3已结束
    todayStatus: '' // 4 今日开始  5 今日结束
  }
}
export default defineComponent({
  components: {
    QrcodeVue,
    Countdown
  },
  emits:['on-search'],
  setup() {
    const router = useRouter()
    const formData = ref(initFormData())
    const listData = ref([])
    const multipleSelection = ref([])
    let pageData = ref(initPageData())
    const handleSelectionChange = (value: any) => {
      multipleSelection.value = value
    }
    const handleSearch = () => {
      pageData.value = initPageData()
      initListData()
    }
    const handleChangeFilter = (name?: string, value?: number) => {
      pageData.value = initPageData()
      if(name) {
        formData.value = {
          ...initFormData(),
          [name]: value
        }
      }else {
        formData.value = {
          ...initFormData()
        }
      }
      initListData()
    }
    const initListData = async() => {
      let datas = await queryVoteList({
        ...formData.value,
        ...pageData.value
      })
      let { data,...other } = datas.data.body
      listData.value = data.map((item) => {
        return {
          ...item,
          addInitialNum: ''
        }
      })
      pageData.value = { ...other }
    }
    const pCurrentChange = (current: number) => {
      pageData.value = {
        ...pageData.value,
        current
      }
      initListData()
    }
    const handleGoPlayer = (id:number, name: string) => {
      router.push({
        name,
        params: {
          voteId: id
        }
      })
    }
    const handleCopyVote = async(id:number) => {
      await copyVote({ id })
      ElMessage.success('复制成功')
      initListData()
    }

    const handleCreateClick = () => {
      router.push({
        name: 'voteListCreate'
      })
    }
    const handleChangeStatus = async(id: number,status : number) => {
      await editStatus({
        id,
        status
      })
      ElMessage.success('操作成功')
      initListData()
    }
    const handleDelete = async(id: number | string) => {
      ElMessageBox.confirm('确认删除该活动?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await editStatus({
          id,
          status: 2
        })
        ElMessage.success('删除成功')
        initListData()
      })
    }
    const handleAddVisitNum = async(row: any) => {
      if(!row.addInitialNum) {
        ElMessage.success('请输入需要增加的浏览量')
        return
      }
      await voteUpdateView({
        type: 'info' ,
        infoId: row.id,
        viemNum: row.addInitialNum
      }) 
      ElMessage.success('操作成功')
      initListData()
    }
    const selectable = (row: any) => {
      return row.infoStatus !== 2 
    }
    const handleBetchDelete = () => {
      if(!multipleSelection.value.length) {
        ElMessage.warning('请选择需要操作的数据')
        return 
      }
      handleDelete(multipleSelection.value.map((item) => {
        return item.id
      }).join(','))
    }
    const getUrl = (row) => {
      let apiDomain = getUserInfo.sysSetting && getUserInfo.sysSetting.apiDomain
      return `${apiDomain || window.location.origin}/wx/#/pages/index/index?voteId=${row.id}&playerId=${row.id}`
    }
    onMounted(() => {
      initListData()
    })

    return {
      listData,
      formData,
      pageData,
      handleChangeFilter,
      handleCopyVote,
      handleDelete,
      handleSearch,
      handleGoPlayer,
      handleCreateClick,
      handleChangeStatus,
      DateStringConvert,
      statusStr, 
      infoStatusStr,
      pCurrentChange,
      handleBetchDelete,
      handleSelectionChange,
      selectable,
      handleAddVisitNum,
      getUrl,
      isAdmin
    }
  }
})
</script>