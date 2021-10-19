<template>
  <div>
    <el-card>
      <template #header>	
        <div class='justify-between'>
          <span>创建选手</span>
          <span>
            <el-button type='success' size='mini'>返回</el-button>
          </span>
        </div>
      </template>
      <el-form ref='ruleForm' :model='formData' label-width='160px' :rules='formRules'>
        <el-form-item label='店铺名称' prop='name'>
          <el-input v-model='formData.name' size='small' placeholder='店铺名称' style='width: 50%;' />
        </el-form-item>
        <el-form-item label='手机号码'>
          <el-input v-model='formData.phone' type='number' size='small' placeholder='电话' style='width: 50%;' />
        </el-form-item>
        <el-form-item label='店铺介绍' prop='introduce'>
          <el-input v-model='formData.introduce' type='textarea' :row='4' placeholder='备注' style='width: 50%;' />
        </el-form-item>
        <el-form-item label='备注' prop='remark'>
          <el-input v-model='formData.remark' type='textarea' :row='4' placeholder='备注' style='width: 50%;' />
        </el-form-item>
        <el-form-item label='店铺图片:'>
          <el-upload
            :limit='1'
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
            <el-button v-if='!imageUrls.length ' type=''>
              上传图片<i class='el-icon-plus avatar-uploader-icon' />
            </el-button> 
          </el-upload>
        </el-form-item>
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
import CkEditor from '/@/components/CkEditor/index.vue'
import { useLayoutStore } from '/@/store/modules/layout'
import { imageDelete } from '/@/api/util'
import { ElMessage } from 'element-plus'
import { validate } from '/@/utils/formExtend'
import { createPlayer, editPlayer,queryPlayer } from '/@/api/vote/player'

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
      name: [
        { required: true, message: '请输入活动名称', trigger: 'blur' },
        {
          max: 40,
          message: '长度不超过40',
          trigger: 'blur'
        }
      ]
    }
    const beforeAvatarUpload = (file) => {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        ElMessage.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        ElMessage.error('上传头像图片大小不能超过 2MB!')
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
    const onRemove = (file) => {
      imageUrls.value = imageUrls.value.filter((item) => {
        return item.id != file.id
      })
    }

    const beforeRemove = (file, fileList) => {
      if(file.isHandle) {
        return true
      }
      return imageDelete({
        id:file.id,
        actId: route.params.voteId,
        type:'voteInfo'
      })
    }

    const handleSave = async() => {
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
        imgId:imageUrls.value.map((item) => {return item.id}).join(','),// 图片ID数组
        infoId: route.params.voteId
      }
      console.log('',data)
      if(route.params.playerId) {
        await editPlayer(data)
      }else {
        await createPlayer(data)
      }
      ElMessage.success('操作成功')
      router.push({
        name: 'voteListPlayerListIndex',
        params: {
          voteId: route.params.voteId
        }
      })
    }

    const viewPlayerInfo = async() => {
      let data = await queryPlayer({ id: route.params.playerId })
      let { ...other } = data.data.body
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
      if(route.params.playerId) {
        viewPlayerInfo()
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