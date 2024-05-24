<template>
  <div class="article-container" @click="toArticle">
    <span v-if="article.isTop" class="article-tag">
      <b>
        <svg-icon icon-class="pin" />
        {{ t('settings.pinned') }}
      </b>
    </span >
    <span v-else-if="article.isFeatured" class="article-tag">
      <b>
        <svg-icon icon-class="hot" />
        {{ t('settings.featured') }}
      </b>
    </span>
    <div class="article">
      <div class="article-thumbnail relative">
        <img v-if="article.articleCover" v-lazy="article.articleCover" alt="" class="article-cover"/>
        <img v-else src="@/assets/default-cover.jpg" class="article-cover"/>

        <span class="thumbnail-screen" :style="gradientBackground" />
        <!--  编辑信息下拉框  -->
        <el-dropdown
          ref="dropdownRef"
          trigger="contextmenu"
          class="z-30 absolute w-full h-12/10 svg-info  opacity-40"
        >
          <svg-icon
            class=" text-3xl"
            icon-class="article-more"
            v-if="isLoginUser"
            @click.stop="onShow"
          >
          </svg-icon>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item  @click.stop="editArticle" class="main-grid">编辑文章</el-dropdown-item>
              <el-dropdown-item @click.stop="deleteArticle" class="main-grid">删除文章</el-dropdown-item>
              <el-dropdown-item><el-switch
                v-model="article.status"
                class="ml-2"
                inline-prompt
                style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
                active-text="已公开"
                inactive-text="未公开"
                :active-value="1"
                :inactive-value="2"
                :width="100"
                @click="updateArticle"
              /></el-dropdown-item>
              <el-dropdown-item><el-switch
                v-model="article.isTop"
                class="ml-2"
                inline-prompt
                style="--el-switch-on-color: #13ce66; --el-switch-off-color: #cbcb00"
                active-text="已置顶"
                inactive-text="未置顶"
                :active-value="1"
                :inactive-value="0"
                :width="100"
                @click="updateArticle"
              /></el-dropdown-item>
              <el-dropdown-item><el-switch
                v-model="article.isFeatured"
                class="ml-2"
                inline-prompt
                style="--el-switch-on-color: #13ce66; --el-switch-off-color: #D67E3EFF"
                active-text="已推荐"
                inactive-text="未推荐"
                :active-value="1"
                :inactive-value="0"
                :width="100"
                @click="updateArticle"
              /></el-dropdown-item>
              <el-dropdown-item class="main-grid"> <el-tag :type="article.review==1?'success':'danger'">{{getPopoverContent(article).reviewStr}}</el-tag></el-dropdown-item>
              <el-dropdown-item class="main-grid"><el-tag type="primary">{{getPopoverContent(article).typeStr}}</el-tag></el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>

      </div>
      <div class="article-content">
        <span>
          <b v-if="article.categoryName">
            {{ article.categoryName }}
          </b>
          <ob-skeleton v-else tag="b" height="20px" width="35px" />
          <ul v-if="article.tags && article.tags.length > 0">
            <li v-for="tag in article.tags" :key="tag.id">
              <em># {{ tag.tagName }}</em>
            </li>
          </ul>
          <ul v-else-if="article.tags && article.tags.length <= 0">
            <li>
              <em># {{ t('settings.default-tag') }}</em>
            </li>
          </ul>
          <ul v-else>
            <ob-skeleton v-if="!article.tags" :count="2" tag="li" height="16px" width="35px" />
          </ul>
        </span>
        <h1 class="article-title" v-if="article.articleTitle">
          <a>
            <span data-dia="article-link"> {{ article.articleTitle }}</span>
            <svg-icon v-if="article.status == 2" icon-class="lock" class="lock-svg" />
          </a>
        </h1>
        <ob-skeleton v-else tag="h1" height="3rem" />
        <p v-if="article.articleContent" class="article-content-main">{{ article.articleContent }}</p>
        <ob-skeleton v-else tag="p" :count="5" height="16px" />
        <div class="article-footer" v-if="article.author && article.createTime">
          <div class="flex flex-row items-center">
            <img
              class="hover:opacity-50 cursor-pointer"
              :src="article.author.avatar || ''"
              alt="author avatar"
              @click="handleAuthorClick(article.author.website)" />
            <span class="text-ob-dim">
              <strong
                class="text-ob-normal pr-1.5 hover:text-ob hover:opacity-50 cursor-pointer"
                @click="handleAuthorClick(article.author.website)">
                {{ article.author.nickname }}
              </strong>
              {{ t('settings.shared-on') }} {{ t(`settings.months[${new Date(article.createTime).getMonth()}]`) }}
              {{ new Date(article.createTime).getDate() }}, {{ new Date(article.createTime).getFullYear() }}
            </span>
          </div>
        </div>
        <div class="article-footer" v-else>
          <div class="flex flex-row items-center mt-6">
            <ob-skeleton class="mr-2" height="28px" width="28px" :circle="true" />
            <span class="text-ob-dim mt-1">
              <ob-skeleton height="20px" width="150px" />
            </span>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, getCurrentInstance, ref, toRefs,defineEmits  } from 'vue'
