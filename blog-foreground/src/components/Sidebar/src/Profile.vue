<template>
  <div class="h-98 w-full rounded-2xl relative shadow-xl mb-8" :style="gradientBackground">
    <div
      class="ob-gradient-cut-plate absolute bg-ob-deep-900 rounded-xl opacity-90 flex justify-center items-center pt-4 px-6 shadow-lg hover:shadow-2xl duration-300"
      data-dia="author">
      <div class="profile absolute w-full flex flex-col justify-center items-center">
        <div class="flex flex-col justify-center items-center">
          <router-link :to="{path:'/user',query: {userId: userId}}">
            <img v-if="avatar" :class="avatarClass" :src="avatar" />
            <img v-else :class="avatarClass" :src="require('/src/assets/loading.gif')" alt="" />
          </router-link>
          <h2 class="text-center pt-4 text-4xl font-semibold text-ob-bright">
            <template v-if="nickName">
              {{ nickName }}
            </template>
            <ob-skeleton v-else height="2.25rem" width="7rem" />
          </h2>
          <span class="h-1 w-14 rounded-full mt-2" :style="gradientBackground" />
          <p
            v-if="userIntro"
            class="pt-6 px-10 w-full text-s text-center"
            v-html="userIntro" />
          <p v-else class="pt-6 px-10 w-full text-sm text-center flex flex-col gap-2">
            <ob-skeleton :count="2" height="20px" width="10rem" />
          </p>
        </div>

        <div class="h-full w-full flex flex-col flex-1 justify-end items-end">
          <Social />
          <ul class="grid grid-cols-3 pt-4 w-full px-2 text-lg">
            <router-link :to="{path:'/articles/list',query: {userId: userId}}">
              <li class="col-span-1 text-center">
              <span class="text-ob-bright">
                {{ articleCount }}
              </span>
                <p class="text-base">{{ t('settings.articles') }}</p>
              </li>
            </router-link>
            <router-link :to="{path:'/talks',query: {userId: userId}}">
              <li class="col-span-1 text-center">
                <span class="text-ob-bright">{{ talkCount }}</span>
                <p class="text-base">{{ t('settings.talks') }}</p>
              </li>
            </router-link>
            <router-link :to="{path:'/message',query: {userId: userId}}">
              <li class="col-span-1 text-center">
                <span class="text-ob-bright"> {{ messageCount }}</span>
                <p class="text-base">{{ t('settings.messages') }}</p>
              </li>
            </router-link>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { useAppStore } from '@/stores/app'
import { computed, defineComponent, defineExpose, ref, toRef } from 'vue'
import { useI18n } from 'vue-i18n'
import Social from '@/components/Social.vue'
import api from '@/api/api'
export default defineComponent({
  name: 'Profile',
  components: { Social },
  setup(props) {
    const appStore = useAppStore()
    const { t } = useI18n()
    const userId = ref('')
    const avatar = ref(null)
    const nickName = ref("加载中") // 用户名称
    const userIntro = ref("")
    const messageCount = ref(0) // 留言数量
    const articleCount = ref(0) // 文章数量
    const talkCount = ref(0) // 说说数量

    const initUserInfo = async (id:any)=>{
      userId.value = id
      console.log(id)
      api.getUserShowById(id).then(({data}) => {
        console.log(data.data)
        if(data.flag){
          const userInfo = data.data;
          avatar.value = userInfo.avatar
          nickName.value = userInfo.nickName==null?"":userInfo.nickName
          userIntro.value = userInfo.userIntro==null?"":userInfo.userIntro
          messageCount.value = userInfo.messageCount==null?0:userInfo.messageCount
          articleCount.value = userInfo.articleCount==null?0:userInfo.messageCount
          talkCount.value = userInfo.talkCount==null?0:userInfo.messageCount
        }
      })
    }

    defineExpose({
      initUserInfo
    })

    return {
      avatarClass: computed(() => {
        return {
          'ob-avatar': true,
          [appStore.themeConfig.profile_shape]: true
        }
      }),
      themeConfig: computed(() => appStore.themeConfig),
      gradientBackground: computed(() => {
        return { background: appStore.themeConfig.header_gradient_css }
      }),
      articleCount,
      talkCount,
      messageCount,
      nickName,
      avatar,
      userIntro,
      userId,
      initUserInfo,
      t
    }
  }
})
</script>

<style lang="scss" scoped>
.profile {
  top: -7%;
  height: 100%;
  max-height: 100%;
}
</style>
