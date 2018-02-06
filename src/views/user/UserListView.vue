<template>
  <div class="">
    <el-button class="btn-add" type="primary" @click="handleAddUser">
      <i class="fa fa-plus"></i>添加用户
    </el-button>
    <div class="">
      <el-form class="search-form" :inline="true" :model="searchForm" :show-message="false">
        <el-form-item label="关键字搜索">
          <el-input v-model="searchForm.likeName" icon="search" placeholder="搜索用户名/联系人/手机号">
          </el-input>
        </el-form-item>
        <el-form-item label="创建时间">
        </el-form-item>
        <el-date-picker v-model="searchForm.createTimeStart" format="yyyy/MM/dd HH:mm:ss" @change="getStartTime" type="datetime" placeholder="选择日期时间">
        </el-date-picker>
        ———
        <el-date-picker v-model="searchForm.createTimeEnd" format="yyyy/MM/dd HH:mm:ss" @change="getEndtTime" type="datetime" placeholder="选择日期时间">
        </el-date-picker>
        <el-button type="primary" @click="handleSearch">查询</el-button>
      </el-form>
    </div>
    <el-table :data="userList" v-loading="loadingList" @current-change='handleCurrentRow' highlight-current-row style="width: 100%;">
      <el-table-column prop="id" align="center" label="用户id">
      </el-table-column>
      <el-table-column prop="companyName" align="center" label="公司名称">
      </el-table-column>
      <el-table-column prop="username" align="center" label="用户名">
      </el-table-column>
      <el-table-column prop="contactName" align="center" label="联系人">
      </el-table-column>
      <el-table-column prop="contactMobile" align="center" label="手机号">
      </el-table-column>
      <el-table-column prop="balance1.balance" width="150" align="center" label="营销短信条数">
      </el-table-column>
      <el-table-column prop="balance2.balance" width="150" align="center" label="通知短信条数">
      </el-table-column>
      <el-table-column prop="createTime" width="180" align="center" label="创建时间">
      </el-table-column>
      <el-table-column width="100" align="center" label="操作">
        <template scope="scope">
          <el-dropdown @command="handleCommand" trigger="click">
            <span class="el-dropdown-link">
              操作
              <i class="el-icon-caret-bottom el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="info">查看详情</el-dropdown-item>
              <el-dropdown-item command="edit">修改信息</el-dropdown-item>
              <el-dropdown-item command="recharge">账户充值</el-dropdown-item>
              <el-dropdown-item v-if="!(!scope.row.status)" command="unlock">解冻账号</el-dropdown-item>
              <el-dropdown-item v-else command="lock">冻结账号</el-dropdown-item>
              <el-dropdown-item command="password">重置密码</el-dropdown-item>
              <el-dropdown-item command="key">重置秘钥</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <div class="table-pager">
      <el-pagination class="pager" :current-page="pageNum" :page-size="pageSize" :total="total" @current-change="handlePageChange" layout="total, prev, pager, next">
      </el-pagination>
    </div>
    <el-dialog title="账户充值" :visible.sync="showRechargeDialog" @open="onRechargeDialogOpen" size='tiny'>
      <el-form :model="rechargeForm" label-width="120px" label-position='left' :rules="rechargeFormRules" ref="rechargeForm">
        <el-form-item label="选择短信类型" prop="smsType">
          <el-select v-model="rechargeForm.smsType" placeholder="请选择短信类型">
            <el-option label="营销短信" value="1"></el-option>
            <el-option label="通知短信" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="充值条数" prop="amount">
          <el-input v-model="rechargeForm.amount" placeholder="数字前面“+”或“-”表示增减余额" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCancelVal('rechargeForm')">取 消</el-button>
        <el-button type="primary" @click="handleRecharge" :loading="chargeClc">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.btn-add {
  margin-top: 10px
}

.search-form {
  padding-top: 15px;
}

.el-dropdown-link {
  color: #20A0FF;
  text-decoration: underline;
  cursor: pointer;
}

.table-pager {
  padding-top: 5px;
  height: 45px;
  text-align: center;
  .pager {
    margin-top: 3px;
  }
}
</style>

