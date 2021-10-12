<template>
  <el-card>
    <template #header>	
      <div class='justify-between'>
        <span>定时投票</span>
      </div>
    </template>
    <el-form :inline='true' :model='formData' class='demo-form-inline'>
      <el-form-item>
        <el-input v-model='formData.userName' size='mini' placeholder='输入主题名关键字' style='width: 146px' class='mr-2' />
        <el-button type='primary' size='mini' @click='handleSearch'>搜索</el-button>
        <el-button type='success' size='mini' @click='handleGoPage("voteListRandAuto")'>自动任务</el-button>
        <el-button type='success' size='mini' @click='handleGoPage("voteListRandCreate")'>添加定时投票</el-button>
      </el-form-item>
    </el-form>
    <el-table :data='listData' border>
      <el-table-column
        prop='userName'
        label='投票项目'
      />
      <el-table-column
        prop='mobile'
        label='每日整点'
      />
      <el-table-column
        prop='departmentName'
        label='手机号'
      />
      <el-table-column label='时间间隔'>
        <template #default='scope'>
          {{ scope.row.gender }}
        </template>
      </el-table-column>
      <el-table-column
        prop='invitationTime'
        label='排名范围'
      />
      <el-table-column
        prop='invitationName'
        label='票数范围'
      />
      <el-table-column
        prop='invitationName'
        label='添加时间'
      />
      <el-table-column label='操作' width='180px'>
        <template #default='scope'>
          <el-button
            size='mini'
            type='info'
            class='mb-2'
          >编辑</el-button>
          <el-button
            size='mini'
            type='info'
            class='mb-2'
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>
  
<script lang="ts">
import { ref,defineComponent, onMounted } from 'vue'
import { useRouter } from 'vue-router'
export default defineComponent({
  emits:['on-search'],
  setup(props:any, context: any) {
    const router = useRouter()
    const formData = ref({ userName:'',invitationName: '',mobile: '' })
    const listData = ref([])
    const handleSearch = () => {
      context.emit('on-search', formData.value)
    }
    const handleGoPage = (name:string) => {
      router.push({
        name,
        params: {
          voteId: 1
        }
      })
    }
    onMounted(() => {
      listData.value = [{ name: 1, id: 1 }]
    })

    return {
      listData,
      formData,
      handleSearch,
      handleGoPage
    }
  }
})
</script>