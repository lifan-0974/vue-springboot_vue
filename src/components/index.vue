<template >
  <el-container  style="height: 500px; border: 1px solid #eee">
    <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
      <el-menu router>
        <el-submenu v-for="(item,index) in $router.options.routes" :index="index+''"  v-if="item.show"	  :key="index" >
          <template slot="title"><i class="el-icon-message"></i>{{item.name}}</template>
          <el-menu-item v-for="(item2,index2) in item.children" :index="item2.path"   v-if="item2.show" :class="$route.path==item2.path?'is-active':''" :key="index2">{{item2.name}}</el-menu-item>
        </el-submenu>
      </el-menu>
    </el-aside>
      <el-main>

        <el-button class="out" type="danger"  @click="open">退出登录</el-button>
        <router-view></router-view>
      </el-main>
  </el-container>

</template>

<script>
  import axios from 'axios';
  import Cookies from "js-cookie";
  export default {
    methods: {
      open() {
        this.$confirm('您将退出登录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const _this = this
          axios.get('http://localhost:8001/loginout').then(function (resp) {
            _this.$message('退出登录!')
            Cookies.set('token', "") // 放置token到Cookie
            sessionStorage.setItem('user',"") // 保存用户到本地会话
            _this.$router.push('/login')
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      }
    }
  }
</script>

<style>
.out{
  margin-left: 1130px;
}
</style>
