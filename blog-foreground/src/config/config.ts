export default {
  qqLogin: {
    QQ_APP_ID: '102098634',
    QQ_REDIRECT_URI: 'http://localhost:8080/oauth/login/qq'
  },
  routes: [
    {
      name: 'Home',
      path: '/',
      i18n: {
        cn: '首页',
        en: 'Home'
      },
      children: []
    },
    {
      name: 'Talks',
      path: '/talks',
      i18n: {
        cn: '说说',
        en: 'talks'
      },
      children: []
    },
    {
      name: 'Archives',
      path: '/archives',
      i18n: {
        cn: '归档',
        en: 'Archives'
      },
      children: []
    },
    {
      name: 'Articles',
      path: '/articles',
      i18n: {
        cn: '文章',
        en: 'Articles'
      },
      children: []
    },
    {
      name: 'Message',
      path: '/message',
      i18n: {
        cn: '留言',
        en: 'Message'
      },
      children: []
    },
    {
      name: 'Friends',
      path: '/friends',
      i18n: {
        cn: '社交',
        en: 'Friends'
      },
      children: []
    },
    {
      name: 'SmartAI',
      path: '/smartAi',
      i18n: {
        cn: '智能小助手',
        en: 'Smart Assistant'
      },
      children: []
    },
    {
      name: 'TalkEdit',
      path: '/talks-edit',
      i18n: {
        cn: '编辑说说',
        en: 'Edit Talk'
      },
      children: []
    }
  ]
}
