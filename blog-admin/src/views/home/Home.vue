<template>
  <div>
    <el-row :gutter="30">
      <el-col :span="6">
        <el-card>
          <div class="card-icon-container">
            <i class="iconfont el-icon-myfangwenliang" style="color: #40c9c6" />
          </div>
          <div class="card-desc">
            <div class="card-title">系统访问量</div>
            <div class="card-count">{{ viewsCount }}</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <div class="card-icon-container">
            <i class="iconfont el-icon-myuser" style="color: #34bfa3" />
          </div>
          <div class="card-desc">
            <div class="card-title">系统用户量</div>
            <div class="card-count">{{ userCount }}</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <div class="card-icon-container">
            <i class="iconfont el-icon-mywenzhang-copy" style="color: #f4516c" />
          </div>
          <div class="card-desc">
            <div class="card-title">系统文章量</div>
            <div class="card-count">{{ articleCount }}</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <div class="card-icon-container">
            <i class="el-icon-s-comment" style="color: #36a3f7" />
          </div>
          <div class="card-desc">
            <div class="card-title">系统留言量</div>
            <div class="card-count">{{ messageCount }}</div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-card style="margin-top: 1.25rem">
      <div class="e-title">系统一周访问量</div>
      <div style="height: 350px">
        <v-chart :options="viewCount" v-loading="loading" />
      </div>
    </el-card>
    <el-card style="margin-top: 1.25rem">
      <div class="e-title">系统用户文章贡献统计</div>
      <div v-loading="loading">
        <calendar-heatmap :end-date="new Date()" :values="articleStatisticsDTOs" />
      </div>
    </el-card>
    <el-row :gutter="20" style="margin-top: 1.25rem">
      <el-col :span="8">
        <el-card>
          <div class="e-title">用户最近访问</div>
          <div style="height: 350px">
            <v-chart :options="userActiveMap" v-loading="loading" />
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <div class="e-title">用户近三天访问次数</div>
          <div style="height: 350px">
            <v-chart :options="userThreeActiveMap" v-loading="loading" />
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <div class="e-title">用户年龄分布统计</div>
          <div style="height: 350px">
            <v-chart :options="userAgeMap" v-loading="loading" />
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20" style="margin-top: 1.25rem">
      <el-col :span="16">
        <el-card>
          <div class="e-title">系统热点文章Top5</div>
          <div style="height: 350px">
            <v-chart :options="ariticleRank" v-loading="loading" />
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <div class="e-title">系统文章分类统计</div>
          <div style="height: 350px">
            <v-chart :options="category" v-loading="loading" />
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20" style="margin-top: 1.25rem">
      <el-col :span="16">
        <el-card>
          <div class="e-title">系统用户地域分布</div>
          <div style="height: 375px" v-loading="loading">
            <div class="area-wrapper">
              <el-radio-group v-model="type">
                <el-radio :label="1">用户</el-radio>
                <el-radio :label="2">游客</el-radio>
              </el-radio-group>
            </div>
            <v-chart :options="userAreaMap" />
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <div class="e-title">系统文章标签词云</div>
          <div style="height: 350px" v-loading="loading">
            <tag-cloud style="margin-top: 1.5rem" :data="tagDTOs" />
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20" style="margin-top: 1.25rem">
      <el-col :span="12">
        <el-card>
          <div class="e-title">系统文章标签统计</div>
          <div style="height: 550px">
            <v-chart :options="tagDTOList" v-loading="loading" />
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <div class="e-title">系统前10文章标签统计</div>
          <div style="height: 550px">
            <v-chart :options="tagTopTenList" v-loading="loading" />
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import '@/assets/js/china'

