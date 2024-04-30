<template>
  <!--    @swiper="onSwiper"
      @slideChange="onSlideChange"
      -->
  <div class="inverted-main-grid py-8 gap-8 box-border main-grid">
    <swiper
      :autoplay = "{
         pauseOnMouseEnter: true,
         delay: 2000,
        }"
      :pagination="{
      dynamicBullets: true,
      clickable: true
      }"
      :modules="modules"
      class="homeSwiper ob-gradient-plate opacity-90 relative z-10 bg-ob-deep-900 rounded-2xl flex justify-start items-end px-8 pb-10 shadow-md"
    >
      <swiper-slide v-for="(item,index) in images" :key="index">
        <img :src="item" style="width: 100%;height: 100%">
      </swiper-slide>

    </swiper>
  </div>

</template>

<!--主页轮播图-->
<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import { Pagination,Autoplay  } from 'swiper/modules';
import { onMounted, ref } from 'vue'
import api from '@/api/api'

const modules = ref([Pagination,Autoplay])

const images = ref([])
onMounted(()=>{
  api.getAllCarousels().then(({data})=>{
    console.log(data)
    if(data.flag){
      images.value = data.data
    }
  })
})

</script>

<style scoped lang="scss">
.homeSwiper{
  width: auto;
  height: 600px;
  background-color: #ffffff;
}
</style>