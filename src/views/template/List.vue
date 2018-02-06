<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar">
            <el-radio-group v-model="formInline.status" @change="handleQuery(true)" size="small">
                <el-radio-button label="0">待审核</el-radio-button>
                <el-radio-button label="1">已通过</el-radio-button>
                <el-radio-button label="2">已拒绝</el-radio-button>
            </el-radio-group>
            <div style="margin: 20px;"></div>
            <el-form :inline="true" :model="formInline" class="demo-form-inline">
                <el-form-item label="关键字">
                    <el-input v-model="formInline.content" placeholder="按短信内容/用户名搜索"></el-input>
                </el-form-item>
                <el-form-item label="提交时间" v-show="formInline.status==0">
                    <el-date-picker v-model="formInline.submitTime" type="datetimerange" :picker-options="pickerOptions" :placeholder="placeholder" align="right">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="审核时间" v-show="formInline.status!=0">
                    <el-date-picker v-model="formInline.auditTime" type="datetimerange" :picker-options="pickerOptions" :placeholder="placeholder" align="right">
                    </el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button @click="handleQuery(true)">查询</el-button>
                </el-form-item>
            </el-form>
        </el-col>
        <!--列表-->
        <template>
            <el-table :data="tableData_0" v-show="formInline.status==0" highlight-current-row v-loading="listLoading" style="width: 100%;">
                <el-table-column prop="id" label="模板ID" width="200">
                </el-table-column>
                <el-table-column prop="content" label="模板内容">
                </el-table-column>
                <el-table-column label="模板类型" width="180">
                    <template scope="scope">
                       <!-- {{ scope.row.type | getTemplateType }} -->
                       通知类
                    </template> 
                </el-table-column>
                <el-table-column prop="ownerUsername" label="用户名" width="180">
                </el-table-column>
                <el-table-column prop="submitTime" label="提交时间" width="180">
                </el-table-column>
                <el-table-column inline-template :context="_self" label="操作" width="150">
                    <span>
                        <el-button type="text" size="small" @click="handleAuditPass(row)">通过</el-button>
                        <el-button type="text" size="small" @click="handleAuditDeny(row)">拒绝</el-button>
                    </span>
                </el-table-column>
            </el-table>
            <el-table :data="tableData_1" v-show="formInline.status!=0" highlight-current-row v-loading="listLoading" style="width: 100%;">
                <el-table-column prop="id" label="模板ID" width="200">
                </el-table-column>
                <el-table-column prop="content" label="模板内容">
                </el-table-column>
                <el-table-column label="模板类型" width="180">
                    <template scope="scope">
                        <!--{{ scope.row.type | getTemplateType }} -->
                        通知类
                    </template> 
                </el-table-column>
                <el-table-column prop="ownerUsername" label="用户名" width="180">
                </el-table-column>
                <el-table-column prop="submitTime" label="提交时间" width="180">
                </el-table-column>
                <el-table-column prop="reviewTime" label="审核时间" width="180">
                </el-table-column>
                <el-table-column label="状态" width="120">
                    <template scope="scope">
                        {{ scope.row.status | getTemplateStatus }}
                        <el-tooltip v-if="scope.row.status == 2" class="item" effect="dark" :content="scope.row.msg" placement="top">
                            <i class="el-icon-information"></i>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
        </template>
        <!--分页-->
        <el-col :span="24" class="toolbar" style="padding-bottom:10px;">
            <el-pagination :current-page="currentPage" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange" style="float:right">
            </el-pagination>
        </el-col>
        <!-- 拒绝对话框 -->
        <el-dialog title="审核拒绝" size="tiny" v-model="editFormVisible" :close-on-click-modal="false">
            <el-form :model="editForm" label-width="120px" :rules="editFormRules" ref="editForm">
                <el-form-item label="拒绝原因" prop="denyReason">
                    <el-select v-model="editForm.denyReason" placeholder="请选择" @change="selectReason">
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-input :disabled="noEdit" type="textarea" v-model="editForm.remark"></el-input>
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
import Moment from 'moment'
import NProgress from 'nprogress'
import Api from '../../api/index'

