<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar">
            <el-form :inline="true" class="demo-form-inline">
                <el-form-item>
                    <el-button @click="handleAdd">新增</el-button>
                </el-form-item>
            </el-form>
        </el-col>
        <!--列表-->
        <template>
            <el-table :data="tableData" highlight-current-row v-loading="listLoading" style="width: 100%;">
                <el-table-column prop="accountIdDesc" label="帐号ID" width="100">
                </el-table-column>    
                <el-table-column prop="username" label="帐号名称" width="120">
                </el-table-column>  
                <el-table-column prop="password" label="密码" width="120">
                </el-table-column>  
                <el-table-column prop="sign" label="签名" width="180">
                </el-table-column>        
                <el-table-column prop="accountInterval" label="通道提交间隔" width="180">
                </el-table-column>
                <el-table-column prop="mobileInterval" label="单一号码提交间隔" width="180">
                </el-table-column>
                <el-table-column prop="mobileTenMinTotal" label="单一号码10分钟最大条数" width="220">
                </el-table-column>
                <el-table-column prop="mobileHourTotal" label="单一号码1小时最大条数" width="220">
                </el-table-column>
                <el-table-column prop="mobileDailyTotal" label="单一号码1天最大条数" width="220">
                </el-table-column>          
                <el-table-column prop="createTime" label="创建时间" width="180">
                </el-table-column>
                <el-table-column inline-template :context="_self" label="操作" width="150" fixed="right">
                    <span>
                        <el-button type="text" size="small" @click="handleEdit(row)">编辑</el-button>
                        <el-button type="text" size="small" @click="cancelRow(row)">删除</el-button>                    
					</span>
                </el-table-column>
            </el-table>
        </template>
        <!--分页-->
        <el-col :span="24" class="toolbar" style="padding-bottom:10px;">
            <el-pagination :current-page="currentPage" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange" style="float:right">
            </el-pagination>
        </el-col>
        <!--编辑界面-->
        <el-dialog :title="editFormTitle" size="tiny" v-model="editFormVisible" :close-on-click-modal="false" @close="closeDialog">
            <el-form :model="editForm" label-width="180px" :rules="editFormRules" ref="editForm">
              
                <el-form-item label="账号ID" prop="accountiddesc">
                    <el-input v-model="editForm.accountIdDesc" auto-complete="off"></el-input>
                </el-form-item> 
               
                
                <el-form-item label="账号名称" prop="username">
                    <el-input v-model="editForm.username" auto-complete="off"></el-input>
                </el-form-item>   
              
                
                <el-form-item label="账号密码" prop="password">
                    <el-input v-model="editForm.password" auto-complete="off"></el-input>
                </el-form-item>   
                
                
                <el-form-item label="短信签名" prop="sign">
                    <el-input v-model="editForm.sign" :disabled="noreset" auto-complete="off"></el-input>
                </el-form-item>  
               
               
                <el-form-item label="发送权重" prop="weight">
                    <el-input v-model.number="editForm.weight" auto-complete="off"></el-input>
                </el-form-item>  
                              
                <el-form-item label="通道提交间隔" prop="accountInterval">
                    <el-input v-model.number="editForm.accountInterval" auto-complete="off">
                        <template slot="append">ms</template>
                    </el-input>
                </el-form-item>
              
                <el-form-item label="单一号码提交间隔" prop="mobileInterval">
                    <el-input v-model.number="editForm.mobileInterval" auto-complete="off">
                        <template slot="append">s</template>
                    </el-input>
                </el-form-item>
                
                <el-form-item label="单一号码10分钟最大条数" prop="mobileTenMinTotal">
                    <el-input v-model.number="editForm.mobileTenMinTotal" auto-complete="off">
                        <template slot="append">条</template>
                    </el-input>
                </el-form-item>   
               
                                          
                <el-form-item label="单一号码1小时最大条数" prop="mobileHourTotal">
                    <el-input v-model.number="editForm.mobileHourTotal" auto-complete="off">
                        <template slot="append">条</template>
                    </el-input>
                </el-form-item>
             
                <el-form-item label="单一号码1天最大条数" prop="mobileDailyTotal">
                    <el-input v-model.number="editForm.mobileDailyTotal" auto-complete="off">
                        <template slot="append">条</template>
                    </el-input>
                </el-form-item>
             
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="closeDialog">取 消</el-button>
                <el-button type="primary" @click.native="editSubmit" :loading="editLoading">{{btnEditText}}</el-button>
            </div>
        </el-dialog>
    </section>
</template>
<script>
import NProgress from 'nprogress'
import Api from '../../api/index'

