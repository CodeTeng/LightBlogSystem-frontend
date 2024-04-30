<template>
  <div id="feature">
    <HomeSwiper class="home-horizontal-article" />
    <slot />
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import HomeSwiper from '@/components/HomeSwiper.vue'


export default defineComponent({
  name: 'Feature',
  components: { HomeSwiper },
  setup() {
    return {}
  }
})
</script>

<style lang="scss">
.home-horizontal-article {
  .feature-content {
    p {
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 4;
      -webkit-box-orient: vertical;
    }
  }
}
</style>
