<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar">
            <el-radio-group v-model="listType" @change="showList" size="small">
                <el-radio-button label="0">定时发送</el-radio-button>
                <!--<el-radio-button label="1">待发送</el-radio-button>-->
                <el-radio-button label="2">正在发送</el-radio-button>
                <el-radio-button label="3">发送完成</el-radio-button>
            </el-radio-group>
            <div style="margin: 20px;"></div>
            <el-form :inline="true" :model="formInline" class="demo-form-inline">
                <el-form-item label="用户名">
                    <el-select v-model="formInline.userId" placeholder="请选择">
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="提交时间">
                    <el-date-picker v-model="formInline.submitTime" type="datetimerange" :picker-options="pickerOptions" :placeholder="placeholder" align="right">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="定时发送时间">
                    <el-date-picker v-model="formInline.sendTime" type="datetimerange" :picker-options="pickerOptions" :placeholder="placeholder" align="right">
                    </el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button @click="handleQuery(true)">查询</el-button>
                </el-form-item>
            </el-form>
        </el-col>
        <!--列表-->
        <template>
            <el-table :data="tableData" highlight-current-row v-loading="listLoading" @selection-change="handleSelectionChange" style="width: 100%;">
                <el-table-column type="selection" width="55">
                </el-table-column>
                <el-table-column prop="id" label="任务ID" width="150">
                </el-table-column>
                <el-table-column prop="username" label="用户名" width="100">
                </el-table-column>
                <el-table-column label="状态" width="100">
                    <template scope="scope">
                        {{ scope.row.status | getSMSStatus }}
                    </template>
                </el-table-column>
                <el-table-column prop="targetMobileTotal" label="发送号码数" width="120">
                    <template scope="scope">
                        <!--<el-button type="text" size="large" @click.native.prevent="sendPhoneNum(scope.row.id)">{{scope.row.targetMobileTotal}}</el-button>-->
                        <a style="text-decoration: none;color:#20a1ff;" @click="sendPhoneNum(scope.row.id)" download :href="aHref">{{scope.row.targetMobileTotal}}</a>
                    </template>
                </el-table-column>
                <el-table-column prop="submitTime" label="提交时间" width="180">
                </el-table-column>
                <el-table-column prop="executeTime" label="定时发送时间" width="180">
                </el-table-column>
                <el-table-column prop="content" label="短信内容">
                </el-table-column>
                <el-table-column inline-template :context="_self" label="操作" width="150">
                    <span>
                        <el-button type="text" size="small" @click="handleCancel(row)">取消发送</el-button>
                    </span>
                </el-table-column>
            </el-table>
            <el-button style="margin-top: 15px;" type="primary" @click="handleBatchCancel">批量取消发送</el-button>
        </template>
        <!--分页-->
        <el-col :span="24" class="toolbar" style="padding-bottom:10px;">
            <el-pagination :current-page="currentPage" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange" style="float:right">
            </el-pagination>
        </el-col>
    </section>
</template>
<script>
import Moment from 'moment'
import NProgress from 'nprogress'
import Api from '../../api/index'

