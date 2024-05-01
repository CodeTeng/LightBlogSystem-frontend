<template>
  <div id="feature">
    <HomeSwiper />
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
</style>
