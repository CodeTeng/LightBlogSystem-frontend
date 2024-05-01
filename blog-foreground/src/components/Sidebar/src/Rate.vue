<template>
  <div class="sidebar-box">
    <SubTitle :title="'titles.rate'" icon="rate" />
    <div class="sidebar-rate mx-auto">
      <el-rate
        v-model="value" size="large"
        :texts="['糟糕', '勉强', '一般', '优秀', '完美']"
        show-text
        class="h-2"
        @change="setScore"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent,defineExpose , ref, getCurrentInstance } from 'vue'
import { SubTitle } from '@/components/Title'
import api from '@/api/api'
import { ElRate } from 'element-plus'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  name:'Rate',
  components: { SubTitle,ElRate },
  setup(){
    const proxy: any = getCurrentInstance()?.appContext.config.globalProperties
    const value = ref(0);
    const articleId = ref()
    const { t } = useI18n()

    const setScore = ()=>{
      const params = {
        articleId:articleId.value,
        score:value.value
      }
      api.setArticleScore(params).then(({data})=>{
          if(data.data==true){
            proxy.$notify({
              title: '评分',
              message: '感谢您的评分',
              type: 'success'
            })
          }
      })
    }

    const updateScore = (article:any)=>{
      value.value =0;
      articleId.value = article;
      api.getArticleScore(article).then(({data})=>{
        if(data.flag==true){
          value.value = data.data
        }else{

        }
      })
    }
    // 暴露信息
    defineExpose({
      // 暴露方法
      updateScore
    });
    return {
      value,
      setScore,
      updateScore
    }
  }
})



</script>


<style scoped lang="scss">
#sidebar-rate {
  height: 50px;
}
</style>