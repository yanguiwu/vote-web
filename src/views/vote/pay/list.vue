<template>
  <el-card>
    <template #header>	
      <div class='justify-between'>
        <span>
          <span v-if='voteData.status == 1 '>
            <el-button v-if='voteData.infoStatus == 2' size='mini' type='success'>{{ infoStatusStr(voteData.infoStatus) }}</el-button>
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
        <el-select v-model='formData.payStatus' size='mini' placeholder='支付状态' clearable class='mr-5'>
          <el-option
            label='已支付'
            value='2'
          />
          <el-option
            label='未支付'
            value='1'
          />
        </el-select>
        <el-button type='primary' size='mini' class='mr-5' @click='handleSearch'>搜索</el-button>
      </el-form-item>
    </el-form>
    <el-table :data='listData' border>
      <el-table-column
        prop='subName'
        label='选手名称'
      />
      <el-table-column label='开始日期' width='160px'>
        <template #default='scope'>
          {{ DateStringConvert(scope.row.createTime) }}
        </template>
      </el-table-column>
      <el-table-column label='支付日期' width='160px'>
        <template #default='scope'>
          {{ DateStringConvert(scope.row.payTime) }}
        </template>
      </el-table-column>
      <el-table-column
        prop='voteNum'
        label='票数'
      >
        <template #default='scope'>
          {{ scope.row.voteNum }}
        </template>
      </el-table-column>
      <el-table-column
        prop='voteNum'
        label='支付金额'
      >
        <template #default='scope'>
          ￥{{ scope.row.payAmount }}
        </template>
      </el-table-column>
      <el-table-column
        label='支付状态'
      >
        <template #default='scope'>
          <span v-if='scope.row.payStatus ==1' class='color-danger'>未支付</span>
          <span v-if='scope.row.payStatus ==2' class='color-success'>已支付</span>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination layout='prev, pager, next' :total='pageData.recordCount' :page-size='pageData.size' @current-change='pCurrentChange' />
  </el-card>
</template>
  
<script lang="ts">
import { ref,defineComponent, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { voteQueryOrderList, queryVote } from '/@/api/vote/index'
import { DateStringConvert , playerStatusStr,infoStatusStr } from '/@/utils/tools'
import Countdown from 'vue3-countdown'
export default defineComponent({
  components:{ Countdown },
  emits:['on-search'],
  setup() {
    const router = useRouter()
    const route = useRoute()
    let voteData = ref({})
    let formData = ref({ })
    let listData = ref([])
    let pageData = ref({
      current: 1,
      size: 10000,
      recordCount: 0
    })
    const handleAll = () => {
      formData.value = {
        subName: '',
        type: ''
      }
      pageData.value = {
        current: 1,
        size: 10000,
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
      let datas = await voteQueryOrderList({ 
        infoId:route.params.voteId,
        // subId:route.params.playerId,
        ...formData.value
      })
      let { data, ...other } = datas.data.body
      listData.value = data
      pageData.value = {
        ...other ,
        size: 10000
      }
    }
    const handleChangeType = (_type: string) => {
      formData.value = {
        ... formData.value,
        type: _type
      }
      pageData.value = {
        current: 1,
        size: 10000,
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
      handleSearch,
      pCurrentChange,
      infoStatusStr,
      DateStringConvert
    }
  }
})
</script>