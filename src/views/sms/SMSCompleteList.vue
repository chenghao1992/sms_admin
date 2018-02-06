<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar-sms">
            <el-radio-group v-model="listType" @change="showList" size="small">
                <el-radio-button label="0">定时发送</el-radio-button>
                <!--<el-radio-button label="1">待发送</el-radio-button>-->
                <el-radio-button label="2">正在发送</el-radio-button>
                <el-radio-button label="3">发送完成</el-radio-button>
            </el-radio-group>
            <div style="margin: 20px;"></div>
            <el-form :inline="true" :model="formInline" class="demo-form-inline">
                <el-form-item label="短信类型">
                    <el-select v-model="formInline.smsType" placeholder="请选择" style="width: 100px;">
                        <el-option v-for="item in smsTypes" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="用户名">
                    <el-select v-model="formInline.userId" placeholder="请选择">
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <br>
                <el-form-item label="短信状态">
                    <el-select v-model="formInline.status" placeholder="请选择" style="width: 100px;">
                        <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="发送通道">
                    <el-select v-model="formInline.sendChannel" placeholder="请选择">
                        <el-option v-for="item in optionsChannel" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
            

                <el-form-item label="手机号">
                    <el-input v-model="formInline.mobile" type="text" placeholder="请输入手机号">
                    </el-input>
                </el-form-item>
                <el-form-item label="发送时间">
                    <el-date-picker @change="timeChange" v-model="formInline.sendTime" type="datetimerange" :picker-options="pickerOptions" :placeholder="placeholder" align="right">
                    </el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button @click="handleQuery(true)">查询</el-button>
                </el-form-item>
            </el-form>
        </el-col>
        <!--列表-->
        <template>
            <el-table :data="tableData" highlight-current-row v-loading="listLoading" style="width: 100%;">
                <el-table-column prop="managementId" label="任务ID" width="150">
                </el-table-column>
                <el-table-column label="短信类型" width="100">
                    <template scope="scope">
                        {{ scope.row.type | getSMSType }}
                    </template>
                </el-table-column>
                <el-table-column prop="userName" label="用户名" width="100">
                </el-table-column>
                <el-table-column label="状态" width="100">
                    <template scope="scope">
                        {{ scope.row.status | getSMSStatusCompleted }}
                    </template>
                </el-table-column>
                <el-table-column prop="mobile" label="发送手机号" width="150">
                </el-table-column>
                <el-table-column prop="sendTime" label="发送完成时间" width="180">
                </el-table-column>

                <el-table-column prop="channelName" label="发送通道" width="150">
                </el-table-column>

                <el-table-column prop="content" label="短信内容" min-width="350">
                </el-table-column>

                <el-table-column label="备注" align="center" width="200">
                    <template scope="scope">
                        {{ scope.row.errorMsg | listNote }}
                    </template>
                </el-table-column>
            </el-table>
        </template>
        <!--分页-->
        <el-col :span="24" class="toolbar-sms" style="padding-bottom:10px;">
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
            optionsChannel: [{
                value: '',
                label: '全部'
            }],
            smsTypes: [{
                value: '',
                label: '全部'
            }, {
                value: '1',
                label: '营销'
            }, {
                value: '2',
                label: '通知'
            }],
            statusOptions: [{
                value: '',
                label: '全部'
            }, {
                value: '0',
                label: '成功'
            }, {
                value: '1',
                label: '失败'
            },{
                value: '2',
                label: '取消'
            }],
            total: 0,
            currentPage: 1,
            pageSize: 20,
            listType: 3,
            formInline: {
                userId: '',
                sendChannel:'',
                mobile: '',
                status: '',
                smsType: '',
                sendTime: [null,null]
            },
            tableData: [],
            placeholder: '请选择时间范围',
            listLoading: false
        }
    },
    methods: {
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
            Api.goldIndex().then(res => {
                let channelName = res.data.result
                channelName.forEach((item,index) => {
                    this.optionsChannel.push({
                        value:item.id,
                        label:item.channelName
                    })
                })
            }).catch(err => {                
                
            })
        },
        handleSizeChange(val) {
            this.pageSize = val
            this.handleQuery()
        },
        handleCurrentChange(val) {
            this.currentPage = val
            this.handleQuery()
        },
        timeChange(){
            if(!this.formInline.sendTime){
                this.formInline.sendTime=[null,null]
            }
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
                mobile: this.formInline.mobile
            }
            if (this.formInline.status) {
                queryObj.status = this.formInline.status
            }
            if (this.formInline.sendChannel){
                queryObj.channelId = this.formInline.sendChannel
            }
            if (this.formInline.smsType) {
                queryObj.type = this.formInline.smsType
            }
            if (this.formInline.userId) {
                queryObj.userId = this.formInline.userId
            }
            if (this.formInline.sendTime[0]) {
                queryObj.sendTimeStart = Moment(this.formInline.sendTime[0]).format('YYYY/MM/DD HH:mm:ss')
                queryObj.sendTimeEnd = Moment(this.formInline.sendTime[1]).format('YYYY/MM/DD HH:mm:ss')
            }
            Api.getSMSRecordList(queryObj).then(res => {
                this.tableData = res.data.result.list
                this.total = res.data.result.total - 0
                this.listLoading = false
                NProgress.done()
            }).catch(err => {
                this.listLoading = false
                NProgress.done()
                /*this.$message.error('操作失败，' + err.statusText)*/
            })
        }
    },
    beforeMount() {
        const endC = new Date();
        const startC = new Date();
        startC.setTime(startC.getTime() - 3600 * 1000 * 24 * 7);
        this.formInline.sendTime = [startC,endC]
        this.getUserList()
        this.handleQuery()
    }
}
</script>
<style scoped>
.toolbar-sms .el-form-item {
    margin-bottom: 10px;
}

.toolbar-sms {
    background: #fff;
    padding: 10px 10px 0px 10px;
}
</style>