<template>
  <div>
    <Breadcrumb :current="t('menu.message')" />
    <div class="flex flex-col">
      <div class="post-header">
        <h1 class="post-title text-white uppercase">{{ t('titles.message') }}</h1>
      </div>
      <div class="main-grid">
        <div class="relative">
          <div class="post-html" v-html="`这是一个留言版<br><br>欢迎大家前来留言💖`" />
          <Comment />
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
import { defineComponent, onMounted, reactive, toRefs, computed, provide, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Sidebar, Profile } from '../components/Sidebar'
import Breadcrumb from '@/components/Breadcrumb.vue'
import { Comment } from '../components/Comment'
import { useCommentStore } from '@/stores/comment'
import api from '@/api/api'
import emitter from '@/utils/mitt'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'

export default defineComponent({
  name: 'Message',
  components: { Breadcrumb, Comment, Sidebar, Profile },
  setup() {
    const profileRef = ref<InstanceType<typeof Profile>>();
    const { t } = useI18n()
    const commentStore = useCommentStore()
    const route = useRoute()
    const userStore = useUserStore()
    const reactiveData = reactive({
      comments: [] as any,
      haveMore: false as any,
      isReload: false as any
    })
    const userId = ref(route.params.userId==null ? userStore.userInfo.userInfoId : route.params.userId)


    const pageInfo = reactive({
      current: 1,
      size: 7
    })
    commentStore.type = 2
    onMounted(() => {
      profileRef.value?.initUserInfo(userId.value)
      fetchComments()
    })
    provide(
      'comments',
      computed(() => reactiveData.comments)
    )

    provide(
      'haveMore',
      computed(() => reactiveData.haveMore)
    )
    emitter.on('messageFetchComment', () => {
      pageInfo.current = 1
      reactiveData.isReload = true
      fetchComments()
    })
    emitter.on('messageFetchReplies', (index) => {
      fetchReplies(index)
    })
    emitter.on('messageLoadMore', () => {
      fetchComments()
    })
    const fetchComments = () => {
      const params = {
        type: 2,
        topicId: null,
        current: pageInfo.current,
        size: pageInfo.size
      }
      api.getComments(params).then(({ data }) => {
        if (reactiveData.isReload) {
          reactiveData.comments = data.data.records
          reactiveData.isReload = false
        } else {
          reactiveData.comments.push(...data.data.records)
        }
        if (data.data.count <= reactiveData.comments.length) {
          reactiveData.haveMore = false
        } else {
          reactiveData.haveMore = true
        }
        pageInfo.current++
      })
    }
    const fetchReplies = (index: any) => {
      api.getRepliesByCommentId(reactiveData.comments[index].id).then(({ data }) => {
        reactiveData.comments[index].replyDTOs = data.data
      })
    }
    return {
      ...toRefs(reactiveData),
      t,
      profileRef,
      userId
    }
  }
})
</script>
