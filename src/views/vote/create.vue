<template>
  <div>
    <el-card>
      <template #header>	
        <div class='justify-between'>
          <span>发起评选</span>
          <span>
            <el-button type='success' size='mini'>返回</el-button>
          </span>
        </div>
      </template>
      <el-form ref='ruleForm' :model='formData' label-width='160px' :rules='formRules'>
        <el-form-item label='评选主题' prop='title'>
          <el-input v-model='formData.title' size='small' placeholder='评选主题' style='width: 50%;' />
        </el-form-item>
        <el-form-item label='滚动文字'>
          <el-input v-model='formData.rollTitle' size='small' placeholder='滚动文字' style='width: 50%;' />
        </el-form-item>
        <el-form-item label='每人可投票总数:'>
          <el-input v-model='formData.userVoteDayNum' type='number' size='small' placeholder='每人可投票总数' style='width: 50%;' />
        </el-form-item>
        <el-form-item label='每天每人可投票次数:'>
          <el-input v-model='formData.userVoteSingleNum' type='number' size='small' placeholder='每天每人可投票次数' style='width: 50%;' />
        </el-form-item>
        <el-form-item label='每天可投票总数:'>
          <el-input v-model='formData.maxVoteNum' type='number' size='small' placeholder='每天可投票总数' style='width: 50%;' />
        </el-form-item>
        <el-form-item label='访问量:' type='number'>
          <el-input v-model='formData.initialNum' type='number' size='small' placeholder='访问量' style='width: 50%;' />
        </el-form-item>
        <el-form-item label='上传banner图:'>
          <el-upload
            :multiple='false'
            class='avatar-uploader'
            :action='actionUrl'
            :on-success='handleAvatarSuccess'
            :before-remove='beforeRemove'
            :on-remove='onRemove'
            :before-upload='beforeAvatarUpload'
            :headers='header'
            name='uploadFile'
            :file-list='imageUrls'
            list-type='picture'
          >
            <el-button type='primary'>
              上传图片<i class='el-icon-plus avatar-uploader-icon' />
            </el-button> 
          </el-upload>
        </el-form-item>
        <el-form-item label='活动规则:'>
          <CkEditor v-model='formData.ruleHtml' type='Full' />
        </el-form-item>
        <el-form-item label='活动奖品:'>
          <CkEditor v-model='formData.prizeHtml' type='Full' />
        </el-form-item>
        <el-form-item label='奖品图片:'>
          <CkEditor v-model='formData.prizeImgHtml' type='Full' />
        </el-form-item>
        <el-form-item label='活动开始时间:' prop='startTime'>
          <el-date-picker v-model='formData.startTime' size='small' type='datetime' placeholder='活动开始时间' format='YYYY-MM-DD HH:mm:ss' value-format='YYYYMMDDHHmmss' />
        </el-form-item>
        <el-form-item label='活动结束时间:' prop='endTime'>
          <el-date-picker v-model='formData.endTime' size='small' type='datetime' placeholder='活动结束时间' format='YYYY-MM-DD HH:mm:ss' value-format='YYYYMMDDHHmmss' />
        </el-form-item>
        <el-form-item label='投票开始时间:' prop='startVoteTime'>
          <el-date-picker v-model='formData.startVoteTime' size='small' type='datetime' placeholder='投票开始时间' format='YYYY-MM-DD HH:mm:ss' value-format='YYYYMMDDHHmmss' />
        </el-form-item>
        <el-form-item label='投票结束时间:' prop='endVoteTime'>
          <el-date-picker v-model='formData.endVoteTime' size='small' type='datetime' placeholder='投票结束时间' format='YYYY-MM-DD HH:mm:ss' value-format='YYYYMMDDHHmmss' />
        </el-form-item>
        <el-form-item label='自动锁定:'>
          每
          <el-input v-model='formData.minuteVote' type='number' size='small' style='width: 150px' />分钟超过
          <el-input v-model='formData.maxMinuteVote' type='number' size='small' style='width: 150px' />票，锁定
          <el-input v-model='formData.lockingMinute' type='number' size='small' style='width: 150px' />分钟
        </el-form-item>
        <el-form-item label='是否匿名送票:'>
          <el-radio-group v-model='formData.isAnonymou'>
            <el-radio :label='0'>不需要</el-radio>
            <el-radio :label='1'>需要</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label='添加选手是否需要审核:'>
          <el-radio-group v-model='formData.isExamine'>
            <el-radio :label='0'>不需要</el-radio>
            <el-radio :label='1'>需要</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label='是否开启钻石投票:'>
          <el-radio-group v-model='formData.isPayOrder'>
            <el-radio :label='0'>不需要</el-radio>
            <el-radio :label='1'>需要</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label='是否开启随机投票 :'>
          <el-radio-group v-model='formData.isRandomVote'>
            <el-radio :label='0'>不需要</el-radio>
            <el-radio :label='1'>需要</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label='备注' prop='remark'>
          <el-input v-model='formData.remark' type='textarea' :row='4' placeholder='备注' style='width: 50%;' />
        </el-form-item>
        <el-form-item v-if='$route.name !="voteListShow"'>
          <el-button type='primary' class='mr-10' @click='()=>handleSave()'>保存</el-button>
          <el-button type='primary' @click='() => handleSave(2)'>发起评选</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script lang="ts">
