<template>

</template>

<script lang="ts">
import { defineComponent, ref, toRefs } from 'vue'
import api from '@/api/api'

export default defineComponent({
  name: 'ArticleTop',
  props:["userId"],
  setup(props){
    const articleCard = ref()
    const userId = toRefs(props).userId
    // 初始化数据
    const initComponent = ()=>{
      api.getTopArticleByUserId(userId.value).then(({data}) => {
        if(data.flag){
          articleCard.value = data.data
        }
      })
    }
    return{}
  },

})
</script>

<style scoped lang="scss">

</style>