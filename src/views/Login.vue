<template>
  <div class="login_page">
    <div class="login_logo"><i></i><h2>佳兆业金服短信系统控制台</h2></div>
    <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-position="left" label-width="0px" class="demo-ruleForm login-container">
      <el-form-item prop="account">
        <el-input type="text" v-model="ruleForm2.account" auto-complete="off" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item prop="checkPass">
        <el-input type="password" v-model="ruleForm2.checkPass" auto-complete="off" placeholder="请输入密码"></el-input>
      </el-form-item>
      <el-form-item style="width:100%;">
        <el-button type="primary" style="width:100%;" @click.native.prevent="handleSubmit2" :loading="logining">立即登录</el-button>
        <!--<el-button @click.native.prevent="handleReset2">重置</el-button>-->
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import { goldLogin } from '../api/api';
  //import NProgress from 'nprogress'
  export default {
    data() {
      return {
        logining: false,
        ruleForm2: {
          account: '',
          checkPass: ''
        },
        rules2: {
          account: [
            { required: true, message: '请输入账号', trigger: 'blur' },
            //{ validator: validaePass }
          ],
          checkPass: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            //{ validator: validaePass2 }
          ]
        },
        checked: true
      };
    },
    methods: {
      handleReset2() {
        this.$refs.ruleForm2.resetFields();
      },
      handleSubmit2(ev) {
        var _this = this;
        this.$refs.ruleForm2.validate((valid) => {
          if (valid) {
            //_this.$router.replace('/table');
            this.logining = true;
            //NProgress.start();
            var loginParams = { username: this.ruleForm2.account, password: this.ruleForm2.checkPass };
            goldLogin(loginParams).then(data => {
              this.logining = false;
              //NProgress.done();
              let { msg, code, result } = data;
              if (code == 0) {
                sessionStorage.setItem('goldUser', JSON.stringify(result));
                sessionStorage.setItem('goldUserList', JSON.stringify(result));
                this.$router.push({ path: '/' });
              } else {
                this.$message({
                  message: msg,
                  type: 'error'
                });
              }
            });
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      }
    },
    mounted(){
      let _this = this;
      document.onkeydown = function(ev){
        if(ev.keyCode==13){
          _this.handleSubmit2(ev);//按enter键进行登入
        }
      }
    }
  }

</script>

<style lang="scss" scoped>
.login_page{
    text-align: center;
    margin-top: 180px;
    .el-input{
      width: 100%;
    }
    h2{
      margin: 0 0 40px 10px;
      display: inline-block;
    }
    .login_logo i{
      display: inline-block;
      width: 30px;
      height: 30px;
      background: url(../../static/login.jpg) center center no-repeat;
      background-size: cover;
      vertical-align: top;
    }
  }
  .login-container {
    /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
    -webkit-border-radius: 5px;
    border-radius: 5px;
    text-align: left;
    -moz-border-radius: 5px;
    background-clip: padding-box;
    margin:0px auto;
    width: 350px;
    padding: 50px 35px 35px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    /*box-shadow: 0 0 25px #cac6c6;*/
    .title {
      margin: 0px auto 40px auto;
      text-align: center;
      color: #505458;
    }
    .remember {
      margin: 0px 0px 35px 0px;
    }
  }
</style>