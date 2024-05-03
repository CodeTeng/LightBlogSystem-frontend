<template>
  <div class="flex flex-col">
    <div class="post-header">
      <Breadcrumb :current="t('menu.post')" />
      <h1 class="post-title text-white uppercase">{{ t('menu.post') }}</h1>
    </div>
    <div class="main-grid">
      <div class="bg-ob-deep-800 px-14 py-16 rounded-2xl shadow-xl min-h-screen">
        <ul class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
          <template v-if="haveArticles === true">
            <li v-for="article in articles" :key="article.id">
              <ArticleCard class="user-list-article" :data="article" :is-login-user="isLoginUser" :is-show="true"/>
            </li>
          </template>
          <template v-else>
            <li v-for="n in 9" :key="n">
              <ArticleCard :data="{}" />
            </li>
          </template>
        </ul>
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
</template>
<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs } from 'vue'
import Breadcrumb from '@/components/Breadcrumb.vue'
import { ArticleCard } from '@/components/ArticleCard'
import Paginator from '@/components/Paginator.vue'
import { useRoute } from 'vue-router'
import api from '@/api/api'
import markdownToHtml from '@/utils/markdown'
import { useUserStore } from '@/stores/user'
import { Profile, Sidebar } from '@/components/Sidebar'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  name: 'ArticleList',
  components: { Profile, Sidebar, Breadcrumb, ArticleCard, Paginator },
  setup() {
    const profileRef = ref<InstanceType<typeof Profile>>();
    const route = useRoute()
    const userStore = useUserStore()
    const { t } = useI18n()

    const isLoginUser = ()=>{
      if(route.query.userId==null || route.query.userId == ''){
        return true
      }
      return  userStore.userInfo.userInfoId == route.query.userId
    }

    const pagination = reactive({
      size: 9,
      total: 0,
      current: 1
    })
    const reactiveData = reactive({
      articles: [] as any,
      userId: '' as any,
      haveArticles: false
    })
    onMounted(() => {
      if(isLoginUser()){
        reactiveData.userId = userStore.userInfo.userInfoId
      }else{
        reactiveData.userId = route.query.userId
      }
      profileRef.value?.initUserInfo(reactiveData.userId)
      fetchArticles()
    })
    const fetchArticles = () => {
      reactiveData.haveArticles = false
      api
        .listArticlesByUserId({
          userId: reactiveData.userId,
          current: pagination.current,
          size: pagination.size
        })
        .then(({ data }) => {
          data.data.records.forEach((item: any) => {
            item.articleContent = markdownToHtml(item.articleContent)
              .replace(/<\/?[^>]*>/g, '')
              .replace(/[|]*\n/, '')
              .replace(/&npsp;/gi, '')
          })
          reactiveData.articles = data.data.records
          pagination.total = data.data.count
          reactiveData.haveArticles = true
        })
    }
    const backToPageTop = () => {
      window.scrollTo({
        top: 0
      })
    }
    const pageChangeHanlder = (current: number) => {
      reactiveData.articles = []
      pagination.current = current
      backToPageTop()
      fetchArticles()
    }
    return {
      pagination,
      pageChangeHanlder,
      ...toRefs(reactiveData),
      isLoginUser,
      profileRef,
      t
    }
  }
})
</script>
<style lang="scss">
.user-list-article {
  height: 350px;
  .article-content {
    p {
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 5;
      -webkit-box-orient: vertical;
    }
    .article-footer {
      margin-top: 13px;
    }
  }
}
</style>
