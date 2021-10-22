<template>
  <el-card>
    <template #header>	
      <div class='justify-between'>
        <span>
          <span v-if='voteData.status == 1'>
            <el-button v-if='voteData.infoStatus == 2' size='mini' type='success'>{{ infoStatusStr(voteData.infoStatus) }}</el-button>
            <el-button v-else size='mini' type='warning'>{{ infoStatusStr(voteData.infoStatus) }}</el-button>
          </span>
          <el-button v-if='voteData.status == 3' size='mini' type='warning'>已关闭</el-button>
          <el-button v-if='voteData.status == 0' size='mini' type='warning'>未开启</el-button>
          活动：{{ voteData.title }}
        </span>
        <span>
          <el-button type='success' size='mini' @click=''>返回</el-button>
        </span>
      </div>
    </template>
    <el-form :inline='true' :model='formData' class='demo-form-inline'>
      <el-form-item>
        <el-input v-model='formData.name' size='mini' placeholder='输入主题名关键字' style='width: 146px' class='mr-2' />
        <el-button type='primary' size='mini' @click='handleSearch'>搜索</el-button>
        <!-- <el-button type='success' size='mini' @click='handleGoPage("voteListRandAuto")'>自动任务</el-button> -->
        <el-button type='success' size='mini' @click='handleGoPage("voteListRandCreate")'>添加定时投票</el-button>
      </el-form-item>
    </el-form>
    <el-table :data='listData' border>
      <el-table-column
        prop='name'
        label='任务名称'
      />
      <el-table-column label='开始时间'>
        <template #default='scope'>
          {{ DateStringConvert(scope.row.startTime) }}
        </template>
      </el-table-column>
      <el-table-column label='结束时间'>
        <template #default='scope'>
          {{ DateStringConvert(scope.row.endTime) }}
        </template>
      </el-table-column>
      <el-table-column
        prop='intervalMinute'
        label='时间间隔(分钟)'
      />
      <el-table-column label='排名范围'>
        <template #default='scope'>
          {{ scope.row.minRanking }} - {{ scope.row.maxRanking }} 
        </template>
      </el-table-column>
      <el-table-column label='票数范围'>
        <template #default='scope'>
          {{ scope.row.minTicketNum }} - {{ scope.row.maxTicketNum }} 
        </template>
      </el-table-column>
      <el-table-column label='操作' width='180px'>
        <template #default='scope'>
          <el-button
            size='mini'
            type='info'
            class='mb-2'
            @click='()=> handleEdit(scope.row.id)'
          >编辑</el-button>
          <el-button
            size='mini'
            type='info'
            class='mb-2'
            @click='()=>handleDelete(scope.row.id)'
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination layout='prev, pager, next' :total='pageData.recordCount' @current-change='pCurrentChange' />
  </el-card>
</template>
  
<script lang="ts">
import { ref,defineComponent, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { queryVote } from '/@/api/vote/index'
import { infoStatusStr ,DateStringConvert } from '/@/utils/tools'
import { voteQueryTaskList, voteEditTaskStatus } from '/@/api/vote/index'
import { ElMessageBox ,ElMessage } from 'element-plus'
export default defineComponent({
  emits:['on-search'],
  setup(props:any, context: any) {
    const router = useRouter()
    const route = useRoute()
    const formData = ref({ userName:'',invitationName: '',mobile: '' })
    const listData = ref([])
    let voteData = ref({})
    let pageData = ref({
      current: 1,
      size: 10,
      recordCount: 0,
      count: 1
    })
    const handleDelete = async(id: number | string) => {
      ElMessageBox.confirm('确认删除该活动?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await voteEditTaskStatus({
          id,
          status: 2
        })
        ElMessage.success('删除成功')
        initListData()
      })
    }
    const handleSearch = () => {
      pageData.value = {
        current: 1,
        size: 10,
        recordCount: 0,
        count: 1
      }
      initListData()
    }
    const handleGoPage = (name:string) => {
      router.push({
        name,
        params: {
          voteId: route.params.voteId
        }
      })
    }
    const handleEdit = (id: number) => {
      router.push({
        name: 'voteListRandListEdit',
        params: {
          voteId: route.params.voteId,
          randId: id
        }
      })
    }
    const initListData = async() => {
      let datas = await voteQueryTaskList({
        ...formData.value,
        ...pageData.value
      })
      let { data,...other } = datas.data.body
      listData.value = data
      pageData.value = { ...other }
    }
    const pCurrentChange = (current: number) => {
      pageData.value = {
        ...pageData.value,
        current
      }
      initListData()
    }
    onMounted(async() => {
      initListData()
      let datas = await queryVote({
        id: route.params.voteId
      })
      voteData.value = datas.data.body
    })

    return {
      listData,
      formData,
      voteData,
      pageData,
      handleEdit,
      handleSearch,
      handleGoPage,
      infoStatusStr,
      pCurrentChange,
      DateStringConvert,
      handleDelete
    }
  }
})
</script>