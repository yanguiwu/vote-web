<template>
  <div>
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
            <el-button type='success' size='mini' @click='handleBack'>返回</el-button>
          </span>
        </div>
      </template>
      <el-form ref='ruleForm' :model='formData' label-width='230px' :rules='formRules'>
        <el-form-item label='活动时间'>
          {{ DateStringConvert(voteData.startTime) }} ~ {{ DateStringConvert(voteData.endTime) }}
        </el-form-item>
        <el-form-item label='定时任务名称'>
          <el-input v-model='formData.name' :maxLength='20' size='small' />
        </el-form-item>
        <el-form-item label='定时开始时间' prop='startTime'>
          <el-date-picker v-model='formData.startTime' type='datetime' size='small' placeholder='定时开始时间' format='YYYY-MM-DD HH:mm:ss' value-format='YYYYMMDDHHmmss' />
        </el-form-item>
        <el-form-item label='定时结束时间' prop='endTime'>
          <el-date-picker v-model='formData.endTime' type='datetime' size='small' placeholder='定时结束时间' format='YYYY-MM-DD HH:mm:ss' value-format='YYYYMMDDHHmmss' />
        </el-form-item>
        <el-form-item label='时间间隔（单位:分钟）' prop='intervalMinute'>
          <el-input-number v-model='formData.intervalMinute' :min='1' size='small' />
        </el-form-item>
          <div v-if="$route.params.randId">
            <el-form-item label='排名范围（从小到大）' prop='introduce'>
              <el-input-number v-model='formData.minRanking' :min='1' size='small' />
              到
              <el-input-number v-model='formData.maxRanking' :min='1' size='small' />
            </el-form-item>
            <el-form-item label='票数范围（从小到大）' prop='remark'>
              <el-input-number v-model='formData.minTicketNum' :min='1' size='small' />
              到
              <el-input-number v-model='formData.maxTicketNum' :min='1' size='small' />
            </el-form-item>
          </div>
          <div v-else >
            <div v-if="formData.minRankingArr && formData.minRankingArr.length==5">
              <el-form-item label='排名范围1（从小到大）' prop='introduce'>
                <el-input-number v-model='formData.minRankingArr[0]' :min='1' size='small' />
                到
                <el-input-number v-model='formData.maxRankingArr[0]' :min='1' size='small' />
              </el-form-item>
              <el-form-item label='票数范围1（从小到大）' prop='remark'>
                <el-input-number v-model='formData.minTicketNumArr[0]' :min='1' size='small' />
                到
                <el-input-number v-model='formData.maxTicketNumArr[0]' :min='1' size='small' />
              </el-form-item>
              <div class='mb-5' />
              <el-form-item label='排名范围2（从小到大）' prop='introduce'>
                <el-input-number v-model='formData.minRankingArr[1]' :min='1' size='small' />
                到
                <el-input-number v-model='formData.maxRankingArr[1]' :min='1' size='small' />
              </el-form-item>
              <el-form-item label='票数范围2（从小到大）' prop='remark'>
                <el-input-number v-model='formData.minTicketNumArr[1]' :min='1' size='small' />
                到
                <el-input-number v-model='formData.maxTicketNumArr[1]' :min='1' size='small' />
              </el-form-item>
              <div class='mb-5' />
              <el-form-item label='排名范围3（从小到大）' prop='introduce'>
                <el-input-number v-model='formData.minRankingArr[2]' :min='1' size='small' />
                到
                <el-input-number v-model='formData.maxRankingArr[2]' :min='1' size='small' />
              </el-form-item>
              <el-form-item label='票数范围3（从小到大）' prop='remark'>
                <el-input-number v-model='formData.minTicketNumArr[2]' :min='1' size='small' />
                到
                <el-input-number v-model='formData.maxTicketNumArr[2]' :min='1' size='small' />
              </el-form-item>
            </div>
          </div>
       
        <el-form-item>
          <el-button type='primary' class='mr-10' @click='handleSave'>保存</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script lang="ts">
