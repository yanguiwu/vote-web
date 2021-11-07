<template>
  <el-card>
    <template #header>	
      <div class='justify-between'>
        <span>
          <span v-if='voteData.status == 1 '>
            <el-button v-if='voteData.infoStatus == 2' size='mini' type='success'>
              {{ infoStatusStr(voteData.infoStatus) }}
            </el-button>
            <el-button v-else size='mini' type='warning'>{{ infoStatusStr(voteData.infoStatus) }}</el-button>
            <el-button v-if='voteData.countDown && voteData.countDown > 0 && voteData.infoStatus == 2' size='mini' type='success'> 
              <Countdown :time='voteData.countDown * 1000' format='DD天HH小时mm分ss秒' />
            </el-button>
          </span>
          <el-button v-if='voteData.status == 3' size='mini' type='warning'>已关闭</el-button>
          <el-button v-if='voteData.status == 0' size='mini' type='warning'>未开启</el-button>
          活动：{{ voteData.title }}
        </span>
        <span>
          <el-button type='success' size='mini' @click='goBack'>返回</el-button>
        </span>
      </div>
    </template>
    <el-form :inline='true' :model='formData' class='demo-form-inline'>
      <el-form-item>
        <el-input v-model='formData.subName' size='mini' placeholder='输入选手名字' style='width: 146px' class='mr-2' />
        <el-button type='primary' size='mini' class='mr-5' @click='handleSearch'>搜索</el-button>
        <el-button type='danger' size='mini' @click='handleAll'>所有投票</el-button>
        <el-button type='primary' size='mini' @click='()=>handleChangeType("1")'>普通投票</el-button>
        <el-button type='primary' size='mini' @click='()=>handleChangeType("2")'>砖石投票</el-button>
        <el-button type='primary' size='mini' @click='()=>handleChangeType("0")'>虚拟投票</el-button>
      </el-form-item>
    </el-form>
    <el-table :data='listData' border>
      <el-table-column
        prop='infoSeq'
        label='选手编号'
      />
      <el-table-column
        prop='subName'
        label='选手名称'
      />
      <el-table-column
        prop='infoTitle'
        label='活动名称'
      />
      <el-table-column
        prop='phone'
        label='选手电话号码'
      />
      <el-table-column
        prop='voteNum'
        label='票数'
      />
      <el-table-column
        label='类型'
      >
        <template #default='scope'>
          <span v-if='scope.row.type ==0'>虚拟投票</span>
          <span v-if='scope.row.type ==1'>普通投票</span>
          <span v-if='scope.row.type ==2'>钻石投票</span>
        </template>
      </el-table-column>
      <el-table-column
        prop='ipAddr'
        label='IP'
      />
      <el-table-column
        prop='cityName'
        label='城市'
      />
      <el-table-column
        prop='amount'
        label='钻石'
      />
    </el-table>
    <el-pagination layout='prev, pager, next' :total='pageData.recordCount' :page-size='pageData.size' @current-change='pCurrentChange' />
  </el-card>
</template>
  
<script lang="ts">
import { ref,defineComponent, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { voteLogQueryList, queryVote } from '/@/api/vote/index'
import { DateStringConvert , playerStatusStr,infoStatusStr } from '/@/utils/tools'
import Countdown from 'vue3-countdown'
export default defineComponent({
  components: { Countdown },
  emits:['on-search'],
  setup(props:any, context: any) {
    const router = useRouter()
    const route = useRoute()
    let formData = ref({ type: '', subName: '' })
    let listData = ref([])
    let voteData = ref({})
    let pageData = ref({
      current: 1,
      size: 20,
      recordCount: 0
    })
    const handleAll = () => {
      formData.value = {
        subName: '',
        type: ''
      }
      pageData.value = {
        current: 1,
        size: 20,
        recordCount: 0
      }
      initListDatas()
    }
    const goBack = () => {
      router.push({
        name: 'voteListIndex',
        params: {
          voteId: route.params.voteId
        }
      })
    }
    const handleSearch = () => {
      initListDatas()
    }
    const pCurrentChange = (current: number) => {
      pageData.value = {
        ...pageData.value,
        current
      }
      initListDatas()
    }
    const initListDatas = async() => {
      let datas = await voteLogQueryList({ 
        infoId:route.params.voteId,
        // subId:route.params.playerId,
        ...formData.value
      })
      let { data, ...other } = datas.data.body
      listData.value = data
      pageData.value = {
        ...other 
      }
    }
    const handleChangeType = (_type: string) => {
      formData.value = {
        ... formData.value,
        type: _type
      }
      pageData.value = {
        current: 1,
        size: 20,
        recordCount: 0
      }
      initListDatas()
    }

    onMounted(async() => {
      initListDatas()
      let datas = await queryVote({
        id: route.params.voteId
      })
      voteData.value = datas.data.body
    })

    return {
      listData,
      formData,
      pageData,
      voteData,
      goBack,
      handleAll,
      handleSearch,
      pCurrentChange,
      handleChangeType,
      infoStatusStr
    }
  }
})
</script>