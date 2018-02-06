<template>
	<div class="">
		<el-form class="user-form" label-width="170px"
			:model="form" ref="form" :rules="rules2" :show-message="true">
      <div class="section-title">基本信息</div>
			<el-form-item label="用户名" prop="name">
				<el-input v-model="form.name" placeholder="请输入用户名">
				</el-input>
			</el-form-item>
			<el-form-item label="公司名称" prop="company_name">
				<el-input v-model="form.company_name" placeholder="请输入公司名称">
				</el-input>
			</el-form-item>
			<el-form-item label="营业执照号码" prop="buniss_no">
				<el-input v-model="form.buniss_no" :maxlength="24" placeholder="请输入营业执照号码">
				</el-input>
			</el-form-item>
			<el-form-item label="联系人姓名" prop="true_name">
				<el-input v-model="form.true_name" placeholder="请输入联系人姓名">
				</el-input>
			</el-form-item>
			<el-form-item label="联系人身份证" prop="card">
				<el-input v-model="form.card" placeholder="请输入联系人身份证号">
				</el-input>
			</el-form-item>
			<el-form-item label="联系人手机号" prop="mobile">
				<el-input v-model="form.mobile" placeholder="请输入联系人手机号">
				</el-input>
			</el-form-item>
      <div class="section-title">流控规则<span class="desc">（只对通知通道有效）</span></div>
			<el-form-item label="单一号码发送间隔" prop="spacing">
				<el-input v-model="form.spacing">
				</el-input>
        <span>s</span>
			</el-form-item>
			<el-form-item label="单一号码10分钟最大条数" prop="minutMax">
				<el-input v-model="form.minutMax">
				</el-input>
        <span>条</span>
			</el-form-item>
			<el-form-item label="单一号码1小时最大条数" prop="hoursMax">
				<el-input v-model="form.hoursMax">
				</el-input>
        <span>条</span>
			</el-form-item>
			<el-form-item label="单一号码1天最大条数" prop="dayMax">
				<el-input v-model="form.dayMax">
				</el-input>
        <span>条</span>
      </el-form-item>
      <div class="section-title">签名信息</div>
			<el-form-item label="添加签名" prop="inputSignature">
				<el-autocomplete v-model="form.inputSignature" icon="search"
          :fetch-suggestions="querySearchSignature"
          @select="handleSelectSignature">
				</el-autocomplete>
        <el-button type="primary" size="small" @click="handleAddSignature" :disabled="!selectSignature">添加</el-button>
      </el-form-item>
      <div class="signature" :key="item.id" v-for="(item, index) in form.signatures">
        <div class="signature-header">
          <span class="signature-title">签名{{index + 1}}：{{item.name}}</span>
          <span class="signature-remove" @click="removeItem(index)">x</span>
        </div>
        <div class="signature-content">
          <div class="content-title">请选择绑定的通道</div>
          <div class="channel-list">
            <div class="channel" :key="channel.id" v-for="(channel,index) in item.channels">
              <el-checkbox class="channel-check" v-model="channel.checked">{{channel.channelName}}-{{channel.name}}</el-checkbox>
              <span class="weight-title">权重</span>
              <el-form v-if="channel.edit" class="channel-form addUserpage" :inline="true"
                :model="channel" :show-message="true" :rules="rules" ref="channel">
                <el-form-item style="width:130px;" prop="weight">
                  <el-input size="mini" v-model="channel.weight"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" size="mini" @click="handleSubmitChannel(channel)">修改</el-button>
                  <el-button size="mini" @click="cancelChangeWeight(channel,index)">取消</el-button>
                </el-form-item>
              </el-form>
              <div v-else class="channel-weight">
                <span>{{channel.weight}}</span>
                <span class="btn-icon" @click="handleEditChannel(channel,index)"><i class="fa fa-pencil"></i></span>
                <span class="btn-text spanDefault" v-if="channel.defaultUse">已为默认</span>
                <span :class="channel.defaultClass" class="btn-text" @click="setDefault(item.channels,index)" v-else>设为默认</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-form>
    <div class="user-form-btns">
      <el-button type="primary" @click="handleSubmit('form')">保存</el-button>
      <el-button @click="handleCancel">取消</el-button>
    </div>
    <div class="pwordTips">注：保存成功后，用户登录密码默认为changeit。</div>
	</div>
</template>



