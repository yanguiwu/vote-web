<template>
  <el-card>
    <template #header>	
      <div class='justify-between'>
        <span>选手列表</span>
        <span>
          <el-button type='success' size='mini' @click='handleCreateClick'>添加选手</el-button>
          <el-button type='success' size='mini'>批量添加</el-button>
        </span>
      </div>
    </template>
    <el-form :inline='true' :model='formData' class='demo-form-inline'>
      <el-form-item>
        <el-input v-model='formData.userName' size='mini' placeholder='输入选手名称关键字' style='width: 146px' class='mr-2' />
        <el-input v-model='formData.id' size='mini' placeholder='输入ID' style='width: 146px' class='mr-2' />
        <el-button type='primary' size='mini' @click='handleSearch'>搜索</el-button>
        <el-button type='primary' size='mini'>全部</el-button>
        <!-- <el-button type='primary' size='mini'>数据导出</el-button> -->
        <el-button type='primary' size='mini'>批量删除</el-button>
        <el-button type='danger' size='mini'>一键随机修改票数（1-10）</el-button>
        <el-button type='danger' size='mini'>一键随机修改票数（10-30）</el-button>
      </el-form-item>
    </el-form>
    <el-table :data='listData' border>
      <el-table-column
        prop='infoSeq'
        label='选手编号'
      />
      <el-table-column
        prop='name'
        label='店铺名'
      >
        <template #default='scope'>
          <el-image
            style='width: 100%; height: auto'
            :src='scope.row.fileWebPath'
            fit='fill'
          />
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column
        prop='phone'
        label='手机号'
      />
      <el-table-column label='票数'>
        <template #default='scope'>
          {{ scope.row.gender }}
        </template>
      </el-table-column>
      <el-table-column
        prop='invitationTime'
        label='礼物'
      />
      <el-table-column
        prop='invitationName'
        label='浏览次数'
      />
      <el-table-column
        width='90px'
        prop='createTime'
        label='参与时间'
      >
        <template #default='scope'>
          {{ DateStringConvert(scope.row.createTime) }}
        </template>
      </el-table-column>
      <el-table-column
        prop='invitationName'
        label='二维码'
      />
      <el-table-column
        prop='remark'
        label='备注'
      />
      <el-table-column
        prop='invitationName'
        label='状态'
      />
      <el-table-column label='操作' width='280px'>
        <template #default='scope'>
          <el-button
            size='mini'
            type='primary'
            class='mb-2'
          >复制选手链接</el-button>
          <el-button
            size='mini'
            type='primary'
            class='mb-2'
            @click='()=>handleGoPlayer(scope.row.id)'
          >数据记录</el-button>
          <div>
            <el-button
              size='mini'
              type='primary'
            >设为今日之星</el-button>
            <el-button
              size='mini'
              type='primary'
            >修改</el-button>
            <el-button
              size='mini'
              type='primary'
            >删除</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>
  
<script lang="ts">
import { ref,defineComponent, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { queryPlayerList } from '/@/api/vote/player'
import { DateStringConvert } from '/@/utils/tools'
export default defineComponent({
  emits:['on-search'],
  setup(props:any, context: any) {
    const router = useRouter()
    const route = useRoute()
    const formData = ref({ userName:'',invitationName: '',mobile: '' })
    const listData = ref([])
    let pageData = ref({
      current: 1,
      size: 10
    })
    const handleSearch = () => {
      initListData()
    }
    const handleGoPlayer = (id:number) => {
      router.push({
        name: 'voteListPlayerListRecord',
        params: {
          voteId: route.params.voteId ,
          playerId: id
        }
      })
    }
    const handleCreateClick = () => {
      router.push({
        name: 'voteListPlayerCreate',
        params: {
          voteId: route.params.voteId
        }

      })
    }

    const initListData = async() => {
      let datas = await queryPlayerList({
        infoId:route.params.voteId,
        ...formData.value,
        ...pageData.value
      })
      let { data,...other } = datas.data.body
      listData.value = data
      pageData = { ...other }
    }
    onMounted(() => {
      initListData()
    })

    return {
      listData,
      formData,
      pageData,
      handleSearch,
      handleGoPlayer,
      handleCreateClick,
      DateStringConvert
    }
  }
})
</script>