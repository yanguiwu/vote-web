<template>
  <el-card>
    <el-tabs v-model='activeName'>
      <el-tab-pane label='基本信息配置' name='first'>
        <el-form ref='ruleForm' :model='formData' label-width='220px' :rules='formRules'>
          <el-form-item label='报名提示' prop='signUpTipsRemark'>
            <el-input v-model='formData.signUpTipsRemark' size='small' placeholder='' style='width: 50%;' />
            <div class='help'>手机端提交报名后，用户所看到的提示语</div>
          </el-form-item>
          <el-form-item label='支付域名' prop='domainName'>
            <el-input v-model='formData.domainName' placeholder='支付域名' style='width: 50%;' />
            <div class='help'>当支付与系统使用同一域名时，无需配置支付域名</div>
          </el-form-item>
         
          <el-divider class='mt-10 mb-5'>微信支付相关配置</el-divider>
          <el-alert
            title='请谨慎操作，仔细核对以下配置，配置错误会导致钻石支付失败！！！'
            type='warning'
            effect='dark'
            :closable='false'
            class='mb-5'
          />
          <el-alert
            title='以下配置均为敏感信息，请勿交于他人，以免造成不必要的损失！！！'
            type='error'
            effect='dark'
            :closable='false'
            class='mb-5'
          />
          <el-form-item label='公众号-开发者ID(AppId)'>
            <el-input v-model='formData.appId' size='small' placeholder='公众号appId' style='width: 50%;' />
            <el-popover placement='right' :width='400' trigger='hover'>
              <template #reference>
                <el-button size='small' class='ml-5'>查看帮助</el-button>
              </template>
              <img src='/@/assets/img/sys-appid.png' style='width: 500px;max-width: 500px;'>
            </el-popover>
          </el-form-item>
          <el-form-item label='公众号-开发者密码(appSecret)'>
            <el-input v-model='formData.appSecret' size='small' placeholder='公众号开发者密码(appSecret)' style='width: 50%;' />
            <el-popover placement='right' :width='400' trigger='hover'>
              <template #reference>
                <el-button size='small' class='ml-5'>查看帮助</el-button>
              </template>
              <img src='/@/assets/img/sys-appid2.png' style='width: 500px;max-width: 500px;'>
            </el-popover>
          </el-form-item>
          <el-form-item label='微信商户平台-微信支付商户号' prop='mchId'>
            <el-input v-model='formData.mchId' type='textarea' placeholder='备注' style='width: 50%;' />
            <el-popover placement='right' :width='400' trigger='hover'>
              <template #reference>
                <el-button size='small' class='ml-5'>查看帮助</el-button>
              </template>
              <img src='/@/assets/img/sys-pay.png' style='width: 500px;max-width: 500px;'>
            </el-popover>
          </el-form-item>
          <el-form-item label='微信商户平台-API密钥' prop='wxApiKey'>
            <el-input v-model='formData.wxApiKey' type='textarea' placeholder='备注' style='width: 50%;' /> 
            <el-popover placement='right' :width='400' trigger='hover'>
              <template #reference>
                <el-button size='small' class='ml-5'>查看帮助</el-button>
              </template>
              <img src='/@/assets/img/sys-pay2.png' style='width: 500px;max-width: 500px;'>
            </el-popover>
          </el-form-item>
          <el-form-item label='微信商户平台-API证书' prop='domainName'>
            <span v-if='formData.wxApiFilePath' class='color-success'>已配置</span>
            <br>
            <el-button class='file-button'> {{ formData.wxApiFilePath ? '修改证书':'添加证书' }}<input type='file' @change='handleFileChange'></el-button>
          </el-form-item>
          <el-divider class='mt-10 mb-5' />
          <el-form-item>
            <el-button type='primary' class='mr-10' @click='handleSysSave'>保存</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label='手机端钻石列表配置' name='second'>
        <el-button type='primary' class='mb-5' @click='handleAdd'>
          添加
        </el-button>
        <el-table :data='formData.payOrderList' border>
          <el-table-column
            prop='payAmount'
            label='钻石数'
          />
          <el-table-column
            prop='voteNum'
            label='投票数'
          />
          <el-table-column label='操作' width='230px'>
            <template #default='scope'>
              <el-button
                size='mini'
                type='info'
                @click='()=>handleDelete(scope.row.id)'
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
    <el-dialog
      v-model='dialogVisible'
      title='添加'
      width='60%'
      :before-close='handleClose'
    >
      <el-form ref='listForm' :model='formListData' label-width='160px' :rules='formListRules'>
        <el-form-item label='砖石数' prop='payAmount'>
          <el-input-number v-model='formListData.payAmount' :precision='0' :min='1' />
        </el-form-item>
        <el-form-item label='对应投票数' prop='voteNum'>
          <el-input-number v-model='formListData.voteNum' :precision='0' :min='1' />
        </el-form-item>
        <el-form-item>
          <el-button type='primary' class='mr-10' @click='handleSave'>保存</el-button>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class='dialog-footer'>
          <el-button @click='dialogVisible = false'>取消</el-button>
        </span>
      </template>
    </el-dialog>
  </el-card>