<script>
import axios from 'axios'
import { userPageInfo, userRecharge, resetPwd, resetSecret, frostUser,unfreezeAccount } from '../../api/api';
export default {
  data() {
    var validsmsType = (rule, value, callback) => {
      if (value === '') {
            callback('请选择短信类型')
        } else {
           callback()
        }
    }
    var validamount = (rule, value, callback) => {
      let reg = /^(\-|\+?)\d+$/g ; 
        if (value == '') {
            callback('请输入充值条数')
        } else if(!reg.test(value) || value==0 || value=='-0'){
            callback('充值条数只能输入除0外的整数')
        } 
        else {
           callback()
        }
    }
    return {
      searchForm: {
        likeName: null,
        createTimeStart: null,
        createTimeEnd: null
      },
      chargeClc:false,
      loadingList: false,
      pageNum: 1,
      pageSize: 20,
      total: 0,
      userList: [],
      markNum:null,
      noticeNum:null,
      selectedUser: null,
      showRechargeDialog: false,
      rechargeForm: {
        smsType: '',
        amount: ''
      },
       rechargeFormRules: {
            smsType: [{
                required: true,
                validator: validsmsType,
                trigger: 'blur'
            }],
            amount: [{
                required: true,
                validator: validamount,
                trigger: 'blur'
            }],
        },
    }
  },
  computed: {
    start_end_time() {
      return this.$refs.datePicker.displayValue
    }
  },
  methods: {
    getStartTime(val) {
      this.searchForm.createTimeStart = val;
    },
    getEndtTime(val) {
      this.searchForm.createTimeEnd = val;
    },
    handleAddUser() {
      this.$router.push('/user/add')
    },
    handleSearch() {
      this.loadUserList()
    },
    handlePageChange(page) {
      this.pageNum = page
      this.loadUserList()
    },
    handleCurrentRow(row) {
      this.selectedUser = row;
    },
    onRechargeDialogOpen() {
      this.rechargeForm = {
        smsType: '',
        amount: ''
      }
    },
    handleCommand(cmd) {
      switch (cmd) {
        case 'info':
          this.$router.push('/user/info/' + this.selectedUser.id)
          break;
        case 'edit':
          this.$router.push('/user/edit/' + this.selectedUser.id)
          break;
        case 'recharge':
          this.markNum = this.selectedUser.balance1.balance;
          this.noticeNum = this.selectedUser.balance2.balance;
          this.showRechargeDialog = true;
          break;
        case 'lock':
          this.handleLockAccount(this.selectedUser)
          break;
        case 'unlock':
          this.handleUnlockAccount(this.selectedUser)
          break;
        case 'password':
          this.handleResetPassword(this.selectedUser)
          break;
        case 'key':
          this.handleResetKey(this.selectedUser)
          break;

        default:
          break;
      }
    },
    handleLockAccount(user) {
      this.$confirm('确认冻结账号？').then(() => {
        frostUser({ userId: user.id }).then(res => {
          if(res.code==0){
            user.status = 1;
            this.$message({
              type: 'success',
              message: '冻结账号成功!'
            })
          }else if(res.code!=0 && res.code!=105){
            this.$message.error(res.msg);
          }
        })

      })
    },
    handleUnlockAccount(user) {
      this.$confirm('确认解冻账号？').then(() => {
        unfreezeAccount({ userId: user.id }).then(res => {
          if(res.code==0){
            user.status = 0;
            this.$message({
              type: 'success',
              message: '解冻账号成功!'
            })
            }else if(res.code!=0 && res.code!=105){
              this.$message.error(res.msg);
            }
        })
      })
    },
    handleResetPassword(user) {
      this.$confirm('确认重置密码？').then(() => {
        resetPwd({ userId: user.id }).then(res => {
          if(res.code==0){
            this.$message({
              type: 'success',
              message: '重置密码成功!'
            })
          }else if(res.code!=0 && res.code!=105){
            this.$message.error(res.msg);
          }
        })

      })
    },
    handleResetKey(user) {
      this.$confirm('确认重置秘钥？').then(() => {
        resetSecret({ userId: user.id }).then(res => {
          if(res.code==0){
             this.$message({
              type: 'success',
              message: '重置秘钥成功!'
            })
          }else if(res.code!=0 && res.code!=105){
            this.$message.error(res.msg);
          }
        })

      })
    },
    handleRecharge() {
       this.$refs.rechargeForm.validate((valid) => {
          if (valid) {
                if(this.rechargeForm.smsType==1){
                  if(Number(this.rechargeForm.amount)<0){
                    if(this.markNum+Number(this.rechargeForm.amount)<0){
                      this.$message({
                        message: '营销短信余额不足扣款',
                        type: 'warning'
                      });
                      return;
                    }
                  }
                }else if(this.rechargeForm.smsType==2){
                  if(Number(this.rechargeForm.amount)<0){
                    if(this.noticeNum+Number(this.rechargeForm.amount)<0){
                      this.$message({
                        message: '通知短信余额不足扣款',
                        type: 'warning'
                      });
                      return;
                    }
                  }
                }
                this.chargeClc = true;
                userRecharge({ userId: this.selectedUser.id, count: this.rechargeForm.amount, type: this.rechargeForm.smsType }).then(res => {
                  if(res.code==0){
                    this.chargeClc = false;
                    this.$message({
                      type: 'success',
                      message: '账户充值成功!'
                    })
                    this.showRechargeDialog = false;
                    this.loadUserList();
                  }else if(res.code!=0 && res.code!=105){
                    this.$message.error(res.msg);
                  }
              })
          }
      })
    },
    handleCancelVal(formName){
       this.showRechargeDialog = false;
       this.$refs[formName].resetFields();
    },
    loadUserList() {
      let para = {
        likeName: this.searchForm.likeName,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      };
      if(this.searchForm.createTimeStart) para.createTimeStart = this.searchForm.createTimeStart;
      if(this.searchForm.createTimeEnd) para.createTimeEnd = this.searchForm.createTimeEnd;
      userPageInfo(para).then((res) => {
        this.userList = res.data.result.list;
        this.total = parseInt(res.data.result.total);
      });
    }
  },
  mounted() {
    this.loadUserList()
  }
}

</script>