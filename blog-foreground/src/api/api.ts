import axios from 'axios'
import {Ref} from 'vue'
export default {
  getUserForegroundInfo:(userId:any)=>{
    return axios.get("/api/users/foreground/"+userId)
  },
  // 上传图片
  uploadArticleImages:(fileData:FormData)=>{
    return axios.post('/api/articles/images',fileData)
  },
  // 保存或修改说说
  saveOrUpdateTalk:(data:any)=>{
    return axios.post('/api/talks',data)
  },
  // 获得登录用户对文章的评分
  getArticleScore:(articleId: any)=>{
    return axios.get('/api/articles/score/'+articleId)
  },
  // 添加用户对文章的评分
  setArticleScore:(data:any)=>{
    return axios.post('/api/articles/score',data)
  },
  // 获得用户展示框的信息
  getUserShowById: (id: any) => {
    return axios.get("/api/users/show/"+id)
  },
  // 获得所有的轮播图
  getAllCarousels: ()=>{
    return axios.get('/api/carousels/all')
  },
  getTopAndFeaturedArticles: () => {
    return axios.get('/api/articles/topAndFeatured')
  },
  getArticles: (params: any) => {
    return axios.get('/api/articles/all', { params: params })
  },
  getArticlesByCategoryId: (params: any) => {
    return axios.get('/api/articles/categoryId', { params: params })
  },
  // 保存或更新文章
  saveOrUpdateArticle: (data: any) => {
    return axios.post('/api/articles',data)
  },
  getTopArticleByUserId: (id: any) => {
    return axios.get(`/api/articles/top`, {params: {userId: id}})
  },
  getArticleById: (articleId: any) => {
    return axios.get('/api/articles/' + articleId)
  },
  // 获得文章编辑的信息
  getArticleEditById: (articleId: any) => {
    return axios.get('/api/articles/edit/' + articleId)
  },
  getAllCategories: () => {
    return axios.get('/api/categories/all')
  },
  // 查询分类
  listCategoriesBySearch: (params: any) => {
    return axios.get('/api/categories/search', { params: params })
  },
  getAllTags: () => {
    return axios.get('/api/tags/all')
  },
  getTopTenTags: () => {
    return axios.get('/api/tags/topTen')
  },
  // 条件查询标签列表
  listTagsBySearch:(params: any) => {
    return axios.get('/api/tags/search', { params: params })
  },
  getArticlesByTagId: (params: any) => {
    return axios.get('/api/articles/tagId', { params: params })
  },
  listArticlesByUserId: (params: any) => {
    return axios.get('/api/articles/list/'+params.userId, { params: params })
  },
  getAllArchives: (params: any) => {
    return axios.get('/api/archives/all', { params: params })
  },
  login: (params: any) => {
    return axios.post('/api/users/login', params)
  },
  saveComment: (params: any) => {
    return axios.post('/api/comments/save', params)
  },
  getComments: (params: any) => {
    return axios.get('/api/comments', { params: params })
  },
  getTopSixComments: () => {
    return axios.get('/api/comments/topSix')
  },
  getAbout: () => {
    return axios.get('/api/about')
  },
  getFriendLink: () => {
    return axios.get('/api/links')
  },
  submitUserInfo: (params: any) => {
    return axios.put('/api/users/info', params)
  },
  getUserInfoById: (id: any) => {
    return axios.get('/api/users/info/' + id)
  },
  updateUserSubscribe: (params: any) => {
    return axios.put('/api/users/subscribe', params)
  },
  sendValidationCode: (username: any) => {
    return axios.get('/api/users/code', {
      params: {
        username: username
      }
    })
  },
  bindingEmail: (params: any) => {
    return axios.put('/api/users/email', params)
  },
  register: (params: any) => {
    return axios.post('/api/users/register', params)
  },
  searchArticles: (params: any) => {
    return axios.get('/api/articles/search', {
      params: params
    })
  },
  getAlbums: (params: any) => {
    return axios.get('/api/photos/albums',{params: params})
  },
  getPhotosBuAlbumId: (albumId: any, params: any) => {
    return axios.get('/api/albums/' + albumId + '/photos', {
      params: params
    })
  },
  getWebsiteConfig: () => {
    return axios.get('/api')
  },
  qqLogin: (params: any) => {
    return axios.post('/api/users/oauth/qq', params)
  },
  report: () => {
    axios.post('/api/report')
  },
  getTalks: (params: any) => {
    return axios.get('/api/talks', {
      params: params
    })
  },
  getTalkById: (id: any) => {
    return axios.get('/api/talks/' + id)
  },
  // 获得用户的说说
  getUserTalksById: (params: any) => {
    return axios.get('/api/talks/list',{params:params})
  },
  logout: () => {
    return axios.post('/api/users/logout')
  },
  getRepliesByCommentId: (commentId: any) => {
    return axios.get(`/api/comments/${commentId}/replies`)
  },
  updatePassword: (params: any) => {
    return axios.put('/api/users/password', params)
  },
  accessArticle: (params: any) => {
    return axios.post('/api/articles/access', params)
  },
  query: (params: any) => {
    return axios.get(`/api/smartAi/query?queryMessage=${params}`)
  }
}
