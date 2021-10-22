<template>
  <div>
    <el-card>
      <template #header>	
        <div class='justify-between'>
          <span>创建选手</span>
          <span>
            <el-button type='success' size='mini' @click='handleBack'>返回</el-button>
          </span>
        </div>
      </template>
      <el-form v-if='isBetch' ref='ruleForm' :model='formData' label-width='160px' :rules='formRules'>
        <el-form-item label='图片:'>
          <el-upload
            ref='betchUploader'
            :multiple='true'
            class='avatar-uploader'
            :action='actionUrl'
            :on-success='handleAvatarSuccess'
            :before-remove='beforeRemove'
            :on-remove='onRemove'
            :before-upload='beforeAvatarUpload'
            :headers='header'
            name='uploadFile'
            list-type='picture'
          >
            <el-button>
              上传图片<i class='el-icon-plus avatar-uploader-icon' />
            </el-button> 
          </el-upload>
        </el-form-item>
        <el-form-item>
          <el-button type='primary' class='mr-10' @click='handleBetchSave'>保存</el-button>
        </el-form-item>
      </el-form>
      <el-form v-if='!isBetch' ref='ruleForm' :model='formData' label-width='160px' :rules='formRules'>
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
          <div>
            图片格式尺寸：380*300，格式jpg,png
          </div>
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
import { useLayoutStore } from '/@/store/modules/layout'
import { imageDelete } from '/@/api/util'
import { ElMessage } from 'element-plus'
import { validate } from '/@/utils/formExtend'
import { createPlayer, editPlayer,queryPlayer } from '/@/api/vote/player'

export default defineComponent({
  props: {
    listData: {
      type: Array,
      default: () => []
    }
  },
  setup() {
    const betchUploader = ref(null)
    const ruleForm = ref(null)
    const { getStatus } = useLayoutStore()
    const router = useRouter()
    const route = useRoute()
    const header = {
      'x-auth-token': getStatus.ACCESS_TOKEN
    }
    const imageUrls = ref([])
    const isBetch = ref(route.name === 'voteListPlayerBetchCreate')
    const actionUrl = `${import.meta.env.VITE_BASE_URL}/sys-file/img-upload `
    const formData = ref({ })
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
    const handleAvatarSuccess = (res: any, file: any, fileList) => {
      if(res.code === 0) {
        imageUrls.value.push({
          ...res.body,
          isHandle: true,
          name: file.name
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
        actId: route.params.playerId,
        type:'voteSub'
      })
    }

    const handleSave = async() => {
      if(!await validate(ruleForm)) {
        ElMessage.error('请检查必填项，带红星为必填')
        return
      }
      if(!imageUrls.value.length) {
        ElMessage.error('请上传图片:')
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

    const handleBetchSave = () => {
      if(!imageUrls.value.length) {
        ElMessage.error('请上传图片:')
        return
      }
      imageUrls.value.forEach(async(item) => {
        let _name = item.name.split('.')
        let data = {
          name: _name.length ? _name[0] : item.id,
          imgId:item.id,
          infoId: route.params.voteId
        }
        await createPlayer(data)
      })
      ElMessage.success('创建成功')
      handleBack()
    }

    const handleBack = () => {
      router.push({
        name: 'voteListPlayerListIndex',
        params: {
          voteId: route.params.voteId
        }
      })
    }

    const viewPlayerInfo = async() => {
      let { playerId,voteId } = route.params
      let data = await queryPlayer({ id:playerId, infoId: voteId })
      let { fileWebPath, imgId,status,createUser,createTime,ticketNum,todayStar,viewNum,initialTicketNum,initialNum,infoSeq,orderTicketNum,...other } = data.data.body
      formData.value = { 
        ...other
      }
      imageUrls.value = fileWebPath && imgId ? [{
        id: imgId,
        url: fileWebPath
      }] : []
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
      betchUploader,
      handleSave,
      beforeAvatarUpload,
      handleAvatarSuccess,
      beforeRemove,
      onRemove,
      handleBack,
      handleBetchSave,
      isBetch
    }
  }
})
</script>