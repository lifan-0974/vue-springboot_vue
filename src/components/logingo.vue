<template>

  <div  class="el-container" :style ="note">

    <el-form :model="loginForm" :rules="fieldRules" ref="loginForm" label-position="left" label-width="0px" class="demo-ruleForm login-container">
      <h3 class="title">红花油请假管理平台</h3>
      <el-form-item prop="username">
        <el-input type="text" v-model="loginForm.username" auto-complete="off" placeholder="账号"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input type="password" v-model="loginForm.password" auto-complete="off" placeholder="密码"></el-input>
      </el-form-item>
      <!-- <el-checkbox v-model="checked" checked class="remember">记住密码</el-checkbox> -->
      <el-form-item style="width:100%;">
        <el-button type="primary" style="width:47%;" @click.native.prevent="reset">重 置</el-button>
        <el-button type="primary" style="width:47%;" @click="login('loginForm')"  :loading="logining">登 录</el-button>
      </el-form-item>
    </el-form>

</div>


</template>

<script>
  import axios from 'axios';
  import Cookies from "js-cookie";
  export default {
    name: 'logingo',
    data() {
      return {
        note: {
          backgroundImage: "url(" + require("../assets/images/relative.png") + ")",
          backgroundSize: "1600px auto",
        },
        logining: false,
        loginForm: {
          username: 'admin',
          password: '123456'
        },
        fieldRules: {
          username: [
            { required: true, message: '请输入账号', trigger: 'blur' },
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
          ]
        },
        checked: true
      };
    },
    methods: {
      login(formName) {
        const _this = this
        this.$refs[formName].validate((valid) => {
          if (valid) {
            axios.post('http://localhost:8001/login',this.loginForm).then(function (resp) {
              console.log(resp.data.token)
              if (resp.data.success == true) {
                Cookies.set('token', resp.data.token) // 放置token到Cookie
                sessionStorage.setItem('user', _this.loginForm.username) // 保存用户到本地会话
                _this.$message('登录成功!')
                if (resp.data.data.people.pstatic == 0){
                  _this.$router.push('/LeaverAll')
                }else {
                  _this.$router.push(
                    {
                      path: '/LeaverAll',
                      query: {
                        pid: resp.data.data.people.pid
                      }
                    })

                }

              }else {
                _this.$message(resp.data.message)
              }
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });

      },
      reset() {
        this.$refs.loginForm.resetFields();
      }
    }
  }
</script>

<style lang="scss" scoped>
  .login-container {
    -webkit-border-radius: 5px;
    border-radius: 5px;
    -moz-border-radius: 5px;
    background-clip: padding-box;
    margin: 180px auto;
    width: 350px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
    .title {
      margin: 0px auto 40px auto;
      text-align: center;
      color: #505458;
    }
    .remember {
      margin: 0px 0px 35px 0px;
    }
    .el-container {
      padding: 0px;
      margin: 0px;
      height: 100%;

    }
  }
</style>
