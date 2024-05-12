<template>
  <div class="flex flex-col">
    <div class="post-header">
      <Breadcrumb :current="t('menu.album')" />
      <h1 class="post-title text-white uppercase">{{ t('menu.album') }}</h1>
    </div>

    <div class="main-block">
      <Star class="bg-ob-deep-800 px-14 py-16 rounded-2xl shadow-xl min-h-screen album-main">

        <template #body>
          <ul class="grid grid-cols-1  xl:grid-cols-2 gap-10 ">
            <li v-for="item in photoAlbums" :key="item.id" @click="router.push(`/photos/${item.id}`)">
              <div class="album-item">
                <div class="album-photo-count">
                  <div>{{ item.photoCount }}</div>
                </div>
                <el-image fit="cover" class="album-cover" :src="item.albumCover" ></el-image>
                <div class="album-name">{{ item.albumName }}</div>
              </div>
            </li>
          </ul>

          <Paginator
            :pageSize="pagination.size"
            :pageTotal="pagination.total"
            :page="pagination.current"
            @pageChange="pageChangeHanlder" />
        </template>
      </Star>


    </div>
  </div>
</template>


<script lang="ts">
import { defineComponent, onMounted, reactive, ref } from 'vue'
import Breadcrumb from '@/components/Breadcrumb.vue'
import { useI18n } from 'vue-i18n'
import { ArticleCard } from '@/components/ArticleCard'
import api from '@/api/api'
import Paginator from '@/components/Paginator.vue'
import Star from '@/components/Star.vue'
import { useRouter } from 'vue-router'
interface PhotoAlbum{
  id:string,
  albumName:string,
  albumDesc:string,
  albumCover:string,
  photoCount: number
}

export default defineComponent({
  name: 'PhotosList',
  components: { Paginator, ArticleCard, Breadcrumb ,Star},
  setup() {
    const {t} = useI18n()
    const router = useRouter()
    const photoAlbums = ref<PhotoAlbum[]>([])
    const pagination = reactive({
      size: 9,
      total: 0,
      current: 1
    })

    // 加载数据
    const fetchAlbums = ()=>{

      const params = {
        current: pagination.current,
        size: pagination.size
      }
      api.getAlbums(params).then(({ data }) => {
        console.log(data.data)
        if(data.flag){
          photoAlbums.value = data.data.records
          pagination.total = data.data.count
        }
      })
    }

    const pageChangeHanlder = (current: number) => {
      photoAlbums.value = []
      pagination.current = current
      backToPageTop()
      fetchAlbums()
    }

    const backToPageTop = () => {
      window.scrollTo({
        top: 0
      })
    }



    onMounted(()=>{
      fetchAlbums()
    })

    return {
      t,
      photoAlbums,
      pagination,
      pageChangeHanlder,
      router
    }
  }
})
</script>

<style scoped lang="scss">

.album-main {
  background: rgb(193,193,193);
  background: radial-gradient(circle at 90% 5%, rgb(216, 27, 156) 0%, rgb(182, 16, 110) 26%, rgb(18, 143, 181) 52%);
}
.album-name {
  display: flex;
  text-align: center;
  text-shadow:  0 0 2px hsl(40, 28.57% , 28.82%),0 0 2px hsl(40, 28.57% , 28.82%), 0 0 2px hsl(40, 28.57% , 28.82%);/*多个叠加*/
  font-size: 30px;
  color: rgba(255, 255, 255, 0.45);
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.album-cover {
  position: relative;
  border-radius: 4px;
  width: 100%;
  height: 100%;
}
.album-cover::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
}
.album-photo-count {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 3rem;
  z-index: 1000;
  position: absolute;
  left: 0;
  right: 0;
  padding: 0 0.5rem;
  bottom: 2rem;
  color: #fff;
}
.album-item {
  position: relative;
  cursor: pointer;
  height: 400px;
}
:deep(.el-card__body){
  padding: 0;
}
</style>