<template>
  <el-card class="main-card">
    <div class="title">{{ this.$route.name }}</div>
    <div class="operation-container">
      <el-button type="primary" size="small" icon="el-icon-plus" @click="openAddModel(null)"> 新增 </el-button>

      <div style="margin-left: auto">
        <el-select clearable v-model="loginType" placeholder="请选择登录方式" size="small" style="margin-right: 1rem">
          <el-option v-for="item in typeList" :key="item.type" :label="item.desc" :value="item.type" />
        </el-select>
        <el-input
          v-model="keywords"
          prefix-icon="el-icon-search"
          size="small"
          placeholder="请输入昵称"
          style="width: 200px"
          @keyup.enter.native="searchUsers" />
        <el-button type="primary" size="small" icon="el-icon-search" style="margin-left: 1rem" @click="searchUsers">
          搜索
        </el-button>
      </div>
    </div>
    <el-table border :data="userList" v-loading="loading">
      <el-table-column prop="linkAvatar" label="头像" align="center" width="100">
        <template slot-scope="scope">
          <img :src="scope.row.avatar" width="40" height="40" />
        </template>
      </el-table-column>
      <el-table-column prop="nickname" label="昵称" align="center" width="140" />
      <el-table-column prop="userAge" label="年龄" align="center" width="50" />
      <el-table-column prop="userGender" label="性别" align="center" width="60" >
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.userGender === 0">男生</el-tag>
          <el-tag type="danger" v-if="scope.row.userGender === 1">女生</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="loginType" label="登录方式" align="center" width="80">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.loginType === 1">邮箱</el-tag>
          <el-tag v-if="scope.row.loginType === 2">QQ</el-tag>
          <el-tag type="danger" v-if="scope.row.loginType === 3">微博</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="roles" label="用户角色" align="center">
        <template slot-scope="scope">
          <el-tag v-for="(item, index) of scope.row.roles" :key="index" style="margin-right: 4px; margin-top: 4px">
            {{ item.roleName }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="isDisable" label="禁用" align="center" width="100">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.isDisable"
            active-color="#13ce66"
            inactive-color="#F4F4F5"
            :active-value="1"
            :inactive-value="0"
            @change="changeDisable(scope.row)" />
        </template>
      </el-table-column>
      <el-table-column prop="ipAddress" label="登录ip" align="center" width="140" />
      <el-table-column prop="ipSource" label="登录地址" align="center" width="140" />
      <el-table-column prop="createTime" label="创建时间" width="130" align="center">
        <template slot-scope="scope">
          <i class="el-icon-time" style="margin-right: 5px" />
          {{ scope.row.createTime | date }}
        </template>
      </el-table-column>
      <el-table-column prop="lastLoginTime" label="上次登录时间" width="130" align="center">
        <template slot-scope="scope">
          <i class="el-icon-time" style="margin-right: 5px" />
          {{ scope.row.lastLoginTime | date }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="200">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="openEditModel(scope.row)"> 编辑</el-button>
          <el-popconfirm
            title="确定删除吗？"
            style="margin-left: 10px"
            @confirm="deleteUserRole(scope.row.userInfoId)"
          >
            <el-button size="mini" type="danger" slot="reference"> 删除</el-button>
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
    <!-- 修改用户 -->
    <el-dialog :visible.sync="isEdit" width="30%">
      <div class="dialog-title-container" slot="title">修改用户</div>
      <el-form label-width="60px" size="medium" :model="userForm">
        <el-form-item label="昵称">
          <el-input v-model="userForm.nickname" style="width: 220px" />
        </el-form-item>
        <el-form-item  label="性别" prop="userGender">
          <el-select v-model="userForm.userGender">
            <el-option label="男" :value=0 />
            <el-option label="女" :value=1 />
          </el-select>
        </el-form-item>
        <el-form-item  label="年龄" prop="userAge">
          <el-input v-model="userForm.userAge" type="number" placeholder="年龄" />
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="roleIds" multiple>
            <el-option
              v-for="item in userRoles"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="isEdit = false">取 消</el-button>
        <el-button type="primary" @click="editUserRole"> 确 定</el-button>
      </div>
    </el-dialog>
    <!-- 添加用户 -->
    <el-dialog :visible.sync="addUserDialogVisible"   width="30%" >
      <div class="dialog-title-container" slot="title">添加用户</div>
      <el-form label-width="80px" size="medium" :model="addUserForm" :rules="registerRules" ref="registerForm">
        <el-form-item  label="邮箱" prop="username">
          <el-input v-model="addUserForm.username" placeholder="邮箱" />
        </el-form-item>
        <el-form-item  label="密码" prop="password">
          <el-input v-model="addUserForm.password" type="password" show-password placeholder="密码" />
        </el-form-item>
        <el-form-item  label="性别" prop="userGender">
          <el-select v-model="addUserForm.userGender">
            <el-option label="男" :value=0 />
            <el-option label="女" :value=1 />
          </el-select>
        </el-form-item>
        <el-form-item  label="年龄" prop="userAge">
          <el-input v-model="addUserForm.userAge" type="number" placeholder="年龄" />
        </el-form-item>
        <el-form-item  label="角色" prop="userGender">
          <el-select v-model="addUserForm.roleIds" multiple>
            <el-option
              v-for="item in userRoles"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="addUserDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUserClick('registerForm')"> 确 定 </el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
import { ref } from 'vue'

export default {
  created() {
    this.current = this.$store.state.pageState.user
    this.listUsers()
    this.listRoles()
  },
  data: function() {
    return {
      loading: true,
      isEdit: false,
      userForm: {
        userInfoId: null,
        roleIds: [],
        nickname: '',
        userAge: null,
        userGender: null
      },
      addUserForm:{
        username: '',
        password: '',
        userAge: '',
        userGender : 0,
        roleIds: []
      },
      registerRules:{
        username:[{ required: true, message: '不能为空', trigger: 'blur' }],
        password:[{ required: true, message: '不能为空', trigger: 'blur' }],
        userAge:[{ required: true, message: '不能为空', trigger: 'blur' }],
        userGender:[{ required: true, message: '不能为空', trigger: 'blur' }],
        roleIds:[{ required: true, message: '不能为空', trigger: 'blur' }]

      },
      loginType: null,
      userRoles: [],
      roleIds: [],
      userList: [],
      typeList: [
        {
          type: 1,
          desc: '邮箱'
        },
        {
          type: 2,
          desc: 'QQ'
        }
      ],
      keywords: null,
      current: 1,
      size: 10,
      count: 0,
      addUserDialogVisible: false
    }
  },
  methods: {
    searchUsers() {
      this.current = 1
      this.listUsers()
    },
    sizeChange(size) {
      this.size = size
      this.listUsers()
    },
    currentChange(current) {
      this.current = current
      this.$store.commit('updateUserPageState', current)
      this.listUsers()
    },
    changeDisable(user) {
      this.axios.put('/api/admin/users/disable', {
        id: user.userInfoId,
        isDisable: user.isDisable
      })
    },
    openAddModel(user){
        this.addUserDialogVisible = true;
    },
    addUserClick(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let params = {
            username: this.addUserForm.username,
            password: this.addUserForm.password,
            userAge: this.addUserForm.userAge,
            userGender : this.addUserForm.userGender,
            roleIds: this.addUserForm.roleIds
          }
          this.axios
            .post('/api/admin/users/role', params)
            .then(({data})=>{
              if (data.flag) {
                this.$notify.success({
                  title: '成功',
                  message: data.message,
                })
                this.listUsers()
                this.addUserForm = Object.assign(this.addUserForm, this.$options.data().addUserForm)
                this.addUserDialogVisible = false
              }else{
                this.$notify.error({
                  title: '失败',
                  message: data.message,
                })
              }
            })
          this.addUserDialogVisible = false;

        } else {
          return false;
        }
      });

    },
    openEditModel(user) {
      this.userForm = JSON.parse(JSON.stringify(user))
      this.userForm.roles.forEach((item) => {
        this.roleIds.push(item.id)
      })
      this.isEdit = true
    },
    editUserRole() {
      this.userForm.roleIds = this.roleIds
      this.axios.put('/api/admin/users/role', this.userForm).then(({ data }) => {
        if (data.flag) {
          this.$notify.success({
            title: '成功',
            message: data.message
          })
          this.listUsers()
        } else {
          this.$notify.error({
            title: '失败',
            message: data.message
          })
        }
        this.isEdit = false
      })
    },
    deleteUserRole(id) {
      console.log(id)
      this.axios.delete('/api/admin/users/delete/' + id).then(({ data }) => {
        if (data.flag) {
          this.$notify.success({
            title: '删除成功',
            message: data.message
          })
          this.listUsers()
        } else {
          this.$notify.error({
            title: '删除失败',
            message: data.message
          })
        }
      })
    },
    listUsers() {
      this.axios
        .get('/api/admin/users', {
          params: {
            current: this.current,
            size: this.size,
            keywords: this.keywords,
            loginType: this.loginType
          }
        })
        .then(({ data }) => {
          this.userList = data.data.records
          console.log(this.userList)
          this.count = data.data.count
          this.loading = false
        })
    },
    listRoles() {
      this.axios.get('/api/admin/users/role').then(({ data }) => {
        this.userRoles = data.data
      })
    }
  },
  watch: {
    loginType() {
      this.current = 1
      this.listUsers()
    }
  }
}
</script>