export default {
    data() {
        return {
            btnEditText: '确 认',
            pickerOptions: {
                shortcuts: [{
                    text: '最近一周',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近一个月',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近三个月',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                        picker.$emit('pick', [start, end]);
                    }
                }]
            },
            options: [{
                value: '',
                label: '全部'
            }],
            total: 0,
            aHref:'',
            currentPage: 1,
            pageSize: 20,
            listType: 0,
            formInline: {
                userId: '',
                submitTime: [null,null],
                sendTime: [null,null]
            },
            changeFormInline:{
                submitTime: '',
                sendTime: ''
            },
            tableData: [],
            placeholder: '请选择时间范围',
            listLoading: false,
            multipleSelection: []
        }
    },
    methods: {
        /*下载号码数*/
        sendPhoneNum(id){
              this.aHref = '/sms-admin/sendManagement/exportMobile?id='+id;
           /* Api.exportPhonesNum({id:id}).then( res=>{
                let code = res.data.code || null;
                if(code && code==105){
                     this.$router.push({ path: '/login' });
                     return;
                }
                location.href = res.request.responseURL;
            })*/
        },
        showList(val) {
            if (val == 0) {
                this.$router.push('/sms/scheduler')
            } else if (val == 1) {
                this.$router.push('/sms/sent')
            } else if (val == 2) {
                this.$router.push('/sms/sending')
            } else if (val == 3) {
                this.$router.push('/sms/complete')
            }
        },
        getUserList() {
            let queryObj = {
                pageSize: 999,
                pageNum: 1
            }
            Api.getSMSUserList(queryObj).then(res => {
                let userList = res.data.result.list
                userList.forEach((item, index) => {
                    this.options.push({
                        value: item.id,
                        label: item.username
                    })
                })                
            }).catch(err => {                
                /*this.$message.error('操作失败，' + err.statusText)*/
            })
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        handleSizeChange(val) {
            this.pageSize = val
            this.handleQuery()
        },
        handleCurrentChange(val) {
            this.currentPage = val
            this.handleQuery()
        },
        handleQuery(isRequery) {
            this.listLoading = true
            NProgress.start()
            if (isRequery) {
                this.currentPage = 1
            }
            let queryObj = {
                pageSize: this.pageSize,
                pageNum: this.currentPage,
                status: this.listType
            }
            if (this.formInline.userId) {
                queryObj.userId = this.formInline.userId
            }
            if (this.formInline.submitTime[0]) {
                queryObj.submittimeStart = Moment(this.formInline.submitTime[0]).format('YYYY/MM/DD HH:mm:ss')
                queryObj.submittimeEnd = Moment(this.formInline.submitTime[1]).format('YYYY/MM/DD HH:mm:ss')
            }

            if (this.formInline.sendTime[0]) {
                queryObj.executetimeStart = Moment(this.formInline.sendTime[0]).format('YYYY/MM/DD HH:mm:ss')
                queryObj.executetimeEnd = Moment(this.formInline.sendTime[1]).format('YYYY/MM/DD HH:mm:ss')
            }
            Api.getSMSManagementList(queryObj).then(res => {
                this.tableData = res.data.result.list
                this.total = res.data.result.total - 0
                this.listLoading = false
                NProgress.done()
            }).catch(err => {
                this.listLoading = false
                NProgress.done()
                /*this.$message.error('操作失败，' + err.statusText)*/
            })
        },
        //删除记录
        handleCancel: function(row) {
            this.$confirm('确认取消发送吗?', '提示', {}).then(() => {
                this.listLoading = true
                Api.undoSendSMS({ 
                    sendManagementIds: row.id, 
                }).then(res => {
                    if (res.code==0) {
                        this.$notify({
                            title: '成功',
                            message: '取消发送短信',
                            type: 'success'
                        })
                        this.handleQuery()
                    } else if(res.code!=0 && res.code!=105){
                        this.$message.error('操作失败，' + res.msg)
                    }
                }).catch(err => {
                    /*this.$message.error('操作失败，' + err.statusText)*/
                })
            })
        },
        //显示拒绝界面
        handleBatchCancel: function(row) {
            if (this.multipleSelection.length === 0) {
                this.$notify({
                    title: '警告',
                    message: '请选择要取消发送的短信',
                    type: 'warning'
                })
                return
            }
            let idList = []
            this.multipleSelection.forEach((item, index) => {
                idList.push(item.id)
            })
            this.$confirm('确认批量取消发送选中短信吗?', '提示', {}).then(() => {
                this.listLoading = true
                Api.undoSendSMS({ 
                    sendManagementIds: idList.join(','), 
                }).then(res => {
                    if (res.code==0) {
                        this.$notify({
                            title: '成功',
                            message: '批量取消发送短信',
                            type: 'success'
                        })
                        this.handleQuery()
                    } else if(res.code!=0 && res.code!=105){
                        this.$message.error('操作失败，' + res.msg)
                    }
                }).catch(err => {
                    /*this.$message.error('操作失败，' + err.statusText)*/
                })
            })
        }
    },
    beforeMount() {
        this.getUserList()
        this.handleQuery()
    }
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