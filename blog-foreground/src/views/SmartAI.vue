<script setup lang="ts">
import { Profile, Sidebar } from '@/components/Sidebar'
import Breadcrumb from '@/components/Breadcrumb.vue'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '@/stores/user'
import { getCurrentInstance, nextTick, ref } from 'vue'
import api from '@/api/api'
import { ElLoading } from 'element-plus'

const { t } = useI18n()
const userStore = useUserStore()
const queryContent = ref('')
const sendMessages = ref<Array<string>>([])
const isDisabled =  ref(false)
const proxy: any = getCurrentInstance()?.appContext.config.globalProperties

const send = async () => {
  if (userStore.userInfo === '') {
    proxy.$notify({
      title: 'Warning',
      message: '请登录后询问',
      type: 'warning'
    })
    return
  }
  if (queryContent.value === '') return
  isDisabled.value = true
  loading.value = true
  const res = await api.query(queryContent.value)
  sendMessages.value.push(queryContent.value)
  queryContent.value = ''
  sendMessages.value.push(res.data.data)
  loading.value = false
  isDisabled.value = false
}
</script>

<template>
  <div>
    <Breadcrumb :current="t('menu.smartAi')" />
    <div class="flex flex-col">
      <div class="post-header">
        <h1 class="post-title text-white uppercase">{{ t('titles.smartAi') }}</h1>
      </div>
      <div class="main-block">
        <div class="relative">
          <div class="post-html">
            <div class="dashboard-content">
              <div class="message-content">
                <div>
                  <div class="msg-received">
                    <div class="msg-image">
                      <img src="@/assets/smartAi.png" alt="image">
                    </div>
                    <div class="msg-content">
                      <p class="msg">
                        {{
                          userStore.userInfo.nickname
                        }}你好，我是您的智能专属小助手，有任何需要咨询的问题，都可以向我提问，我会全心全意为您解答！</p>
                    </div>
                  </div>
                </div>
              </div>
              <div class="message-content">
                <div v-for="(message, index) in sendMessages" :key="index">
                  <div v-if="index % 2 === 0" class="msg-send">
                    <div class="msg-image">
                      <img :src="userStore.userInfo.avatar" alt="image">
                    </div>
                    <div class="msg-content">
                      <p class="msg">{{ message }}</p>
                    </div>
                  </div>
                  <div v-else class="msg-received">
                    <div class="msg-image">
                      <img src="@/assets/smartAi.png" alt="image">
                    </div>
                    <div class="msg-content">
                      <p class="msg">{{ message }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="msg-reply">
              <el-input
                  v-model="queryContent"
                  style="width: 1000px"
                  @change="send"
                  placeholder="输入要咨询的内容..."
              >
                <template #append>
                  <el-button type="primary" :disabled="isDisabled" :loading="loading" style="width: 100px" size="large"
                             @click="send">发送
                  </el-button>
                </template>
              </el-input>
            </div>
          </div>
        </div>
<!--        <div class="col-span-1">-->
<!--          <Sidebar>-->
<!--            <Profile />-->
<!--          </Sidebar>-->
<!--        </div>-->
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.side-nav-bar:not(.el-menu--collapse) {
  width: 210px;
}

.side-nav-bar {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  overflow-x: hidden;
  overflow-y: auto;
}

.side-nav-bar i {
  margin-right: 1rem;
}

*::-webkit-scrollbar {
  width: 0.5rem;
  height: 1px;
}

*::-webkit-scrollbar-thumb {
  border-radius: 0.5rem;
  background-color: rgba(144, 147, 153, 0.3);
}

.dashboard-content {
  overflow-y: scroll;
  height: 500px;

  .message-content {
    padding: 10px;
    display: inline-block;
    width: 100%;

    .msg-send {
      margin-bottom: 10px;
      text-align: right; /* Align sent messages to the right */

      .msg-image {
        width: 60px;
        height: 60px;
        float: right;
        margin-right: 20px;
        border-radius: 50%;
        overflow: hidden;
      }

      .msg-content {
        padding-right: 70px;
        margin-bottom: 20px;
      }

      & p {
        margin-bottom: 0;
        font-size: 14px;
        color: #1a1a1a;
      }

      p.msg {
        background: #eee;
        padding: 8px;
        margin-right: 10px;
        display: inline-block;
        max-width: 40%;
        border-radius: 5px;
      }
    }

    .msg-received {
      margin-bottom: 10px;
      text-align: left; /* Align received messages to the left */

      .msg-image {
        width: 60px;
        height: 60px;
        float: left;
        border-radius: 50%;
        overflow: hidden;
      }

      .msg-content {
        padding-left: 70px;
        margin-bottom: 20px;
      }

      & p {
        margin-bottom: 0;
        font-size: 14px;
        color: #1a1a1a;
      }

      p.msg {
        background: #eee;
        padding: 8px;
        display: inline-block;
        max-width: 40%;
        border-radius: 5px;
      }
    }
  }
}

.msg-reply {
  margin-top: 17px;
  //display: flex;
  //justify-content: space-between;
  //align-items: center;
}
</style>
