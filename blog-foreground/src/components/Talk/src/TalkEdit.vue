<template>
  <el-card class="main-block" shadow="always">
    <template #header>
      <div class="title">发布说说</div>
    </template>
    <div class="talk-container">
      <el-input
        v-model="contentValue"
        class="editor-wrapper"
        :rows="10"
        type="textarea"
        placeholder="说点什么吧"
      />
      <div class="operation-wrapper">
        <div class="right-wrapper">
<!--          <el-switch-->
<!--            style="margin-right: 16px"-->
<!--            v-model="isTopValue"-->
<!--            inactive-text="置顶"-->
<!--            :active-value="1"-->
<!--            :inactive-value="0" />-->
          <el-select
            v-model="statusValue"
            style="width: 100px;height: 50px"
            class="mr-4 bg-blue-50"
          >
            <el-option
              v-for="item in statuses"
              :key="item.status"
              :label="item.desc"
              :value="item.status"
            />
          </el-select>
          <el-button type="primary"  @click="saveOrUpdateTalk">
            发布
          </el-button>
        </div>
      </div>
      <el-upload
        class="talk-image-upload"
        action="/api/talks/images"
        list-type="picture-card"
        multiple
        :headers="headers"
        :file-list="uploads"
        :before-upload="beforeUpload"
        :on-success="upload"
        :on-remove="handleRemove"
      >
        <i class="el-icon-plus" />
      </el-upload>
    </div>
  </el-card>
</template>

<script>
import * as imageConversion from 'image-conversion'
import Editor from './Editor.vue'
import api from '@/api/api'
export default {
  name:'TalkEdit',
  components: {
    Editor
  },
  data() {
    return {
      talk: {
        id: null,
        content: '',
        isTop: 0,
        status: 1,
        images: ''
      },
      statuses: [
        { status: 1, desc: '公开' },
        { status: 2, desc: '私密' }
      ],
      uploads: [],
      headers: { Authorization: 'Bearer ' + sessionStorage.getItem('token') },
      contentValue:'',
      statusValue:1,
      isTopValue: 0,

    }
  },
  mounted() {
    this.initGetTalk()
  },
  methods: {
    handleRemove(file) {
      this.uploads.forEach((item, index) => {
        if (item.url == file.url) {
          this.uploads.splice(index, 1)
        }
      })
    },
    upload(response) {
      this.uploads.push({ url: response.data })
      this.uploads.forEach((item, index) => {
        if (item.response!=null) {
          this.uploads.splice(index, 1)
        }
      })
    },
    initGetTalk(){
      if (this.$route.query.talkId!=null) {
        api.getTalkById(this.$route.query.talkId).then(({ data }) => {
          console.log(data.data)
          this.talk.id = data.data.id
          this.contentValue = data.data.content
          this.talk.images = data.data.images
          this.statusValue = data.data.status==null?1:data.data.status
          this.isTopValue = data.data.isTop
          if (data.data.imgs) {
            data.data.imgs.forEach((item) => {
              this.uploads.push({ url: item })
            })
          }
        })
      }
    },
    beforeUpload(file) {
      return new Promise((resolve) => {
        if (file.size / 1024 < 200) {
          resolve(file)
        }
        imageConversion.compressAccurately(file, 200).then((res) => {
          resolve(res)
        })
      })
    },
    saveOrUpdateTalk() {
      this.talk.content = this.contentValue
      this.talk.status =this.statusValue
      this.talk.isTopValue = this.isTopValue
      if (this.talk.content.trim() === '') {
        this.$notify.error('说说内容不能为空')
        return false
      }
      if (this.uploads.length > 0) {
        var img = []
        this.uploads.forEach((item) => {
          img.push(item.url)
        })
        this.talk.images = JSON.stringify(img)
      } else {
        this.talk.images = ''
      }
      api.saveOrUpdateTalk(this.talk).then(({ data }) => {
        if (data.flag) {
          this.uploads = []
          this.contentValue = ''
          this.$notify.success({
            title: '成功',
            message: data.message
          })
        } else {
          this.$notify.error({
            title: '失败',
            message: data.message
          })
        }
      })
    }
  },
}
</script>

<style scoped>
.tupian {
  margin-left: 3px;
}
.talk-container {
  margin-top: 0;
}
.editor-wrapper {
  min-height: 200px;
}
.operation-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
}
.operation-btn {
  cursor: pointer;
  color: #838383;
  font-size: 20px;
  margin-right: 12px;
}
.talk-status {
  cursor: pointer;
  font-size: 12px;
  color: #999;
}
.emoji {
  user-select: none;
  margin: 0.25rem;
  display: inline-block;
  vertical-align: middle;
}
.emoji-item {
  cursor: pointer;
  display: inline-block;
}
.emoji-item:hover {
  transition: all 0.2s;
  border-radius: 0.25rem;
  background: #dddddd;
}
.left-wrapper {
  display: flex;
  width: 50%;
}
.talk-image-upload {
  margin-top: 8px;
}
</style>