export default {
  created() {
    this.listUserArea()
    this.getData()
  },
  data: function() {
    return {
      loading: true,
      type: 1,
      viewsCount: 0,
      messageCount: 0,
      userCount: 0,
      articleCount: 0,
      articleStatisticsDTOs: [],
      tagDTOs: [],
      viewCount: {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          }
        },
        color: ['#3888fa'],
        legend: {
          data: ['访问量']
        },
        grid: {
          left: '0%',
          right: '0%',
          bottom: '0%',
          top: '10%',
          containLabel: true
        },
        xAxis: {
          data: [],
          axisLine: {
            lineStyle: {
              color: '#666'
            }
          }
        },
        yAxis: {
          axisLine: {
            lineStyle: {
              color: '#048CCE'
            }
          }
        },
        series: [
          {
            name: '访问量',
            type: 'line',
            data: [],
            smooth: true
          }
        ]
      },
      ariticleRank: {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          }
        },
        color: ['#58AFFF'],
        grid: {
          left: '0%',
          right: '0%',
          bottom: '0%',
          top: '10%',
          containLabel: true
        },
        xAxis: {
          data: []
        },
        yAxis: {},
        series: [
          {
            name: ['浏览量'],
            type: 'bar',
            data: []
          }
        ]
      },
      category: {
        color: ['#7EC0EE', '#FF9F7F', '#FFD700', '#C9C9C9', '#E066FF', '#36dc59', '#C0FF3E'],
        legend: {
          data: [],
          bottom: 'bottom'
        },
        tooltip: {
          trigger: 'item'
        },
        series: [
          {
            name: '文章分类',
            type: 'pie',
            roseType: 'radius',
            data: []
          }
        ]
      },
      userActiveMap: {
        color: ['#7EB0EE', '#FF8C7F', '#FFD210', '#C9C8C9', '#E062FF', '#362D59', '#C02F3E'],
        legend: {
          data: [],
          bottom: 'bottom'
        },
        tooltip: {
          trigger: 'item'
        },
        series: [
          {
            name: '用户最近访问',
            type: 'pie',
            roseType: 'radius',
            label: {
              formatter: function(data) {
                return `${data.name} ${data.value}(${data.percent.toFixed(2)}%)`
              }
            },
            data: []
          }
        ]
      },
      userThreeActiveMap: {
        color: ['#7EC0EE', '#FF9F7F', '#FFD700', '#C9C9C9', '#E066FF', '#36dc59', '#C0FF3E'],
        legend: {
          data: [],
          bottom: 'bottom'
        },
        tooltip: {
          trigger: 'item'
        },
        series: [
          {
            name: '用户最近三天访问人数',
            type: 'pie',
            roseType: 'radius',
            label: {
              formatter: function(data) {
                return `${data.name} ${data.value}(${data.percent.toFixed(2)}%)`
              }
            },
            data: []
          }
        ]
      },
      userAgeMap: {
        color: ['#7EC0EE', '#FF9F7F', '#FFD700', '#C9C9C9', '#E066FF', '#36dc59', '#C0FF3E'],
        legend: {
          data: [],
          bottom: 'bottom'
        },
        tooltip: {
          trigger: 'item'
        },
        series: [
          {
            name: '用户年龄分布统计',
            type: 'pie',
            roseType: 'radius',
            label: {
              formatter: function(data) {
                return `${data.name} ${data.value}(${data.percent.toFixed(2)}%)`
              }
            },
            data: []
          }
        ]
      },
      userAreaMap: {
        tooltip: {
          formatter: function(e) {
            var value = e.value ? e.value : 0
            return e.seriesName + '<br />' + e.name + '：' + value
          }
        },
        visualMap: {
          min: 0,
          max: 1000,
          right: 26,
          bottom: 40,
          showLabel: !0,
          pieces: [
            {
              gt: 100,
              label: '100人以上',
              color: '#ED5351'
            },
            {
              gte: 51,
              lte: 100,
              label: '51-100人',
              color: '#59D9A5'
            },
            {
              gte: 21,
              lte: 50,
              label: '21-50人',
              color: '#F6C021'
            },
            {
              label: '1-20人',
              gt: 0,
              lte: 20,
              color: '#6DCAEC'
            }
          ],
          show: !0
        },
        geo: {
          map: 'china',
          zoom: 1.2,
          layoutCenter: ['50%', '50%'],
          itemStyle: {
            normal: {
              borderColor: 'rgba(0, 0, 0, 0.2)'
            },
            emphasis: {
              areaColor: '#F5DEB3',
              shadowOffsetX: 0,
              shadowOffsetY: 0,
              borderWidth: 0
            }
          }
        },
        series: [
          {
            name: '用户人数',
            type: 'map',
            geoIndex: 0,
            data: [],
            areaColor: '#0FB8F0'
          }
        ]
      },
      tagDTOList: {
        color: ['#7EC0EE', '#FF9F7F', '#FFD700', '#C9C9C9', '#E066FF', '#36dc59', '#C0FF3E'],
        legend: {
          data: [],
          bottom: 'bottom'
        },
        tooltip: {
          trigger: 'item'
        },
        series: [
          {
            name: '系统文章标签统计',
            type: 'pie',
            roseType: 'radius',
            label: {
              formatter: function(data) {
                return `${data.name} ${data.value}(${data.percent.toFixed(2)}%)`
              }
            },
            data: []
          }
        ]
      },
      tagTopTenList: {
        color: ['#7EC0EE', '#FF9F7F', '#FFD700', '#C9C9C9', '#E066FF', '#36dc59', '#C0FF3E'],
        legend: {
          data: [],
          bottom: 'bottom'
        },
        tooltip: {
          trigger: 'item'
        },
        series: [
          {
            name: '系统前10文章标签统计',
            type: 'pie',
            roseType: 'radius',
            label: {
              formatter: function(data) {
                return `${data.name} ${data.value}(${data.percent.toFixed(2)}%)`
              }
            },
            data: []
          }
        ]
      }
    }
  },
  methods: {
    getData() {
      this.axios.get('/api/admin').then(({ data }) => {
        this.viewsCount = data.data.viewsCount
        this.messageCount = data.data.messageCount
        this.userCount = data.data.userCount
        this.articleCount = data.data.articleCount
        this.articleStatisticsDTOs = data.data.articleStatisticsDTOs
        if (data.data.uniqueViewDTOs != null) {
          data.data.uniqueViewDTOs.forEach((item) => {
            this.viewCount.xAxis.data.push(item.day)
            this.viewCount.series[0].data.push(item.viewsCount)
          })
        }
        if (data.data.userActiveDTOS != null) {
          data.data.userActiveDTOS.forEach((item) => {
            console.log(item)
            this.userActiveMap.series[0].data.push({
              value: item.count,
              name: item.day
            })
            this.userActiveMap.legend.data.push(item.day)
          })
        }
        if (data.data.userThreeActiveDTOS != null) {
          data.data.userThreeActiveDTOS.forEach((item) => {
            this.userThreeActiveMap.series[0].data.push({
              value: item.count,
              name: item.day
            })
            this.userThreeActiveMap.legend.data.push(item.day)
          })
        }
        if (data.data.userAgeDTOS != null) {
          data.data.userAgeDTOS.forEach((item) => {
            this.userAgeMap.series[0].data.push({
              value: item.count,
              name: item.interval
            })
            this.userAgeMap.legend.data.push(item.interval)
          })
        }
        if (data.data.categoryDTOs != null) {
          data.data.categoryDTOs.forEach((item) => {
            this.category.series[0].data.push({
              value: item.articleCount,
              name: item.categoryName
            })
            this.category.legend.data.push(item.categoryName)
          })
        }

        if (data.data.articleRankDTOs != null) {
          data.data.articleRankDTOs.forEach((item) => {
            this.ariticleRank.series[0].data.push(item.viewsCount)
            this.ariticleRank.xAxis.data.push(item.articleTitle)
          })
        }

        if (data.data.tagDTOs != null) {
          data.data.tagDTOs.forEach((item) => {
            this.tagDTOs.push({
              id: item.id,
              name: item.tagName
            })
          })
        }

        if (data.data.tagDTOList != null) {
          data.data.tagDTOList.forEach((item) => {
            this.tagDTOList.series[0].data.push({
              value: item.count,
              name: item.tagName
            })
            this.tagDTOList.legend.data.push(item.tagName)
          })
        }

        if (data.data.tagTopTenList != null) {
          data.data.tagTopTenList.forEach(item => {
            this.tagTopTenList.series[0].data.push({
              value: item.count,
              name: item.tagName
            })
            this.tagTopTenList.legend.data.push(item.tagName)
          })
        }

        this.loading = false
      })
    },
    listUserArea() {
      this.axios
        .get('/api/admin/users/area', {
          params: {
            type: this.type
          }
        })
        .then(({ data }) => {
          this.userAreaMap.series[0].data = data.data
        })
    }
  },
  watch: {
    type() {
      this.listUserArea()
    }
  }
}
</script>

<style scoped>
.card-icon-container {
  display: inline-block;
  font-size: 3rem;
}

.area-wrapper {
  display: flex;
  justify-content: center;
}

.card-desc {
  font-weight: bold;
  float: right;
}

.card-title {
  margin-top: 0.3rem;
  line-height: 18px;
  color: rgba(0, 0, 0, 0.45);
  font-size: 1rem;
}

.card-count {
  margin-top: 0.75rem;
  color: #666;
  font-size: 1.25rem;
}

.echarts {
  width: 100%;
  height: 100%;
}

.e-title {
  font-size: 13px;
  color: #202a34;
  font-weight: 700;
}
</style>
