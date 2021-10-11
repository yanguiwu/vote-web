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
      <el-form :model='formData' label-width='150px'>
        <el-form-item label='评选主题'>
          <el-input v-model='formData.userName' size='small' placeholder='输入主题名关键字' style='width: 50%;' />
        </el-form-item>
        <el-form-item label='滚动文字'>
          <el-input v-model='formData.userName' size='small' placeholder='输入主题名关键字' style='width: 50%;' />
        </el-form-item>
        <el-form-item label='每人可投票总数:'>
          <el-input v-model='formData.userName' size='small' placeholder='输入主题名关键字' style='width: 50%;' />
        </el-form-item>
        <el-form-item label='每天每人可投票次数:'>
          <el-input v-model='formData.userName' size='small' placeholder='输入主题名关键字' style='width: 50%;' />
        </el-form-item>
        <el-form-item label='每天可投票总数:'>
          <el-input v-model='formData.userName' size='small' placeholder='输入主题名关键字' style='width: 50%;' />
        </el-form-item>
        <el-form-item label='访问量::'>
          <el-input v-model='formData.userName' size='small' placeholder='输入主题名关键字' style='width: 50%;' />
        </el-form-item>
        <el-form-item label='上传banner图:'>
          <el-upload
            class='avatar-uploader'
            action='https://jsonplaceholder.typicode.com/posts/'
            :show-file-list='false'
            :on-success='handleAvatarSuccess'
            :before-upload='beforeAvatarUpload'
          >
            <el-button type='primary'>
              上传图片<i class='el-icon-plus avatar-uploader-icon' />
            </el-button> 
          </el-upload>
        </el-form-item>
        <el-form-item label='活动规则:'>
          <CkEditor v-model='formData.introduction' type='Full' />
        </el-form-item>
        <el-form-item label='活动奖品:'>
          <CkEditor v-model='formData.introduction' type='Full' />
        </el-form-item>
        <el-form-item label='奖品图片:'>
          <CkEditor v-model='formData.introduction' type='Full' />
        </el-form-item>
        <el-form-item label='开始时间:'>
          <el-input v-model='formData.userName' size='small' placeholder='输入主题名关键字' />
        </el-form-item>
        <el-form-item label='结束时间:'>
          <el-input v-model='formData.userName' size='small' placeholder='输入主题名关键字' />
        </el-form-item>
        <el-form-item label='投票开始时间:'>
          <el-input v-model='formData.userName' size='small' placeholder='输入主题名关键字' />
        </el-form-item>
        <el-form-item label='投票结束时间:'>
          <el-input v-model='formData.userName' size='small' placeholder='输入主题名关键字' />
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script lang="ts">
import { ref,defineComponent } from 'vue'
import { useRouter } from 'vue-router'
import CkEditor from '/@/components/CkEditor/index.vue'
export default defineComponent({
  components: { CkEditor },
  props: {
    listData: {
      type: Array,
      default: () => []
    }
  },
  setup() {
    const router = useRouter()
    const formData = ref({ userName:'',invitationName: '',mobile: '', introduction: '' })
    const handleCreateClick = () => {
      router.push({
        name: 'voteListCreate'
      })
    }
    const beforeAvatarUpload = (file) => {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        // this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        // this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    }
    const handleAvatarSuccess = (res, file) => {
      // this.imageUrl = URL.createObjectURL(file.raw)
    }

    return {
      formData,
      handleCreateClick,
      beforeAvatarUpload,
      handleAvatarSuccess
    }
  }
})
</script>