export default {
    data() {
        return {
            btnEditText: '确 认',
            options: [{
                value: '含敏感词汇',
                label: '含敏感词汇'
            }, {
                value: '含营销词汇',
                label: '含营销词汇'
            }, {
                value: '重选模板类型',
                label: '重选模板类型'
            }, {
                value: '重选通道',
                label: '重选通道'
            }, {
                value: '其他',
                label: '其他'
            }],
            editFormRules: {
                denyReason: [{
                    required: true,
                    message: '请选择拒绝原因',
                    trigger: 'blur'
                }]
            },
            editFormVisible: false,
            editLoading: false,
            total: 0,
            noEdit:true,
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
            currentPage: 1,
            pageSize: 20,
            formInline: {
                status: 0,
                content: '',
                submitTime: [null,null],
                auditTime: [null,null]
            },
            editForm: {
                denyReason: '含敏感词汇',
                remark: ''
            },
            tableData_0: [],
            tableData_1: [],
            placeholder: '请选择时间范围',
            listLoading: false
        }
    },
    methods: {
        selectReason(val){
            this.noEdit = val=='其他'?false:true;
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
            if (isRequery) {
                this.currentPage = 1
            }
            this.listLoading = true
            NProgress.start()
            let queryObj = {
                pageSize: this.pageSize,
                pageNum: this.currentPage,
                status: this.formInline.status,
                content: this.formInline.content
            }
            if (this.formInline.status == 0) {
                if (this.formInline.submitTime[0]) {
                    queryObj.createTimeStart = Moment(this.formInline.submitTime[0]).format('YYYY/MM/DD HH:mm:ss')
                    queryObj.createTimeEnd = Moment(this.formInline.submitTime[1]).format('YYYY/MM/DD HH:mm:ss')
                }
            } else {
                if (this.formInline.auditTime[0]) {
                    queryObj.createTimeStart = Moment(this.formInline.auditTime[0]).format('YYYY/MM/DD HH:mm:ss')
                    queryObj.createTimeEnd = Moment(this.formInline.auditTime[1]).format('YYYY/MM/DD HH:mm:ss')
                }
            }
            Api.getTemplateList(queryObj).then(res => {
                if (this.formInline.status == 0) {
                    this.tableData_0 = res.data.result.list
                } else {
                    this.tableData_1 = res.data.result.list
                }
                this.total = res.data.result.total - 0
                this.listLoading = false
                NProgress.done()
            }).catch(err => {
                this.listLoading = false
                NProgress.done()
                this.$message.error('操作失败，' + err.statusText)
            })
        },
        //通过
        handleAuditPass: function(row) {
            this.$confirm('确认审核通过吗?', '提示', {}).then(() => {
                Api.auditTemplate({
                    templateId: row.id,
                    templateStatus: 1,
                }).then(res => {
                    if (res.code==0) {
                        this.$notify({
                            title: '成功',
                            message: '模板审核通过',
                            type: 'success'
                        })
                        this.handleQuery()
                    } else if(res.code!=0 && res.code!=105){
                        this.$message.error('操作失败，' + res.msg)
                    }
                }).catch(err => {
                    this.$message.error('操作失败，' + err.statusText)
                })
            })
        },
        //显示拒绝界面
        handleAuditDeny: function(row) {
            this.editFormVisible = true
            this.editForm = {
                reviewId: row.id,
                denyReason: '含敏感词汇',
                remark: ''
            }
        },
        //拒绝
        editSubmit: function() {
            this.editLoading = true
            NProgress.start()
            this.btnEditText = '提交中'

            /*this.$confirm('确认拒绝吗?', '提示', {}).then(() => {*/

                Api.auditTemplate({
                    templateId: this.editForm.reviewId,
                    templateStatus: 2,
                    msg:this.editForm.denyReason=='其他'?this.editForm.remark:this.editForm.denyReason
                }).then(res => {
                    if (res.code==0) {
                        this.$notify({
                            title: '成功',
                            message: '模板审核拒绝',
                            type: 'success'
                        })
                        this.editFormVisible = false
                        this.handleQuery()
                    } else if(res.code!=0 && res.code!=105){
                        this.$message.error('操作失败，' + res.msg)
                    }
                    this.editLoading = false
                    this.btnEditText = "提交"
                    NProgress.done()
                }).catch(err => {
                    this.editLoading = false
                    this.btnEditText = "提交"
                    NProgress.done()
                    this.$message.error('操作失败，' + err.statusText)
                })
            /*})*/
        },
        closeDialog: function() {
            this.editFormVisible = false
            this.$refs.editForm.resetFields()
        }
    },
    beforeMount() {
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