<template>
  <div>
    <Breadcrumb :current="t('menu.talks')" />
    <div class="flex flex-col">
      <div class="post-header">
        <h1 class="post-title text-white uppercase">{{ t('titles.talks') }}</h1>
      </div>
      <div class="main-grid">
        <div class="relative space-y-5">
          <!--  talk循环体  -->
          <div
            class="bg-ob-deep-800 flex p-4 lg:p-8 rounded-2xl shadow-xl mb-0 talk-item"
            v-for="item in talks"
            :key="item.id"
            >
            <Avatar :url="item.avatar" @click="toTalk(item.id)" />
            <div class="talk-info" @click="toTalk(item.id)">
              <div class="user-nickname text-sm">
                {{ item.nickname }}
              </div>
              <div class="time">
                {{ t('settings.shared-on') }}
                {{ formatTime(item.createTime) }},
                {{ t(`settings.months[${new Date(item.createTime).getMonth()}]`) }}
                {{ new Date(item.createTime).getDate() }}, {{ new Date(item.createTime).getFullYear() }}
                <template v-if="item.isTop === 1">
                  <svg-icon icon-class="top" class="top-svg" /><span style="color: #f21835">置顶</span>
                </template>
                <svg-icon icon-class="message" class="message-svg" />{{
                  item.commentCount == null ? 0 : item.commentCount
                }}
              </div>

              <div class="talk-content" v-html="item.content" />
              <el-row class="talk-images" v-if="item.imgs">
                <el-col :md="4" v-for="(img, index) of item.imgs" :key="index">
                  <el-image
                    class="images-items"
                    :src="img"
                    aspect-ratio="1"
                    max-height="200"
                    @click.stop="handlePreview(img)" />
                </el-col>
              </el-row>
            </div>
            <div class="float-right" v-if="isLogin()">
              <svg-icon class="inline-block text-3xl" icon-class="edit" @click="editTalk(item.id)"/>
            </div>
          </div>

          <Paginator
            :pageSize="pagination.size"
            :pageTotal="pagination.total"
            :page="pagination.current"
            @pageChange="pageChangeHanlder" />
        </div>
        <div class="col-span-1">
          <Sidebar>
            <Profile ref="profileRef"/>
          </Sidebar>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs ,onBeforeUpdate} from 'vue'
import { useI18n } from 'vue-i18n'
import Breadcrumb from '@/components/Breadcrumb.vue'
import { Sidebar, Profile } from '../components/Sidebar'
import Paginator from '@/components/Paginator.vue'
import Avatar from '../components/Avatar.vue'
import { v3ImgPreviewFn } from 'v3-img-preview'
import { useRoute, useRouter } from 'vue-router'
import api from '@/api/api'
import { useUserStore } from '@/stores/user'

export default defineComponent({
  name: 'talkList',
  components: { Breadcrumb, Sidebar, Profile, Paginator, Avatar },
  setup() {
    const profileRef = ref<InstanceType<typeof Profile>>();
    const { t } = useI18n()
    const router = useRouter()
    const route = useRoute()
    const userStore = useUserStore()
    const userId = ref('')
    userId.value = route.params.userId==null?userStore.userInfo.userInfoId:route.params.userId
    const isLoginUser = ref(false)

    const editTalk = (talkId:any)=>{
      router.push({
        path: `/talk-edit`,
        query:{talkId:talkId}
      })
    }

    const isLogin = ()=>{
      if(userStore.userInfo==='') return false;
      return userStore.userInfo.userInfoId === userId.value
    }

    const pagination = reactive({
      size: 7,
      total: 0,
      current: 1
    })
    const reactiveData = reactive({
      images: [] as any,
      talks: '' as any
    })
    onMounted(() => {
      isLoginUser.value = userId.value == userStore.userInfo.userInfoId;
      profileRef.value?.initUserInfo(userId.value)
      fetchTalks()
    })
    const handlePreview = (index: any) => {
      v3ImgPreviewFn({ images: reactiveData.images, index: reactiveData.images.indexOf(index) })
    }
    // 加载说说列表
    const fetchTalks = () => {
      const params = {
        current: pagination.current,
        size: pagination.size,
        userId: userId.value
      }
      api.getUserTalksById(params).then(({ data }) => {
        reactiveData.talks = data.data.records
        pagination.total = data.data.count
        reactiveData.talks.forEach((item: any) => {
          if (item.imgs) {
            reactiveData.images.push(...item.imgs)
          }
        })
      })
    }
    const formatTime = (data: any): string => {
      let hours = new Date(data).getHours()
      let minutes = new Date(data).getMinutes()
      let seconds = new Date(data).getSeconds()
      return hours + ':' + minutes + ':' + seconds
    }
    const toPageTop = () => {
      window.scrollTo({
        top: 0
      })
    }
    const pageChangeHanlder = (current: number) => {
      reactiveData.talks = ''
      toPageTop()
      pagination.current = current
      fetchTalks()
    }
    const toTalk = (id: any) => {
      router.push({ path: '/talks/' + id })
    }
    return {
      pagination,
      ...toRefs(reactiveData),
      formatTime,
      pageChangeHanlder,
      handlePreview,
      toTalk,
      userId,
      profileRef,
      isLoginUser,
      editTalk,
      isLogin,
      t
    }
  }
})
</script>

<style lang="scss" scoped>
.top-svg {
  margin-left: 5px;
}
.message-svg {
  margin-left: 5px;
  font-size: 15px;
}
.talk-item:hover {
  transform: scale(1.005);
}
.el-card {
  background: var(--background-primary);
  border-radius: 10px;
  border: 0;
}
.talk-info {
  flex: 1;
  margin-left: 10px;
}
.user-nickname {
  font-weight: 530;
}
.time {
  color: #999;
  font-size: 13px;
  @media (min-width: 1280px) {
    margin-top: 4px;
  }
}
.talk-content {
  margin-top: 10px;
  font-size: 14px;
  line-height: 26px;
  white-space: pre-line;
  word-wrap: break-word;
  word-break: break-all;
}
.talk-images {
  margin-top: 8px;
}
.images-items {
  cursor: pointer;
  border-radius: 3px;
  margin-right: 5px;
}
</style>
