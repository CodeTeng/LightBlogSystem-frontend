<template>
  <el-card class="main-card">
    <div class="title">{{titleTab}}</div>
    <div class="article-title-container">
      <el-input v-model="article.articleTitle" size="medium" placeholder="输入文章标题" />
      <el-button
        type="danger"
        size="medium"
        class="save-btn"
        @click="saveArticleDraft"
        v-if="article.id == null || article.status == 3">
        保存草稿
      </el-button>
      <el-button type="danger" size="medium" @click="openModel" style="margin-left: 10px"> 发布文章 </el-button>
    </div>
    <mavon-editor ref="md" v-model="article.articleContent" @imgAdd="uploadImg" style="height: calc(100vh - 170px)" />

    <!--  编辑弹出框  -->
    <el-dialog v-model="addOrEdit" width="40%"  title="发布文章">
      <el-form label-width="80px" size="medium" v-model="article">
        <el-form-item label="文章分类">
          <el-tag
            type="success"
            v-show="article.categoryName"
            style="margin: 0 1rem 0 0"
            :closable="true"
            @close="removeCategory">
            {{ article.categoryName }}
          </el-tag>
          <el-popover placement="bottom-start" :width="460" trigger="click" v-if="article.categoryName===''||article.categoryName==null" >
            <template #reference>
              <el-button type="success" plain size="small"  class="w-52 h-8"> 添加分类 </el-button>
            </template>
            <div class="popover-title">分类</div>
            <el-autocomplete
              style="width: 100%"
              v-model="categoryName"
              :fetch-suggestions="searchCategories"
              placeholder="请输入分类名搜索，enter可添加自定义分类"
              :trigger-on-focus="false"
              @keyup.enter.native="saveCategory"
              @select="handleSelectCategories">
              <template #default="{ item }">
                <div>{{ item.categoryName }}</div>
              </template>
            </el-autocomplete>
            <div class="popover-container">
              <div v-for="item of categorys" :key="item.id" class="category-item" @click="addCategory(item)">
                {{ item.categoryName }}
              </div>
            </div>
          </el-popover>
        </el-form-item>
        <el-form-item label="文章标签">
          <el-tag
            v-for="(item, index) of article.tagNames"
            :key="index"
            style="margin: 0 1rem 0 0"
            :closable="true"
            @close="removeTag(item)">
            {{ item }}
          </el-tag>
          <el-popover placement="bottom-start" :width="460" trigger="click" v-if="article.tagNames.length < 3||article.tagNames==[] ">
            <template #reference>
              <el-button type="primary" plain class="w-52 h-8" size="small"> 添加标签 </el-button>
            </template>
            <div class="popover-title">标签</div>
            <el-autocomplete
              style="width: 100%"
              v-model="tagName"
              :fetch-suggestions="searchTags"
              placeholder="请输入标签名搜索，enter可添加自定义标签"
              :trigger-on-focus="false"
              @keyup.enter.native="saveTag"
              @select="handleSelectTag">
              <template #default="{ item }">
                <div>{{ item.tagName }}</div>
              </template>
            </el-autocomplete>
            <div class="popover-container">
              <div style="margin-bottom: 1rem">添加标签</div>
              <el-tag v-for="(item, index) of tagList" :key="index" :class="tagClass(item)" @click="addTag(item)">
                {{ item.tagName }}
              </el-tag>
            </div>
          </el-popover>
        </el-form-item>
        <el-form-item label="文章类型">
          <el-select v-model="article.type" placeholder="请选择类型">
            <el-option v-for="item in typeList" :key="item.type" :label="item.desc" :value="item.type" />
          </el-select>
        </el-form-item>
        <el-form-item label="原文地址" v-if="article.type != 1">
          <el-input v-model="article.originalUrl" placeholder="请填写原文链接" />
        </el-form-item>
        <el-form-item label="上传封面">
          <el-upload
            class="upload-cover"
            drag
            action="/api/articles/images"
            multiple
            :headers="headers"
            :show-file-list="false"
            :before-upload="beforeUpload"
            :on-success="uploadCover">
            <div class="el-upload__text" v-if="article.articleCover == ''">将文件拖到此处，或<em>点击上传</em></div>
            <img v-else :src="article.articleCover" class="img-main" />
          </el-upload>
        </el-form-item>
        <el-form-item label="置顶">
          <el-switch
            v-model="article.isTop"
            active-color="#13ce66"
            inactive-color="#F4F4F5"
            :active-value="1"
            :inactive-value="0" />
        </el-form-item>
        <el-form-item label="推荐">
          <el-switch
            v-model="article.isFeatured"
            active-color="#13ce66"
            inactive-color="#F4F4F5"
            :active-value="1"
            :inactive-value="0" />
        </el-form-item>
        <el-form-item label="发布形式">
          <el-radio-group v-model="article.status">
            <el-radio :label="1">公开</el-radio>
            <el-radio :label="2">密码</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="访问密码" v-if="article.status == 2">
          <el-input v-model="article.password" placeholder="请填写文章访问密码" />
        </el-form-item>
        <el-form-item label="文章摘要">
          <el-input type="textarea" autosize="true" v-model="article.articleAbstract" placeholder="默认取文章前500个字符" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="addOrEdit = false" class="w-40">取 消</el-button>
        <el-button type="danger"   class="w-40" @click="saveOrUpdateArticle"> 发 表 </el-button>
      </template>
    </el-dialog>
  </el-card>
