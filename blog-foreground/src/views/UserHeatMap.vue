<template>
  <div class="box">
    <div ref="heatMap" class="about" ></div>
  </div>
</template>


<script lang="ts">
import { defineComponent, onBeforeUpdate, toRefs } from 'vue'
import { getCurrentInstance, onMounted, ref } from 'vue'
import api from '@/api/api'
export default defineComponent( {
  name: 'UserHeatMap',
  props:['userId'],
  components: {},
  setup(props){
    const proxy: any = getCurrentInstance()?.appContext.config.globalProperties
    let heatMap = ref(null)
    const articleStatisticsDTOs = ref([])

    const  initData = ()=>{
      api.getUserForegroundInfo(toRefs(props).userId.value).then(({ data }) => {
        articleStatisticsDTOs.value = data.data.articleStatisticsDTOs
        initChart(getData(articleStatisticsDTOs.value))
      })
    }

    const getData = (propsData:any[]) =>{
      const myData:any[] = []
      propsData.forEach(item => {
        myData.push([
          proxy.$echarts.time.format(item.date, '{yyyy}-{MM}-{dd}', false),
          item.count
        ])
      })
      return myData
    }

    const initChart = (chartData:any[])=>{
      const myChart = proxy.$echarts.init(heatMap.value)
      myChart.setOption({
        tooltip: {
          formatter: function (params:any) {
            return params.value[0] + ' : ' + params.value[1]
          }
        },
        visualMap: {
          show: false,
          min: 0,
          max: 1000,
          inRange: {
            color: [ '#c6e48b', '#7bc96f', '#239a3b', '#196127', '#196127','#7bc96f']
          }
        },
        calendar: {
          itemStyle: {
            color: '#ccc',
            borderWidth: 3,
            borderColor: '#fff'

          },
          cellSize: ['auto', 25],
          range: [new Date().getFullYear()+'-1-1', new Date().getFullYear()+'-12-31'],
          splitLine: true,
          dayLabel: {
            firstDay: 7,
            nameMap: 'ZH'
          },
          monthLabel: {
            nameMap: ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'
            ]
          },
          yearLabel: {
            show: false
          },
          silent: {
            show: false
          }
        },
        series: {
          type: 'heatmap',
          coordinateSystem: 'calendar',
          data: chartData
        }
      })
    }

    onMounted(  () => {
        initData()
    })
    return{
      heatMap
    }
  },

})


</script>
<style lang="scss" scoped>
.box {
  width: 63rem;
  height: 20rem;
  p {
    width: 281px;
    height: 19px;
    font-size: 14px;
    text-align: left;
    line-height: 20px;
    color: #777777;
    margin: 5px 0 10px 21px;
  }
}
.about {
  width: 100%;
  height: 20rem;
}

</style>
