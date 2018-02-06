  <template>
    <div class="changeWord">
      <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-width="100px" class="demo-ruleForm form_lable">
        <el-card class="line_top">
            <h3>用户修改密码</h3>
            <el-form-item label="原密码：" prop="oldpassword">
              <el-input type="password" v-model="ruleForm2.oldpassword" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="新密码：" prop="password">
              <el-input type="password" v-model="ruleForm2.password" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="确认密码：" prop="confirm">
              <el-input type="password" v-model="ruleForm2.confirm" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item class="pass_btn">
              <el-button type="primary" @click="submitForm('ruleForm2')">提交</el-button>
              <el-button @click="resetForm('ruleForm2')">重置</el-button>
            </el-form-item>
        </el-card>    
      </el-form>
    </div>
  </template>
<script>
 import { goldChangePassword } from '../api/api';
  export default {
    data() {
      var validateOldPass = (rule, value, callback) => {
          if (!value) {
            return callback(new Error('请输入原密码'));
          }else{
            callback();
          }
        };
      var validatePass = (rule, value, callback) => {
          if (value === '') {
            callback(new Error('请输入密码'));
          }else if(value === this.ruleForm2.oldpassword){
            callback(new Error('新密码不能设置与原密码相同'));
          }else {
            if (this.ruleForm2.confirm !== '') {
              this.$refs.ruleForm2.validateField('confirm');
            }
            callback();
          }
        };
        var validatePass2 = (rule, value, callback) => {
          if (value === '') {
            callback(new Error('请再次输入密码'));
          } else if (value !== this.ruleForm2.password) {
            callback(new Error('两次输入密码不一致!'));
          } else {
            callback();
          }
        };
      return {
        ruleForm2: {
              oldpassword:'',
              password: '',
              confirm: '',
            },
          rules2: {
           oldpassword: [
              { validator: validateOldPass, trigger: 'blur' }
            ],
            password: [
              { validator: validatePass, trigger: 'blur' }
            ],
            confirm: [
              { validator: validatePass2, trigger: 'blur' }
            ]
          }
        }
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let paras = {oldPwd:this.ruleForm2.oldpassword,newPwd:this.ruleForm2.password}
            goldChangePassword(paras).then(res => {
              let { msg, code, result } = res;
              if(code == 0){
                key_to_zero(this.ruleForm2);
                this.$message({
                    message: msg,
                    type: 'success',
                    duration:1000
                  });
                 this.$router.push({ path: '/login' });
              }else if(code!=0 && code!=105){
                this.$message({
                    message: msg,
                    type: 'error'
                  });
              }
            })
          } 
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
  }
   function key_to_zero(obj){
    for(let key in obj){
      obj[key] = ''
    }
  }
</script>
<style scoped lang="scss">
  .changeWord{
    .el-input{
      width: 100%;
    }
    .form_lable{
      /*max-width: 600px;*/
      padding-top: 50px;
      .pass_btn{
        margin-left: 100px;
      }
    }
    .line_top{
      border-top: 2px solid #00cdff;
    }
}
</style>