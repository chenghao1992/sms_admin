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
                <el-table-column prop="channelIdDesc" label="通道ID" width="180">
                </el-table-column>
                <el-table-column prop="channelName" label="通道名称" width="180">
                </el-table-column>
                <el-table-column prop="type" label="通道类型" width="180">
                </el-table-column>
                <el-table-column prop="longSms" label="长短信" width="180">
                </el-table-column>
                <el-table-column prop="batchSms" label="批量短信" width="180">
                </el-table-column>
                <el-table-column label="状态">
                    <template scope="scope">
                        {{ scope.row.status | getChannelStatus }}
                    </template>
                </el-table-column>
                <el-table-column inline-template :context="_self" label="操作" width="180">
                    <span>
                        <el-button type="text" size="small" v-if="row.status !== 0" @click="handleLaunch(row)">启动</el-button>
                        <el-button type="text" size="small" v-if="row.status === 0" @click="handleDisabled(row)">禁用</el-button>
                        <el-button type="text" size="small" @click="handleEdit(row)">修改</el-button>
                        <el-button type="text" size="small" @click="handleView(row)">帐号信息</el-button>
                    </span>
                </el-table-column>
            </el-table>
        </template>
        <!--分页-->
        <el-col :span="24" class="toolbar" style="padding-bottom:10px;">
            <el-pagination :current-page="currentPage" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange" style="float:right">
            </el-pagination>
        </el-col>
    </section>
</template>
<script>
import NProgress from 'nprogress'
import Api from '../../api/index'
import { mapActions } from 'vuex'
export default {
    data() {
        return {
            total: 0,
            currentPage: 1,
            pageSize: 20,
            tableData: [],
            listLoading: false
        }
    },
    methods: {
        handleView(row) {
            this.get_Role(row.channelName);
            sessionStorage.setItem('channelName', JSON.stringify(row.channelName));
            this.$router.push('/channel/detail/account/' + row.id)
        },
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
                pageNum: this.currentPage
            }
            Api.getChannelList(queryObj).then(res => {
                this.tableData = res.data.result.list;
                this.tableData.map( (val,idx) => {
                    val.type = val.type == 1?'营销':'通知'
                })
                this.total = res.data.result.total - 0
                this.listLoading = false
                NProgress.done()
            }).catch(err => {
                this.listLoading = false
                NProgress.done()
                /*this.$message.error('操作失败，' + err.statusText)*/
            })
        },
        handleLaunch(row) {
            this.$confirm('确认启动该通道吗？', '提示', {}).then(() => {
                Api.launchChannel({ channelId: row.id }).then(res => {
                    if (res.code==0) {
                        this.$notify({
                            title: '成功',
                            message: '启动通道成功',
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
        handleDisabled(row) {
            this.$confirm('确认禁用该通道吗？', '提示', {}).then(() => {
                Api.disabledChannel({ channelId: row.id }).then(res => {
                    if (res.code==0) {
                        this.$notify({
                            title: '成功',
                            message: '禁用通道成功',
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
        //显示修改界面
        handleEdit: function(row) {
            this.$router.push('/channel/detail/modification/' + row.id)
            
        },
        //显示新增界面
        handleAdd: function() {
            this.$router.push({ path: '/channel/add' });          
        },
        ...mapActions({
            get_Role:'get_Role'
          })
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