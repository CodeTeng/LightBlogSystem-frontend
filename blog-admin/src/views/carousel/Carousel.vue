<template>
  <el-card class="main-card">
    <div class="title">{{ this.$route.name }}</div>
    <div class="operation-container">
      <el-button type="primary" size="small" icon="el-icon-plus" @click="openModel(null)"> 新增 </el-button>
      <el-button
        type="danger"
        size="small"
        icon="el-icon-delete"
        :disabled="carouselIds.length == 0"
        @click="isDelete = true">
        批量删除
      </el-button>
    </div>

    <el-table border :data="carousels" v-loading="loading" @selection-change="selectionChange">
      <el-table-column type="selection" width="55" />
      <el-table-column prop="id" label="图片ID" align="center" />
      <el-table-column prop="url" label="图片URL" align="center" >
        <template slot-scope="scope">
          <el-image
            class="img-cover"
            :preview-src-list="imgList"
            :src=" scope.row.url" />
        </template>
      </el-table-column>
      <el-table-column prop="sort" label="排序" align="center" />
      <el-table-column prop="status" label="是否启用" align="center">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            active-text="启用"
            inactive-text="禁用"
            :active-value="1"
            :inactive-value="0"
            inactive-color="#ff0008"
            active-color="#36e31a"
            :change="changeStatus(scope.row)" />
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="160">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="openModel(scope.row)"> 编辑 </el-button>
          <el-popconfirm title="确定删除吗？" style="margin-left: 1rem" @confirm="deleteModel(scope.row.id)">
            <el-button size="mini" type="danger" slot="reference"> 删除 </el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="pagination-container"
      background
      @size-change="sizeChange"
      @current-change="currentChange"
      :current-page="current"
      :page-size="size"
      :total="count"
      :page-sizes="[10, 20]"
      layout="total, sizes, prev, pager, next, jumper" />

    <el-dialog :visible.sync="isDelete" width="30%">
      <div class="dialog-title-container" slot="title"><i class="el-icon-warning" style="color: #ff9900" />提示</div>
      <div style="font-size: 1rem">是否删除选中项？</div>
      <div slot="footer">
        <el-button @click="isDelete = false">取 消</el-button>
        <el-button type="primary" @click="deleteModel(null)"> 确 定 </el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="addOrEdit" width="30%">
      <div class="dialog-title-container" slot="title" ref="carouselTitle" />
      <el-form label-width="80px" size="medium" :model="carouselForm">
        <el-form-item label="图片">
          <el-upload
            class="upload-cover"
            drag
            action="/api/admin/carousels/images"
            multiple
            :headers="headers"
            :show-file-list="false"
            :before-upload="beforeUpload"
            :on-success="uploadCover">
            <div class="el-upload__text" v-if="carouselForm.url == ''">将文件拖到此处，或<em>点击上传</em></div>
            <img v-else :src="carouselForm.url" width="360px" height="180px" />
          </el-upload>
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="carouselForm.sort"/>
        </el-form-item>
        <el-form-item label="状态">
          <el-switch
            v-model="carouselForm.status"
            active-text="启用"
            inactive-text="禁用"
            inactive-color="#ff0008"
            active-color="#36e31a"
            :active-value="1"
            :inactive-value="0" />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="addOrEdit = false">取 消</el-button>
        <el-button type="primary" @click="addOrEditCarousel"> 确 定 </el-button>
      </div>
    </el-dialog>


  </el-card>
</template>



<script>
import * as imageConversion from 'image-conversion'

export default {
  name: "Carousel",
  created() {
    this.current = this.$store.state.pageState.carousel
    this.listCarousels()
  },
  data(){
    return {
      isDelete: false,
      loading: true,
      addOrEdit: false,
      keywords: null,
      carousels: [],
      carouselIds: [],
      imgList:[],
      carouselForm: {
        id: null,
        url: '',
        sort: 0,
        status: 1
      },
      current: 1,
      size: 10,
      count: 0,
      headers: { Authorization: 'Bearer ' + sessionStorage.getItem('token') }
    }
  },
  methods: {
    getMax(){
      let max = 0
      if(this.carousels==null) return max;
      this.carousels.forEach(item => {
        if(item.sort>max) {
          max = item.sort
        }
      })
      return max
    },
    changeStatus(row){

    },
    selectionChange(carousels) {
      this.carouselIds = []
      carousels.forEach((item) => {
        this.carouselIds.push(item.id)
      })
    },
    sizeChange(size) {
      this.size = size
      this.listCarousels()
    },
    currentChange(current) {
      this.current = current
      this.$store.commit('updateCarouselPageState', current)
      this.listCarousels()
    },
    deleteModel(id) {
      var param = {}
      if (id == null) {
        param = { data: this.carouselIds }
      } else {
        param = { data: [id] }
      }

      this.axios.delete('/api/admin/carousels', param).then(({ data }) => {
        if (data.flag) {
          this.$notify.success({
            title: '成功',
            message: data.message
          })
          this.listCarousels()
        } else {
          this.$notify.error({
            title: '失败',
            message: data.message
          })
        }
      })
      this.isDelete = false
    },
    listCarousels() {
      this.axios
        .get('/api/admin/carousels', {
          params: {
            current: this.current,
            size: this.size,
            keywords: this.keywords
          }
        })
        .then(({ data }) => {
          this.carousels = data.data.records
          this.count = data.data.count
          this.carousels.forEach(item=>{
            this.imgList.push(item.url)
          })
          this.loading = false
        })
    },
    openModel(carousel) {
      if (carousel != null) {
        this.carouselForm = JSON.parse(JSON.stringify(carousel))
        this.$refs.carouselTitle.innerHTML = '修改轮播图'
      } else {
        this.carouselForm.id = null
        this.carouselForm.url = ''
        this.carouselForm.sort  = this.getMax() + 1
        this.carouselForm.status = 1
        this.$refs.carouselTitle.innerHTML = '添加轮播图'
      }
      this.addOrEdit = true
    },
    addOrEditCarousel() {
      if (this.carouselForm.url.trim() == '') {
        this.$message.error('请上传轮播图')
        return false
      }
      this.axios.post('/api/admin/carousels', this.carouselForm).then(({ data }) => {
        if (data.flag) {
          this.$notify.success({
            title: '成功',
            message: data.message
          })
          this.listCarousels()
        } else {
          this.$notify.error({
            title: '失败',
            message: data.message
          })
        }
      })
      this.addOrEdit = false
    },
    beforeUpload(file) {
      return new Promise((resolve) => {
        if (file.size / 1024 < this.config.UPLOAD_SIZE) {
          resolve(file)
        }
        imageConversion.compressAccurately(file, this.config.UPLOAD_SIZE).then((res) => {
          resolve(res)
        })
      })
    },
    uploadCover(response) {
      this.carouselForm.url = response.data
    }

  }
}
</script>

<style scoped>
.img-cover{
  width: 200px;
  color: #36e31a;
}
</style>