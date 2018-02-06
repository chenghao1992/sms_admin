<template>
	<section>
		<el-row>
			<el-col :span="24">
				<el-button type="primary">号段列表</el-button>
				<el-button @click="dialogAddFormVisible = true">添加号段</el-button>
			</el-col>
		</el-row>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="searchForm" :show-message="false">
				<el-col :span="0">
					<el-form-item>运营商类型</el-form-item>
					<el-form-item>
						<template>
						  <el-select v-model="searchForm.operator" placeholder="全部">
						    <el-option v-for="item in operatorVal" :value="item">
						    </el-option>
						  </el-select>
						</template>
					</el-form-item>
				</el-col>
				<el-col :span="0">
					<el-form-item>号段</el-form-item>
					<el-form-item><el-input placeholder="请输入号段搜索" v-model="searchForm.segment"></el-input></el-form-item>
				</el-col>
				<el-col :span="0">
					<el-form-item>添加时间</el-form-item>
					<el-form-item>
					    <el-date-picker v-model="searchForm.startTime" type="datetime" placeholder="选择日期时间" @change="handleStartTime"></el-date-picker> -- 
					    <el-date-picker v-model="searchForm.endTime" type="datetime" placeholder="选择日期时间" @change="handleEndTime"></el-date-picker>
					</el-form-item>
				</el-col>
				<el-form-item>
					<el-button type="primary" @click="handleSearch">查询</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="signalList" highlight-current-row v-loading="loading" style="width: 100%;">
			<el-table-column prop="segment" label="号段" align="center" width="200">
    		</el-table-column>
			<el-table-column prop="operator" label="运营商" align="center" width="200">
			</el-table-column>
			<el-table-column prop="channelName" label="支持通道" align="center" width="200">
			</el-table-column>
			<el-table-column prop="createTime" label="添加时间" align="center" width="300">
			</el-table-column>
			<el-table-column prop="opt" label="操作" align="center" width="200">
				<template scope="scope">
        			<el-button type="text" size="small" @click="handleRemoveItem(scope.row)">删除</el-button>
        		</template>
			</el-table-column>
			<el-table-column prop="" label="" align="center" min-width="200">
			</el-table-column>
		</el-table>
		<div class="table-pager">
	    <el-pagination class="pager" :current-page="page.num" :page-size="page.size" :total="page.total" @current-change="handlePageChange" layout="total, prev, pager, next">
	    </el-pagination>
	    </div>

		<el-dialog title="添加号段" :visible.sync="dialogAddFormVisible" @close="resetForm('addForm')">
			<el-form :model="addForm" :rules="formRules" ref="addForm" label-width="80px">
			    <el-form-item label="号段" prop="segment">
			      <el-input v-model="addForm.segment" maxlength=4></el-input>
			    </el-form-item>
			    <el-form-item label="运营商" prop="operator">
			    	<el-checkbox-group v-model="addForm.operator">
					    <el-checkbox label="1">移动</el-checkbox>
					    <el-checkbox label="2">电信</el-checkbox>
					    <el-checkbox label="3">联通</el-checkbox>
					    <el-checkbox label="4">卫星通信</el-checkbox>
					    <el-checkbox label="5">虚拟运营商</el-checkbox>
					</el-checkbox-group>
			    </el-form-item>
			    <el-form-item label="支持通道" prop="channel">
			    	<el-checkbox-group v-model="addForm.channel">
			    	<span v-for="item in channelList" class="channel_item">
							<el-checkbox :label="item.id"></el-checkbox>
							<span>{{item.channelName}}</span>
						</span>
					</el-checkbox-group>
			    </el-form-item>
			  </el-form>
			  <div slot="footer" class="dialog-footer">
			    <el-button @click="resetForm('addForm')">取 消</el-button>
			    <el-button type="primary" @click="handleAddSubmit('addForm')">确 定</el-button>
			</div>
		</el-dialog>
	</section>