import { ref,defineComponent, onMounted } from 'vue'
import { useRouter ,useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { validate } from '/@/utils/formExtend'
import { queryVote , voteAddTask, voteEditTask, voteQueryTask} from '/@/api/vote/index'
import { infoStatusStr,DateStringConvert } from '/@/utils/tools'

export default defineComponent({
  props: {
    listData: {
      type: Array,
      default: () => []
    }
  },
  setup() {
    const ruleForm = ref(null)
    const router = useRouter()
    const route = useRoute()
    const formData:any = ref({ 
      minRankingArr: route.params.randId && new Array(5),
      maxRankingArr: route.params.randId && new Array(5),
      minTicketNumArr: route.params.randId && new Array(5),
      maxTicketNumArr: route.params.randId && new Array(5)
    })
    let voteData = ref({})
    const formRules = {
      startTime: [
        { required: true, message: '请输入开始时间', trigger: 'blur' }
      ],
      endTime: [
        { required: true, message: '请输入结束时间', trigger: 'blur' }
      ],
      intervalMinute: [
        { required: true, message: '请输入时间间隔', trigger: 'blur' }
      ]
    }

    const validateArry = () => {
      let { minRankingArr,maxRankingArr,minTicketNumArr,maxTicketNumArr } = formData.value
      let message = ''
      let arryObj = {
        minRankingArr:<any>[],
        maxRankingArr: <any>[],
        minTicketNumArr: <any>[],
        maxTicketNumArr: <any>[]
      }
      let array = minRankingArr.filter((item:any,index:number) => {
        if(((item && !maxRankingArr[index]) || (!item && maxRankingArr[index])) && !message) {
          message = `排名范围${index+1}缺少最大值/最小值`
        }
        if(((minTicketNumArr[index] && !maxTicketNumArr[index]) || (!minTicketNumArr[index] && maxTicketNumArr[index])) && !message) {
          message = `票数范围${index+1}缺少最大值/最小值`
        }
        let bool = item && maxRankingArr[index] && minTicketNumArr[index] && maxTicketNumArr[index]
        if(bool) {
          arryObj.minRankingArr.push(item)
          arryObj.maxRankingArr.push(maxRankingArr[index])
          arryObj.minTicketNumArr.push(minTicketNumArr[index])
          arryObj.maxTicketNumArr.push(maxTicketNumArr[index])
        }
        return bool
      })
      if(message) {
        ElMessage.error(message)
        return
      }
      if(!message && !array.length) {
        ElMessage.error('排名范围/票数范围，至少完整填一组')
        return
      }
      return arryObj
    }
    
    const handleSave = async() => {
      let obj:any = {}
      if(!route.params.randId) {
        obj = validateArry()
        if(!obj) {
          return
        }
      }
      if(route.params.randId) {
        let { minRanking, maxRanking, minTicketNum, maxTicketNum } = formData.value
        if (!minRanking || !maxRanking || !minTicketNum || !maxTicketNum) {
          ElMessage.error('排名范围/票数范围 缺少 最大值/最小值')
          return
        }
      }
      if(!await validate(ruleForm)) {
        return
      }
      let data = {
        ...formData.value,
        ...obj,
        infoId: route.params.voteId
      }
      if(route.params.randId) {
        await voteEditTask(data)
      }else {
        await voteAddTask(data)
      }
      ElMessage.success('操作成功')
      router.push({
        name: 'voteListRandListIndex',
        params: {
          voteId: route.params.voteId
        }
      })
    }

    const handleBack = () => {
      router.push({
        name: 'voteListRandListIndex',
        params: {
          voteId: route.params.voteId
        }
      })
    }

    const viewTaskInfo = async() => {
      let { randId,voteId } = route.params
      let data = await voteQueryTask({ id:randId, infoId: voteId })
      let { createUser, createTime, maxRankingArr,maxTicketNumArr,minRankingArr,minTicketNumArr,...other } = data.data.body
      formData.value = { 
        ...other
      }
    }

    onMounted(async() => {
      if(route.params.randId) {
        viewTaskInfo()
      }
      let datas = await queryVote({
        id: route.params.voteId
      })
      voteData.value = datas.data.body
    })

    return {
      voteData,
      formData,
      formRules,
      ruleForm,
      handleSave,
      handleBack,
      DateStringConvert,
      infoStatusStr
    }
  }
})
</script>