<script>
import '../../styles/user.scss'
import axios from 'axios'
import { inputBlurSearch,accurateSearch,modifyWeight,addUserInterfaces,usernameOnly } from '../../api/api';
export default {
  name: 'user-form',
  props: {
    id: {
      type: String,
      required: false
    }
  },
	data () {
    /*权重校验*/
    var validateWeight = (rule, value, callback) => {
      var reg = /^[1-9][0-9]{0,2}$/;
      if(!reg.test(value)){
        callback(new Error('请输入1-999之间的整数'));
      }else{
        callback();
      }
    };
    var validateUserName = (rule, value, callback) => {
      if (!value) {
         callback(new Error('用户名不能为空'));
      }else if(value.length>20){
         callback(new Error('用户名应小于等于20个字符'));
      }else{
         usernameOnly({userName:value}).then( res => {
            let {data} = res;
            if(data.code == 103){
              callback(new Error(data.msg));
            }else{
              callback();
            }
        })
      } 
    };
    var validateCompanyName = (rule, value, callback) => {
      if(!value){
        callback(new Error('公司名称不能为空'));
      }else if(value.length>50){
        callback(new Error('公司名称应小于等于50个字符'));
      }else{
        callback();
      }
    }
    var validateTrueName = (rule, value, callback) => {
      if(!value){
        callback(new Error('联系人姓名不能为空'));
      }else if(value.length>10){
        callback(new Error('联系人姓名应小于等于10个字符'));
      }else{
        callback();
      }
    }
    /*营业执照校验*/
    var validateLicense = (rule, value, callback) => {
      /*let reg = /^\d{15}$|^\d{18}$/;*/
      let reg = /^\d+$|^[0-9a-zA-Z]+$|^[a-zA-Z]+$/;
      if (!value) {
         callback(new Error('营业执照号码不能为空'));
      }else if(!reg.test(value)){
         callback(new Error('请输入正确的营业执照号码格式'));
      } 
      else {
        this.form.buniss_no = this.form.buniss_no.toUpperCase();
        callback();
      }
    };
    var validateCard = (rule, value, callback) => {
      let reg=/^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;
      if (!value) {
        callback(new Error('身份证号码不能为空'));
      }else if(!reg.test(value)){
        callback(new Error('请输入正确的身份证号码格式'));
      } 
      else {
        callback();
      }
    };
    var validateMobile = (rule, value, callback) => {
      let reg = /^1[3,5,8,7,4]\d{9}$/;
      if (!value) {
         callback(new Error('手机号码不能为空'));
      }else if(!reg.test(value)){
         callback(new Error('请输入正确的手机号码格式'));
      } 
      else {
        callback();
      }
    };
    var validateInputSignature = (rule, value, callback) => {
      if(!this.addShow){
        if(!value){
          callback(new Error('请添加签名'));
        }else{
          callback(new Error('请点击添加签名按钮'));
        }
      }else{
        callback();
      }
    };
    var validNumber = (rule, value, callback) => {
         let reg = /^\d+$/g ; 
         if(value==''){
            callback();
         }else if(!reg.test(value)){
            callback('请输入0或正整数')
         }else{
            callback();
         }

    };
		return {
      signatures: [],
			form: {
				name: null,
        company_name: null,
        buniss_no:null,
        true_name:null,
        card:null,
        mobile:null,
        spacing:'',
        minutMax:'',
        hoursMax:'',
        dayMax:'',
        inputSignature: null,
        signatures: []
      },
      channelForm: {},
      /*inputSignature: null,*/
      selectSignature: null,
      addShow:false,
      channnelDefaultStatus:false,
      channnelDefaultClass:'',
      conmitChageWeight:false,
      rules2: {
        name: [
          { required: true, validator: validateUserName, trigger: 'blur' }
        ],
        company_name: [
          { required: true, validator: validateCompanyName, trigger: 'blur' }
        ],
        buniss_no: [
          { required: true, validator: validateLicense, trigger: 'blur' }
        ],
        true_name: [
          { required: true, validator: validateTrueName, trigger: 'blur' }
        ],
        card: [
          { required: true,validator: validateCard, trigger: 'blur' }
        ],
        mobile: [
          { required: true,validator: validateMobile, trigger: 'blur' }
        ],
        inputSignature: [
          { required: true,validator: validateInputSignature, trigger: 'blur,change' }
        ],
        spacing:[
           {validator: validNumber,trigger: 'change'}
        ],
        minutMax:[
           {validator: validNumber,trigger: 'change'}
        ],
        hoursMax:[
           {validator: validNumber,trigger: 'change'}
        ],
        dayMax:[
           {validator: validNumber,trigger: 'change'}
        ],
      },
      rules:{
        weight:[{ required: true, validator: validateWeight, trigger: 'blur' }]
      },
		}
	},
	methods: {
    querySearchSignature (text, cb) {
      inputBlurSearch({sign:text}).then( res => {
        let {data} = res;
        if(data.code==0 && data.result){
          this.signatures = [];
          data.result.map((val,idx) => {
            let obj = {};
            obj.id = idx;
            obj.value = val;
            obj.name = val;
            this.signatures.push(obj);
          })
          cb(this.signatures.filter((item) => {
            if (!text) {
              return !this.signatureSelected(item)
            }
            return item.value.indexOf(text) != -1 && !this.signatureSelected(item)
          }))
        }
      })
    },
    signatureSelected (item) {
      if (!this.form.signatures) {
        return false
      }
      const len = this.form.signatures.length
      for (let i = 0; i < this.form.signatures.length; i++) {
        const el = this.form.signatures[i]
        if (el.name === item.name) { /*name或则id要唯一*/
          return true
        }
      }
      return false
    },
    handleSelectSignature (item) {
      this.selectSignature = item
    },
    handleAddSignature () { /*添加按钮*/
      if (!this.selectSignature) {
        return
      }
      accurateSearch({sign:this.form.inputSignature}).then( res => {
        this.channnelDefaultStatus = false;
        let {data} = res;
        if(data.code==0 && data.result){
           this.signatures.filter((val,idx) =>{
            if(val.value == this.form.inputSignature){
              var obj = val;
              obj.channels = []
              data.result.map((val,idx) => {
                let siglObj = {};
                siglObj.id = val.id;
                siglObj.name = val.username;
                siglObj.channelName = val.channelName;
                siglObj.weight = val.weight;
                siglObj.type = val.type;  /*增加type类型 1=>营销通道 2=>通知通道*/
                if(val.type == 1){
                  siglObj.defaultUse = false;
                  siglObj.defaultClass = 'spanDefaultNone';
                }else if(val.type == 2){
                  siglObj.defaultClass = '';
                  if(!this.channnelDefaultStatus){
                    siglObj.defaultUse = true;
                  }else{
                    siglObj.defaultUse = false;
                  }
                  this.channnelDefaultStatus = true;
                }
                obj.channels.push(siglObj);
              })
            }
          })
           /*console.log(this.signatures)*/
            this.addShow = true; /*用以判断添加签名认证的一个标志*/
            this.form.signatures = this.form.signatures || [];

            const signature = Object.assign({}, this.selectSignature)
            signature.channels = signature.channels.map((channel) => {
              return Object.assign({
                checked: true,
                edit: false
              }, channel)
            })
            this.form.signatures.push(signature)
            this.selectSignature = null
            this.form.inputSignature = null
        }
      })
    },
    handleEditChannel (channel,index) {
      this.channelForm[channel.name+index] = channel.weight
      channel.edit = true
    },
    cancelChangeWeight(channel,index){
      channel.weight = this.channelForm[channel.name+index]
      channel.edit = false;
    },
    handleSubmitChannel (channel) { /*修改权重*/
      /*channel.weight = this.channelForm.weight*/
      if(channel.weight<=0 || channel.weight>=1000) return;
      let  reg = /^[0-9]*$/
      if(!reg.test(channel.weight)) return;
      channel.edit = false
    },
		handleSubmit (formName) {  /*保存填写资料函数*/
      this.conmitChageWeight = false;
      this.addShow = this.form.signatures.length == 0?false:true;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          var checkedStatus = '',defaultStatus = '',signs='',weights='';
          for(var i=0;i<this.form.signatures.length;i++){
            signs += this.form.signatures[i].name + ','
            for(var j=0;j<this.form.signatures[i].channels.length;j++){
              if(this.form.signatures[i].channels[j].edit){
                this.conmitChageWeight = true;
                if(this.conmitChageWeight){
                   this.$notify({
                    title: '提示',
                    message: '请点击修改按钮修改权重',
                    duration: 3000
                  });
                }
                return;
              }
              if(this.form.signatures[i].channels[j].checked){
                checkedStatus += this.form.signatures[i].channels[j].id + ','
              }
              if(this.form.signatures[i].channels[j].defaultUse){
                defaultStatus += this.form.signatures[i].channels[j].id + ','
                if(!this.form.signatures[i].channels[j].checked){
                  this.$notify({
                    title: '警告',
                    message: '默认通道必须为勾选状态',
                    type: 'warning',
                    duration:3000
                  });
                  return;
                }
              }
              weights += this.form.signatures[i].channels[j].id+':'+this.form.signatures[i].channels[j].weight+','
            }
          }
          if(weights)
            weights = weights.substring(0,weights.length - 1);
          if(signs)
            signs = signs.substring(0,signs.length - 1);
          if(checkedStatus)
            checkedStatus = checkedStatus.substring(0,checkedStatus.length - 1);
          if(defaultStatus)
            defaultStatus = defaultStatus.substring(0,defaultStatus.length - 1);
          let paras = {
            companyName:this.form.company_name,
            username:this.form.name,
            businessLicense:this.form.buniss_no,
            contactName:this.form.true_name,
            contactIdNumber:this.form.card,
            contactMobile:this.form.mobile,
            mobileInterval:this.form.spacing==''?0:this.form.spacing,
            mobileTenMinTotal:this.form.minutMax==''?0:this.form.minutMax,
            mobileHourTotal:this.form.hoursMax==''?0:this.form.hoursMax,
            mobileDailyTotal:this.form.dayMax==''?0:this.form.dayMax,
            accountIds:checkedStatus,
            isdefaultAccountIds:defaultStatus,
            signs:signs,
            weights:weights,
            defultPwd:0
          }
          addUserInterfaces(paras).then(res => {
            let {msg,code} = res;
            if(code==0){
              this.$message({
                message: msg,
                type: 'success'
              });
              this.$router.push({ path: '/user/list' });
            }else if(code!=0 && code!=105){
              this.$message({
                message: msg,
                type: 'warning'
              });
            }
          })

        } else {
          return false;
        }
      });
		},
		handleCancel () {
			this.$router.back()
    },
    removeItem(index){
       this.form.signatures.splice(index,1);
    },
    setDefault(channel,index){   /*设置默认通道函数*/
      channel.filter((val,idx) => {
        val.defaultUse = index==idx?true:false;
      })
    },
    cancelDefault(channel,index){  /*取消默认通道函数*/
      channel.filter((val,idx) => {
        if(index==idx)
          val.defaultUse =!val.defaultUse;
      })
    }
	},
	mounted () {
		// TODO
    this.selectSignature = null;
	}
}

