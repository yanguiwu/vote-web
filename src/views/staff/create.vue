<template>
  <div>
    <el-card>
      <template #header>	
        <div class='justify-between'>
          <span>创建账号</span>
          <span>
            <el-button type='success' size='mini' @click='handleBack'>返回</el-button>
          </span>
        </div>
      </template>
      <el-form ref='ruleForm' :model='formData' label-width='160px' :rules='formRules'>
        <el-form-item label='账号名称' prop='usesrName'>
          <el-input v-model='formData.userName' size='small' placeholder='店铺名称' style='width: 50%;' />
        </el-form-item>
        <el-form-item label='账号密码' prop='userPassword'>
          <el-input v-model='formData.userPassword' size='small' placeholder='店铺名称' style='width: 50%;' />
        </el-form-item>
        <el-form-item>
          <el-button type='primary' @click='handleSave'>
            保存
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script lang="ts">
import { ref,defineComponent } from 'vue'
import { useRouter ,useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { validate } from '/@/utils/formExtend'
import { createUser } from '/@/api/staff'

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
    const formData = ref({ 
    })
    const formRules = {
      userName: [
        { required: true, message: '请输入账号名称', trigger: 'blur' },
        {
          max: 40,
          message: '长度不超过40',
          trigger: 'blur'
        }
      ],
      userPassword: [
        { required: true, message: '请输入账号密码', trigger: 'blur' },
        {
          max: 40,
          message: '长度不超过40',
          trigger: 'blur'
        }
      ]
    }
   
    const handleSave = async() => {
      if(!await validate(ruleForm)) {
        return
      }
      let data = {
        ...formData.value
      }
      await createUser(data)
      ElMessage.success('操作成功')
      handleBack()
    }
    
    const handleBack = () => {
      router.push({
        name: 'staffList'
      })
    }

    return {
      formData,
      formRules,
      ruleForm,
      handleSave,
      handleBack
    }
  }
})
</script>