import { ref,defineComponent, onMounted } from 'vue'
import { useRouter ,useRoute } from 'vue-router'
import CkEditor from '/@/components/CkEditor/index.vue'
import { useLayoutStore } from '/@/store/modules/layout'
import { createVote, queryVote , editVote } from '/@/api/vote/index'
import { imageDelete } from '/@/api/util'
import { ElMessage } from 'element-plus'
import { validate } from '/@/utils/formExtend'

export default defineComponent({
  components: { CkEditor },
  props: {
    listData: {
      type: Array,
      default: () => []
    }
  },
  setup() {
    const ruleForm = ref(null)
    const { getStatus } = useLayoutStore()
    const router = useRouter()
    const route = useRoute()
    const header = {
      'x-auth-token': getStatus.ACCESS_TOKEN
    }
    const imageUrls = ref([])
    const actionUrl = `${import.meta.env.VITE_BASE_URL}/sys-file/img-upload `
    const formData = ref({ 
      isAnonymou: 1,
      isExamine: 1,
      isPayOrder: 1,
      isRandomVote: 1
    })
    const formRules = {
      title: [
        { required: true, message: '请输入活动名称', trigger: 'blur' },
        {
          max: 40,
          message: '长度不超过40',
          trigger: 'blur'
        }
      ],
      rollTitle:[{
        max: 120,
        message: '长度不超过120',
        trigger: 'blur'
      }],
      sta: [
        { required: true, message: '请选择时间', trigger: 'blur' }
      ],
      startTime: [
        { required: true, message: '请选择时间', trigger: 'blur' }
      ],
      endTime: [
        { required: true, message: '请选择时间', trigger: 'blur' }
      ],
      startVoteTime: [
        { required: true, message: '请选择时间', trigger: 'blur' }
      ],
      endVoteTime: [
        { required: true, message: '请选择时间', trigger: 'blur' }
      ]
    }
    const beforeAvatarUpload = (file) => {
      if (file.size > 300 * 1024) {
        ElMessage.error('上传头像图片大小不能超过 300kb!')
        return false
      }
      return true
    }
    const handleAvatarSuccess = (res: any, file: any) => {
      if(res.code === 0) {
        imageUrls.value.push({
          ...res.body,
          isHandle: true
        })
      }else if(res.code === 8888) {
        router.push('/login')
      }
    }

    const beforeRemove = (file, fileList) => {
      if(!file.id) {
        return true
      }
      if(file.isHandle) {
        return true
      }
      return imageDelete({
        id:file.id,
        actId: route.params.voteId,
        type:'voteInfo'
      })
    }

    const onRemove = (file) => {
      imageUrls.value = imageUrls.value.filter((item) => {
        return item.id != file.id
      })
    }

    const handleSave = async(status?: number) => {
      if(!await validate(ruleForm)) {
        ElMessage.error('请检查必填项，带红星为必填')
        return
      }
      if(!imageUrls.value.length) {
        ElMessage.error('请至少上传一张banner图:')
        return
      }
      let data = {
        ...formData.value,
        bannerImgArr:imageUrls.value.map((item) => {return item.id}),// 图片ID数组
        status
      }
      console.log('',data)
      if(route.params.voteId) {
        await editVote(data)
      }else {
        await createVote(data)
      }
      ElMessage.success('操作成功')
      router.push({
        name: 'voteList'
      })
    }

    const viewVoteInfo = async() => {
      let data = await queryVote({ id: route.params.voteId })
      let { bannerArr, status, storeId, createTime,createUser,fileWebPath,prizeImgUrl,prizeUrl,ruleUrl,...other } = data.data.body
      formData.value = { 
        ...other
      }
      imageUrls.value = bannerArr && bannerArr.map((item) => {
        return {
          id:item.id,
          url: item.fileWebPath
        }
      }) || []
    }

    onMounted(() => {
      if(route.params.voteId) {
        viewVoteInfo()
      }
    })

    return {
      formData,
      formRules,
      actionUrl,
      header,
      imageUrls,
      ruleForm,
      handleSave,
      beforeAvatarUpload,
      handleAvatarSuccess,
      beforeRemove,
      onRemove
    }
  }
})
</script>