import { useAppStore } from '@/stores/app'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import emitter from '@/utils/mitt'
import SvgIcon from '@/components/SvgIcon/index.vue'
import { Edit } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import api from '@/api/api'

export default defineComponent({
  name: 'ArticleCard',
  components: { SvgIcon ,Edit},
  props: ['data','isLoginUser','isShow'],
  setup(props) {
    const proxy: any = getCurrentInstance()?.appContext.config.globalProperties
    const appStore = useAppStore()
    const userStore = useUserStore()
    const router = useRouter()
    const { t } = useI18n()
    const dropdownRef = ref<any>()

    const article = toRefs(props).data

    const emit = defineEmits(["initData"]);


    const editArticle = () => {
      router.push({
        path: "/article-edit",
        query: { articleId: article.value.id }
      })
    }
    const deleteArticle = () => {
      ElMessageBox.confirm(
        '删除后不可恢复,确定删除?',
        'Warning',
        {
          buttonSize: 'small',
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          cancelButtonClass: 'messageBoxP_cancelBtn',
          confirmButtonClass: 'messageBoxP_confirmBtn',
          customClass: 'persdsd',
          type: 'warning',
        }
      )
        .then(() => {
          api.deleteArticleById(article.value.id).then(({ data }) => {
            if (data.flag) {
              ElMessage({
                type: 'success',
                message: '删除成功',
              })
              emit("initData", "");
            }
          })
        })
    }

    // 更新是否置顶,是否公开,是否推荐
    const updateArticle = () => {
      const params = {
        id: article.value.id,
        isTop: article.value.isTop,
        isFeatured: article.value.isFeatured,
        status: article.value.status
      }
      api.updateArticleCardInfo(params).then(({ data }) => {
        if (data.flag) {
          ElMessage({
            type: 'success',
            message: '设置成功',
          })
          emit("initData", "");
        }
      })
    }

    const onShow = () => {
      dropdownRef.value.handleOpen()
    }

    const getPopoverContent = (article: any) => {
      const content = {
        statusStr: '',
        typeStr: '',
        reviewStr: ''
      }
      switch (article.status) {
        case 1:
          content.statusStr = '公开'
          break
        case 2:
          content.statusStr = '私密'
          break
        case 3:
          content.statusStr = '草稿'
          break
      }
      switch (article.type) {
        case 1:
          content.typeStr = '原创'
          break
        case 2:
          content.typeStr = '转载'
          break
        case 3:
          content.typeStr = '翻译'
          break
      }
      switch (article.review) {
        case 0:
          content.reviewStr = '未审核'
          break
        case 1:
          content.reviewStr = '已审核'
          break
      }
      return content;
    }
    const handleAuthorClick = (link: string) => {
      if (link === '') link = window.location.href
      window.open(link)
    }
    const toArticle = () => {
      // 如果用户已经登录且加密文章是自己的文章，可直接查看
      if (userStore.userInfo.userInfoId==article.value.author.id) {
        router.push({ path: '/articles/' + article.value.id })
        return
      }

      // 文章需要密码认证
      if (article.value.status == 2) {

        if (userStore.userInfo === '') {
          // 用户未登录
          proxy.$notify({
            title: 'Warning',
            message: '该文章受密码保护,请登录后访问',
            type: 'warning'
          })
        } else{
          // 判断文章是否认证过
          for (let accessArticleId of userStore.accessArticles) {
            if(accessArticleId == article.value.id){
              router.push({ path: '/articles/' + article.value.id })
              return
            }
          }
          // 用户已经登录，弹窗输入密码
          emitter.emit('changeArticlePasswordDialogVisible', props.data.id)
        }
        return
      }
      router.push({ path: '/articles/' + article.value.id })
    }

    return {
      gradientBackground: computed(() => {
        return { background: appStore.themeConfig.header_gradient_css }
      }),
      article,
      handleAuthorClick,
      toArticle,
      isLoginUser:toRefs(props).isLoginUser,
      isShow: toRefs(props).isShow.value,
      t,
      Edit,
      getPopoverContent,
      editArticle,
      router,
      dropdownRef,
      deleteArticle,
      updateArticle,
      onShow
    }
  }
})
</script>

<style lang="scss" scoped>
.article-title:hover {
  cursor: default;
}
.article-content-main:hover {
  cursor: default;
}
.article-cover {
  position: relative;
  cursor: pointer;
}
.svg-info{
  left: 88%;
  color: #cbcb00;
}
</style>
<style lang="scss">

.persdsd {
  .el-message-box__btns {
    .messageBoxP_cancelBtn {
      width: 150px;
    }
    .messageBoxP_confirmBtn {
      width: 150px;
    }
  }
}

</style>