</script>
<style lang="scss" >
.section-title {
  margin-bottom: 20px;
  padding: 10px 30px;
  font-size: 16px;
  font-weight: 600;
  border-bottom: 1px solid #d1dbe5;
  .desc {
    font-size: 13px;
    font-weight: 500;
  }
}

.signature {
  margin: 10px 20px;
  .signature-header {
    padding: 8px 100px 8px 8px;
    .signature-title {
      font-weight: 600;
    }
    .signature-id {
      font-weight: 500;
    }
    .signature-remove {
      float: right;
      font-size: 20px;
      color: #0000FF;
      text-decoration: underline;
      cursor: pointer;
    }
  }
  .signature-content {
    padding: 8px;
    border: 1px solid #333;
    .content-title {
      margin-bottom: 8px;
    }
    .channel-list {
      margin-left: 5px;
    }
    .channel {
      margin: 10px 20px 0 0;
      display: inline-block;
      .channel-check {
        margin-right: 15px;
        display: inline-block;
      }
      .weight-title {
        color: #0066FF;
      }
      .channel-form {
        display: inline-block;
      }
      .channel-weight {
        color: #0066FF;
        display: inline-block;
      }
      .btn-icon {
        padding: 5px;
        color: #333;
        cursor: pointer;
      }
      .btn-text {
        padding: 5px 10px;
        color: #0000FF;
        text-decoration: underline;
        cursor: pointer;
      }
      .spanDefault{
        cursor: no-drop;
        color: #666;
      }
      .spanDefaultNone{
        cursor: no-drop;
        color: #666;
        display: none;
      }
    }
  }
}
.pwordTips{
  padding: 0 0 30px 20px;
}
.addUserpage .el-form-item__content{
  line-height: 0;
}
.addUserpage .el-input{
  width: 100%!important;
}
</style>