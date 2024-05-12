<template>
  <div class="main-grid">
    <el-card class="user-main">
      <div class="e-title">文章贡献统计</div>
      <UserHeatMap :user-id="userId"/>
    </el-card>
    <div class="col-span-1">
      <Profile class="main-grid" ref="profileRef" />
    </div>
  </div>
</template>




<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useUserStore } from '@/stores/user'
import { useRoute } from 'vue-router'
import UserHeatMap from '@/views/UserHeatMap.vue'
import Profile from '@/components/Sidebar/src/Profile.vue'
const userStore = useUserStore()
const route = useRoute()
const userId = ref(null)
userId.value = route.params.userId==null?userStore.userInfo.userInfoId:route.params.userId
const profileRef = ref<InstanceType<typeof Profile>>();
onMounted(()=>{
  profileRef.value?.initUserInfo(userId.value)
})

</script>

<style lang="scss" scoped>
.user-main{
  width: 100%;
  height: 330px;
}
</style>