export default {
    data() {
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
        var validNumberWeight = (rule, value, callback) => {
            var reg = /^[1-9][0-9]{0,2}$/;
             if (value === '') {
                callback('权重不能为空')
            }else if(!reg.test(value)){
                callback(new Error('请输入1-999之间的整数'));
            }else{
                callback();
            } 
        }
        return {
            total: 0,
            channelId: '',
            currentPage: 1,
            pageSize: 20,
            editFormVisible: false, //编辑界面显是否显示
            editFormTitle: '编辑', //编辑界面标题
            noreset:false,//是否可以编辑
            //编辑界面数据
            editForm: {
                id: '',
                channelid: '',
                accountIdDesc: '',
                username: '',
                password: '',
                sign: '',
                weight: '',
                accountInterval: '',
                mobileInterval: '',
                mobileTenMinTotal: '',
                mobileHourTotal: '',
                mobileDailyTotal: ''
            },
            editLoading: false,
            btnEditText: '保 存',
            editFormRules: {
                accountIdDesc: [{
                    required: true,
                    message: '请输入账户ID',
                    trigger: 'blur'
                }],
                username: [{
                    required: true,
                    message: '请输入账户名称',
                    trigger: 'blur'
                }],
                password: [{
                    required: true,
                    message: '请输入密码',
                    trigger: 'blur'
                }],
                sign: [{
                    required: true,
                    message: '请输入签名',
                    trigger: 'blur'
                }],
                weight: [{
                    required: true,
                    validator: validNumberWeight,
                    trigger: 'blur'
                }],
                accountInterval: [{
                    validator: validNumber,
                    trigger: 'change'
                }],
                mobileInterval: [{
                    validator: validNumber,
                    trigger: 'change'
                }],
                mobileTenMinTotal: [{
                    validator: validNumber,
                    trigger: 'change'
                }],
                mobileHourTotal: [{
                    validator: validNumber,
                    trigger: 'change'
                }],
                mobileDailyTotal: [{
                    validator: validNumber,
                    trigger: 'change'
                }]
            },
            tableData: [],
            listLoading: false
        }
    },
    methods: {
        handleSizeChange(val) {
            this.pageSize = val
            this.handleQuery()
        },
        handleCurrentChange(val) {
            this.currentPage = val
            this.handleQuery()
        },
        handleQuery() {
            this.listLoading = true
            NProgress.start()
            let queryObj = {
                pageSize: this.pageSize,
                pageNum: this.currentPage,
                channelId: this.channelId
            }
            Api.getChannelAccountList(queryObj).then(res => {
                if(res.data.code == 0){
                     this.tableData = res.data.result.list;
                     this.tableData.map( (val,idx) => {
                       val.accountInterval = (!val.accountInterval)?'--':val.accountInterval+'ms';
                       val.mobileInterval = (!val.mobileInterval)?'--':val.mobileInterval+'s';
                       val.mobileTenMinTotal = (!val.mobileTenMinTotal)?'--':val.mobileTenMinTotal;
                       val.mobileHourTotal = (!val.mobileHourTotal)?'--':val.mobileHourTotal;
                       val.mobileDailyTotal = (!val.mobileDailyTotal)?'--':val.mobileDailyTotal;
                    })
                }
                /*无数据时添加--*/
                /*this.tableData.map( (val,idx) => {   
                    if(!val.accountInterval && val.accountInterval != 0){
                        val.accountInterval = '--'  
                    }
                })*/
                this.total = res.data.result.total - 0
                this.listLoading = false
                NProgress.done()
            }).catch(err => {
                this.listLoading = false
                NProgress.done()
                this.$message.error('操作失败，' + err.statusText)
            })
        },     
        //显示编辑界面
        handleEdit: function(row) {
            this.editFormVisible = true;
            this.editFormTitle = '编辑';
            for(let key in this.editForm){
                this.editForm[key] = '';
            }
            Api.checkAccount({accountId:row.accountId}).then( res=> {
                let {data} = res;
                if(data.code == 0){
                    if(data.result.account){
                        this.editForm.id = (!data.result.account.id && data.result.account.id!=0)?this.editForm.id:data.result.account.id;
                        this.editForm.password = (!data.result.account.password && data.result.account.password !=0)?this.editForm.password:data.result.account.password;
                        this.editForm.channelId = (!data.result.account.channelId && data.result.account.channelId!=0)?this.editForm.channelid:data.result.account.channelId; 
                        this.editForm.accountIdDesc = (!data.result.account.accountIdDesc && data.result.account.accountIdDesc!=0)?this.editForm.accountIdDesc:data.result.account.accountIdDesc; 
                        this.editForm.username = (!data.result.account.username && data.result.account.username != 0)?this.editForm.username:data.result.account.username; 
                        this.editForm.sign = (!data.result.account.sign && data.result.account.sign != 0)?this.editForm.sign:data.result.account.sign; 
                        this.editForm.weight = (!data.result.account.weight && data.result.account.weight != 0)?this.editForm.weight:data.result.account.weight; 
                        this.noreset = !data.result.account.userId?false:true;
                    }
                    if(data.result.flowControlStrategy){
                        this.editForm.accountInterval = (!data.result.flowControlStrategy.accountInterval && data.result.flowControlStrategy.accountInterval != 0)?this.editForm.accountInterval:data.result.flowControlStrategy.accountInterval==0?'':data.result.flowControlStrategy.accountInterval; 
                        this.editForm.mobileInterval = (!data.result.flowControlStrategy.mobileInterval && data.result.flowControlStrategy.mobileInterval != 0)?this.editForm.mobileInterval:data.result.flowControlStrategy.mobileInterval==0?'':data.result.flowControlStrategy.mobileInterval;
                        this.editForm.mobileTenMinTotal = (!data.result.flowControlStrategy.mobileTenMinTotal && data.result.flowControlStrategy.mobileTenMinTotal != 0)?this.editForm.mobileTenMinTotal:data.result.flowControlStrategy.mobileTenMinTotal==0?'':data.result.flowControlStrategy.mobileTenMinTotal;
                        this.editForm.mobileHourTotal = (!data.result.flowControlStrategy.mobileHourTotal && data.result.flowControlStrategy.mobileHourTotal != 0)?this.editForm.mobileHourTotal:data.result.flowControlStrategy.mobileHourTotal==0?'':data.result.flowControlStrategy.mobileHourTotal;
                        this.editForm.mobileDailyTotal = (!data.result.flowControlStrategy.mobileDailyTotal && data.result.flowControlStrategy.mobileDailyTotal != 0)?this.editForm.mobileDailyTotal:data.result.flowControlStrategy.mobileDailyTotal==0?'':data.result.flowControlStrategy.mobileDailyTotal;
                    }
                }
            })
        },
        cancelRow(row){  /*删除列*/
             this.$confirm('确定删除？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
                Api.channelDeleteAccount({accountId:row.accountId}).then( res => {
                    let {code,msg} = res;
                    if(code == 0){
                        this.$message({
                          message: '已成功删除该账号',
                          type: 'success'
                        });
                        this.handleQuery();
                    }else if(code!=0 && code!=105){
                        this.$message.error(msg);
                    } 
                })
            }).catch(() => {});
        },
        //编辑 or 新增
        editSubmit: function() {
            this.$refs.editForm.validate((valid) => {
                if (valid) {
                    this.$confirm('确认提交吗？', '提示', {}).then(() => {
                        this.editLoading = true
                        NProgress.start()
                        this.btnEditText = '提交中'
                        if(this.editForm.accountInterval =='') this.editForm.accountInterval =0;
                        if(this.editForm.mobileInterval =='') this.editForm.mobileInterval = 0;
                        if(this.editForm.mobileTenMinTotal =='')  this.editForm.mobileTenMinTotal = 0;
                        if(this.editForm.mobileHourTotal == '') this.editForm.mobileHourTotal = 0;
                        if(this.editForm.mobileDailyTotal == '') this.editForm.mobileDailyTotal = 0;
                        Api.saveChannelAccount(this.editForm).then(res => {
                            this.editLoading = false
                            this.btnEditText = '提 交'
                            if (res.code==0) {
                                this.handleQuery()
                                this.editFormVisible = false
                                this.$notify({
                                    title: '成功',
                                    message: this.editFormTitle + '账户成功',
                                    type: 'success'
                                })
                            } else if(res.code!=0 && res.code!=105){
                                this.$message.error('操作失败，' + res.msg)
                            }
                        }).catch(err => {
                            this.editLoading = false
                            this.btnEditText = '提 交'
                            this.$message.error('操作失败，' + err.statusText)
                        })
                    })
                }
            })
        },
        //显示新增界面
        handleAdd: function() {
            this.editFormVisible = true;
            this.editFormTitle = '新增';
            this.noreset = false;
            this.editForm = {
                id: '',
                channelId: this.channelId,
                accountIdDesc: '',
                username: '',
                password: '',
                sign: '',
                weight: '',
                accountInterval: '',
                mobileInterval: '',
                mobileTenMinTotal: '',
                mobileHourTotal: '',
                mobileDailyTotal: ''
            }
        },
        closeDialog: function() {
            this.editFormVisible = false
            this.$refs.editForm.resetFields()
        }
    },
    beforeMount() {
        var channelId = this.$route.params.channelId
        this.channelId = channelId === ':channelId' ? '' : channelId
        this.handleQuery()
    },
}
</script>
<style scoped>
.toolbar .el-form-item {
    margin-bottom: 10px;
}

.toolbar {
    background: #fff;
    padding: 10px 10px 0px 10px;
}
</style>
