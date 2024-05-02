import router from '@/router'
import { useAppStore } from '@/stores/app'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'

const  whiteList = ['/','/home','/articles/']
const check = (path:string)=>{
  whiteList.forEach(item=>{
    if(!path.startsWith(item)){
      return false;
    }
  })
  return true
}
router.beforeEach(async (to, from, next) => {
  const appStore = useAppStore()
  const userStore = useUserStore()
  appStore.startLoading()
  if(check(to.path)) {
    next()
  }else if(userStore.token!=''){
    next()
  }else {
    ElMessage.error("请先登录")
    next("/")
  }
})

router.afterEach(() => {
  const appStore = useAppStore()
  appStore.endLoading()
  document.getElementById('App-Container')?.focus()
})
