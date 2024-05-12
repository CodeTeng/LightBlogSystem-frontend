import router from '@/router'
import { useAppStore } from '@/stores/app'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'

const  whiteList = ['Home','Articles']
const check = (path:string)=>{
  if(whiteList.includes(path)){

  }
  return true
}
router.beforeEach(async (to, from, next) => {
  const appStore = useAppStore()
  const userStore = useUserStore()
  appStore.startLoading()
  if(to.path === '/'){
    next()
  }
  else if(whiteList.indexOf(<string>to.name)!=-1) {
    next()
  }else if(userStore.token.length!=0){
    next()
  }else {
    ElMessage.error("请先登录")
    next(from.path)
  }
})

router.afterEach(() => {
  const appStore = useAppStore()
  appStore.endLoading()
  document.getElementById('App-Container')?.focus()
})