</template>
<style lang="scss">
@import '~scss_common';
.el-checkbox+.el-checkbox{
	margin-left:10px;
}
.channel_item{
	margin-right:14px;
	.el-checkbox{
		margin-right:1px;
	}
	.el-checkbox__label{
		display:none;
	}
}
</style>
<script>
	import { getSignalList, removeSignalItem, addSignal, getSignalChannel } from '../api/api';

	export default {
		data() {
			return {
				sParams:{},
				loading: false,
				dialogAddFormVisible: false,
				searchHasVal: false,
				signalList: [],
				channelList: [],
				operatorVal: ['移动','电信','联通','卫星通信','虚拟运营商'],
				channelVal: {},
				page: {
					num: 1,
					size: 20,
					total: 0
				},
				searchForm: {
					operator: '',
					segment: '',
					startTime: '',
					endTime:''
				},
        addForm: {
          segment: '',
          operator: [],
          channel: []
        },
        formRules: {
        	segment: [
	            { required: true, message: '请输入号段', trigger: 'blur'}
	        ],
	        operator: [
	            { type: 'array', required: true, message: '请选择运营商', trigger: 'change' }
	        ],
	        channel: [
	            { type: 'array', required: true, message: '请至少选择一个支持通道', trigger: 'change'}
	        ]
        }
			}
		},
		methods: {
			handleStartTime (dateTime) {
				this.searchForm.startTime = dateTime;
			},
			handleEndTime (dateTime) {
				this.searchForm.endTime = dateTime;
			},
			handleSearch () {
				if (!this.searchForm.operator && !this.searchForm.segment && !this.searchForm.startTime&& !this.searchForm.endTime) return;
				this.searchHasVal = true;
				this.sParams = {
					operator: this.searchForm.operator ? this.operatorVal.indexOf(this.searchForm.operator) + 1 : '',
					segment: this.searchForm.segment,
	          		startTime: this.searchForm.startTime,
	          		endTime: this.searchForm.endTime
				}
				this.getSignalList(this.sParams);
			},
			handleRemoveItem (item) {
				removeSignalItem({
					id: item.id
				}).then(res => {
					if (res.data.code == 0) {
						this.getSignalList();
					}
				})
			},
			handlePageChange (page) {
				let params = {};
				this.page.num = page;
				if(!this.searchHasVal) {
					params = {
						pageNum: page
					}
				} else {
					params = this.sParams;
					params.pageNum = page;
				}
				
				this.getSignalList(params);
			},
			handleAddSubmit (formName) {
				this.$refs[formName].validate((valid) => {
		            if (!valid) return;

		          	addSignal({
		          		segment: this.addForm.segment,
		          		operatorArray: this.addForm.operator.toString(),
		          		channelArray: this.addForm.channel.toString(),
		          	}).then(res => {
		          		if (res.data.code == 0) {
			          		this.dialogAddFormVisible = false;
			          		this.page.num = 1;
							this.getSignalList();
						}
		          	})
		        });
			},
			resetForm(formName){
				this.dialogAddFormVisible = false;
				this.$refs[formName].resetFields();
			},
			getSignalChannel (cb) {
				getSignalChannel().then(res => {
					if (res.data.code == 0) {
						var result = res.data.result;
						this.channelList = result;
						result.forEach((item) => {
							this.channelVal[item.id] = item.channelName;
						})
						if(cb instanceof Function) {
							cb();
						}
					}
				})
			},
			//获取号段列表
			getSignalList (params) {
				params = params || {};

				this.loading = true;
				getSignalList(params).then(res => {
					if (res.data.code == 0) {
						let result = res.data.result;
						let list = result.list;
						let signalList = [];

						for (let i=0; i<list.length; i++) {
							list[i].operator = this.operatorVal[list[i].operator - 1];
							list[i].channelName = this.channelVal[list[i].channelId.toString()];
							signalList.push(list[i]);
						}
						this.signalList = signalList;
					
						if (result.pageNum == 1) {
							this.page.total = parseInt(result.total);
						}

						this.loading = false;
					}
				})
			}

		},
		mounted() {
			this.getSignalChannel(this.getSignalList);
		}
	};

</script>