</template>

<script>
import * as imageConversion from 'image-conversion'
import { mavonEditor } from 'mavon-editor';
import "mavon-editor/dist/css/index.css";
import api from '@/api/api'
import { ElMessage } from 'element-plus'
export default {
  name: "ArticleEdit",
  components:{mavonEditor,ElMessage},
  created() {
    const articleId = this.$route.query.articleId
    if (articleId) {
      api.getArticleById(articleId).then(({ data }) => {
        this.article = data.data
      })
    } else {
      const article = sessionStorage.getItem('article')
      if (article) {
        this.article = JSON.parse(article)
      }
    }
  },
  data () {
    return {
      addOrEdit: false,
      autoSave: true,
      categoryName: null,
      tagName: '',
      categorys: [],
      tagList: [],
      typeList: [
        {
          type: 1,
          desc: '原创'
        },
        {
          type: 2,
          desc: '转载'
        },
        {
          type: 3,
          desc: '翻译'
        }
      ],
      article: {
        id: null,
        articleTitle: this.getCurrentDate(),
        articleContent: '',
        articleAbstract: '',
        articleCover: '',
        categoryName: '',
        tagNames: [],
        isTop: 0,
        type: 1,
        status: 1
      },
      headers: { Authorization: 'Bearer ' + sessionStorage.getItem('token') }
    }
  },
  methods: {
    clearTable(){
      if(this.$route.query.articleId==null){
        this.article.articleTitle = this.getCurrentDate()
        this.article.articleContent = ''
        this.article.articleAbstract = ''
        this.article.articleCover = ''
        this.article.tagNames = []
        this.article.categoryName = ''
        this.article.status = 1
        this.article.isTop = 0
        this.article.type= 1
        this.article.id = null
      }
    },
    getCurrentDate() {
      let now = new Date();
      let year = now.getFullYear();
      let month = now.getMonth() + 1;
      let day = now.getDate();
      return year + "-" + month + "-" + day;
    },
    listCategories() {
      api.listCategoriesBySearch(null).then(({ data }) => {
        this.categorys = data.data
      })
    },
    listTags() {
      api.listTagsBySearch(null).then(({ data }) => {
        this.tagList = data.data
      })
    },
    openModel() {
      if (this.article.articleTitle.trim() == '') {
        ElMessage({
          message: '文章标题不能为空！',
          type: 'warning'
        });
        return false
      }
      if (this.article.articleContent.trim() == '') {
        ElMessage({
          message: '文章内容不能为空！',
          type: 'warning'
        });
        return false
      }
      this.listCategories()
      this.listTags()
      this.addOrEdit = true
    },
    uploadCover(response) {
      this.article.articleCover = response.data
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
    uploadImg(pos, file) {
      var formdata = new FormData()
      if (file.size / 1024 < 200) {
        formdata.append('file', file)
        api.uploadArticleImages(formdata).then(({ data }) => {
          this.$refs.md.$img2Url(pos, data.data)
        })
      } else {
        imageConversion.compressAccurately(file, this.config.UPLOAD_SIZE).then((res) => {
          formdata.append('file', new window.File([res], file.name, { type: file.type }))
          api.uploadArticleImages(formdata).then(({ data }) => {
            this.$refs.md.$img2Url(pos, data.data)
          })
        })
      }
    },
    saveArticleDraft() {
      if (this.article.articleTitle.trim() == '') {
        ElMessage({
          message: '文章标题不能为空！',
          type: 'warning'
        });
        return false
      }
      if (this.article.articleContent.trim() == '') {
        ElMessage({
          message: '文章内容不能为空！',
          type: 'warning'
        });
        return false
      }
      this.article.status = 3
      api.saveOrUpdateArticle(this.article).then(({ data }) => {
        if (data.flag) {
          this.$notify.success({
            title: '成功',
            message: '保存草稿成功'
          })
          this.clearTable()
        } else {
          this.$notify.error({
            title: '失败',
            message: '保存草稿失败'
          })
        }
      })
      this.autoSave = false
    },
    saveOrUpdateArticle() {
      if (this.article.articleTitle.trim() == '') {
        ElMessage({
          message: '文章标题不能为空！',
          type: 'warning'
        });
        return false
      }
      if (this.article.articleContent.trim() == '') {
        ElMessage({
          message: '文章内容不能为空！',
          type: 'warning'
        });
        return false
      }
      if (this.article.categoryName == null || this.article.categoryName.trim() === '') {
        ElMessage({
          message: '文章分类不能为空！',
          type: 'warning'
        });
        return false
      }
      if (this.article.tagNames.length == 0) {
        ElMessage({
          message: '文章标签不能为空！',
          type: 'warning'
        });
        return false
      }
      if (this.article.articleCover.trim() == '') {
        ElMessage({
          message: '文章封面不能为空！',
          type: 'warning'
        });
        return false
      }

      api.saveOrUpdateArticle(this.article).then(({ data }) => {
        if (data.flag) {
          this.$notify.success({
            title: '成功',
            message: data.message
          })
          this.clearTable()
        } else {
          this.$notify.error({
            title: '失败',
            message: data.message
          })
        }
        this.addOrEdit = false
      })
      this.autoSave = false
    },
    autoSaveArticle() {
      if (
        this.autoSave &&
        this.article.articleTitle.trim() != '' &&
        this.article.articleContent.trim() != '' &&
        this.article.id != null
      ) {
        api.saveOrUpdateArticle( this.article).then(({ data }) => {
          if (data.flag) {
            this.$notify.success({
              title: '成功',
              message: '自动保存成功'
            })
          } else {
            this.$notify.error({
              title: '失败',
              message: '自动保存失败'
            })
          }
        })
      }
      if (this.autoSave && this.article.id == null) {
        sessionStorage.setItem('article', JSON.stringify(this.article))
      }
    },
    searchCategories(keywords, cb) {

      api.listCategoriesBySearch({
        params: {
          keywords: keywords
        }
      })
        .then(({ data }) => {
          cb(data.data)
        })
    },
    handleSelectCategories(item) {
      this.addCategory({
        categoryName: item.categoryName
      })
    },
    saveCategory() {
      if (this.categoryName.trim() != '') {
        this.addCategory({
          categoryName: this.categoryName
        })
        this.categoryName = ''
      }
    },
    addCategory(item) {
      this.article.categoryName = item.categoryName
    },
    removeCategory() {
      this.article.categoryName = null
    },
    searchTags(keywords, cb) {
      api.listTagsBySearch({
        params: {
          keywords: keywords
        }
      })
        .then(({ data }) => {
          cb(data.data)
        })
    },
    handleSelectTag(item) {
      this.addTag({
        tagName: item.tagName
      })
    },
    saveTag() {
      if (this.tagName.trim() != '') {
        this.addTag({
          tagName: this.tagName
        })
        this.tagName = ''
      }
    },
    addTag(item) {
      if (this.article.tagNames.indexOf(item.tagName) == -1) {
        this.article.tagNames.push(item.tagName)
      }
    },
    removeTag(item) {
      const index = this.article.tagNames.indexOf(item)
      this.article.tagNames.splice(index, 1)
    }
  },
  computed: {
    tagClass() {
      return function (item) {
        const index = this.article.tagNames.indexOf(item.tagName)
        return index != -1 ? 'tag-item-select' : 'tag-item'
      }
    },
    titleTab(){
      return this.$route.query.articleId==null?"发布文章":"编辑文章"
    }
  }
}
</script>

<style scoped>
.article-title-container {
  display: flex;
  align-items: center;
  margin-bottom: 1.25rem;
  margin-top: 2.25rem;
}
.save-btn {
  margin-left: 0.75rem;
  background: #fff;
  color: #f56c6c;
}
.tag-item {
  margin-right: 1rem;
  margin-bottom: 1rem;
  cursor: pointer;
}
.tag-item-select {
  margin-right: 1rem;
  margin-bottom: 1rem;
  cursor: not-allowed;
  color: #ccccd8 !important;
}
.category-item {
  cursor: pointer;
  padding: 0.6rem 0.5rem;
}
.category-item:hover {
  background-color: #f0f9eb;
  color: #67c23a;
}
.popover-title {
  margin-bottom: 1rem;
  text-align: center;
}
.popover-container {
  margin-top: 1rem;
  height: 260px;
  overflow-y: auto;
}
.img-main{
  width: 200px;
  max-height: 360px;
}
</style>