</template>
<script lang="ts">
import { ref,defineComponent, onMounted } from 'vue'
import { querySysInfo, editSysInfo, addPayOrderList, deletePayOrderList } from '/@/api/shop'
import { validate } from '/@/utils/formExtend'
import { ElMessage, ElMessageBox } from 'element-plus'

export default defineComponent({
  emits:['on-search'],
  setup() {
    const dialogVisible = ref(false)
    const ruleForm = ref(null)
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
    const listForm = ref(null)
    const formListData = ref({ })
    const formListRules = {
      name: [
        { required: true, message: '请输入活动名称', trigger: 'blur' },
        {
          max: 40,
          message: '长度不超过40',
          trigger: 'blur'
        }
      ]
    }
    let activeName = ref('first')
    
    const initSysInfo = async() => {
      let data = await querySysInfo({})
      formData.value = data.data.body
    }
    const handleSysSave = async() => {
      if(!await validate(ruleForm)) {
        return
      }
      let { payOrderList ,...other } = formData.value
      let newFormData = new FormData()
      Object.keys({ ...other }).map((item) => {
        console.log(item)
        newFormData.append(item,formData.value[item])
      })

      await editSysInfo(newFormData)
      ElMessage.success('操作成功')
      dialogVisible.value = false
      initSysInfo()
    }
    const handleSave = async() => {
      if(!await validate(listForm.value)) {
        return
      }
      let data = {
        ...formListData.value
      }
      await addPayOrderList(data)
      ElMessage.success('操作成功')
      dialogVisible.value = false
      initSysInfo()
    }
    const handleClose = () => {
      dialogVisible.value = false
    }
    const handleAdd = () => {
      dialogVisible.value = true
    }
    const handleFileChange = (e:any) => {
      const { files } = e.target
      if(files && files[0]) {
        const _file = files[0]
        formData.value = {
          ...formData.value,
          uploadFile: _file
        }
      }
    }
    const handleDelete = async(id: number | string) => {
      ElMessageBox.confirm('确认删除该?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await deletePayOrderList({
          id
        })
        ElMessage.success('删除成功')
        initSysInfo()
      })
    }

    onMounted(() => {
      initSysInfo()
    })
    return {
      activeName,
      dialogVisible,
      formData,
      formRules,
      ruleForm,
      listForm,
      formListData,
      formListRules,
      handleSave,
      handleClose,
      handleAdd,
      handleSysSave,
      handleFileChange,
      handleDelete
    }
  }
})
</script>

<style lang="postcss">
.file-button {
  padding: 0;
  min-width: 100px;
  input {
    min-height: 40px;
    opacity: 0;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    min-width: 100px;
  }
}
</style>