<template>
  <div class="h-98 w-full rounded-2xl relative shadow-xl mb-8" :style="gradientBackground">
    <div
      class="ob-gradient-cut-plate absolute bg-ob-deep-900 rounded-xl opacity-90 flex justify-center items-center pt-4 px-6 shadow-lg hover:shadow-2xl duration-300"
      data-dia="author">
      <div class="profile absolute w-full flex flex-col justify-center items-center">
        <div class="flex flex-col justify-center items-center">
          <img v-if="authorAvatar" :class="avatarClass" :src="authorAvatar" />
          <img v-else :class="avatarClass" :src="default" />
          <h2 class="text-center pt-4 text-4xl font-semibold text-ob-bright">
            <template v-if="userName">
              {{ userName }}
            </template>
            <ob-skeleton v-else height="2.25rem" width="7rem" />
          </h2>
          <span class="h-1 w-14 rounded-full mt-2" :style="gradientBackground" />
<!--          <p-->
<!--            v-if="userName"-->
<!--            class="pt-6 px-10 w-full text-s text-center"-->
<!--            v-html="userName" />-->
<!--          <p v-else class="pt-6 px-10 w-full text-sm text-center flex flex-col gap-2">-->
<!--            <ob-skeleton :count="2" height="20px" width="10rem" />-->
<!--          </p>-->

        </div>
        <div class="h-full w-full flex flex-col flex-1 justify-end items-end">
          <Social />
          <ul class="grid grid-cols-3 pt-4 w-full px-2 text-lg">
            <router-link :to="{path:'/index',query: {userId: userId}}">
              <li class="col-span-1 text-center">
              <span class="text-ob-bright">
                {{ articleCount }}
              </span>
                <p class="text-base">{{ t('settings.articles') }}</p>
              </li>
            </router-link>
            <router-link to="">
              <li class="col-span-1 text-center">
                <span class="text-ob-bright">{{ talkCount }}</span>
                <p class="text-base">{{ t('settings.talks') }}</p>
              </li>
            </router-link>
            <router-link to="">
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
import { computed, defineComponent, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import Social from '@/components/Social.vue'

export default defineComponent({
  name: 'Profile',
  components: { Social },
  props:{
    userId: String,
  },
  setup(props) {
    const appStore = useAppStore()
    const { t } = useI18n()
    const userId = ref(0)
    const authorAvatar = ref("http://my-bucket0823.oss-cn-beijing.aliyuncs.com/aurora/avatar/aa36bad4068f13992d7b2beec074838a.jpg")
    const userName = ref("用户名称") // 用户名称
    const messageCount = ref(0) // 留言数量
    const articleCount = ref(0) // 文章数量
    const talkCount = ref(0) // 说说数量

    return {
      default: 'https://static.linhaojun.top/aurora/config/52a81cd2772167b645569342e81ce312.jpg',
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
      userName,
      authorAvatar,
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
