import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/user',
    name: 'UserInfo',
    component: () => import('../views/UserInfo.vue')
  },
  {
    path: '/articles',
    name: 'ArticleList',
    component: () => import('../views/ArticleList.vue')
  },
  {
    path: '/articles/:articleId',
    name: 'Articles',
    component: () => import('../views/Article.vue')
  },
  {
    path: '/article-edit',
    name: 'ArticleEdit',
    component: () => import('../components/Article/src/ArticleEdit.vue')
  },
  {
    path: '/talks',
    name: 'talkList',
    component: () => import('../views/TalkList.vue')
  },
  {
    path: '/talks/:talkId',
    name: 'talks',
    component: () => import('../views/Talk.vue')
  },
  {
    path: '/talk-edit',
    name: 'talkEdit',
    component: () => import('../components/Talk/src/TalkEdit.vue')
  },
  {
    path: '/archives',
    name: 'Archives',
    component: () => import('../views/Archives.vue')
  },
  {
    path: '/message',
    name: 'Message',
    component: () => import('../views/Message.vue')
  },
  {
    path: '/friends',
    name: 'Friends',
    component: () => import('../views/FriendLink.vue')
  },
  {
    path: '/smartAi',
    name: 'SmartAI',
    component: () => import('../views/SmartAI.vue')
  },
  {
    path: '/photos/:albumId',
    name: 'Photos',
    component: () => import('../views/Photos.vue')
  },
  {
    path: '/404',
    name: '404',
    component: () => import('../views/404.vue')
  },
  {
    path: '/oauth/login/qq',
    name: 'qqLogin',
    component: () => import('../components/OauthLogin.vue')
  },
  {
    path: '/:catchAll(.*)',
    redirect: '/404',
    hidden: true
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
