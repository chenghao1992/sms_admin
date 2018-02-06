<template>
	<section>
		<el-row>
			<el-col :span="24">
				<el-button type="primary">屏蔽词列表</el-button>
				<el-button @click="dialogAddFormVisible = true">添加屏蔽词</el-button>
				<el-button @click="dialogImportFormVisible = true">导入屏蔽词</el-button>
			</el-col>
		</el-row>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="searchForm" :show-message="false">
				<el-col :span="0">
					<el-form-item>短信类型</el-form-item>
					<el-form-item>
						<template>
						  <el-select v-model="searchForm.type" placeholder="全部">
						    <el-option v-for="item in typeArr" :value="item">
						    </el-option>
						  </el-select>
						</template>
					</el-form-item>
				</el-col>
				<el-col :span="0">
					<el-form-item>屏蔽词名称</el-form-item>
					<el-form-item><el-input placeholder="屏蔽词名称" v-model="searchForm.content"></el-input></el-form-item>
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
				<el-form-item>
					<!--<el-button type="primary" @click="handleExport">导出</el-button>-->
					<a class="exportAdmin" download @click="handleExport" :href="aHref">导出</a>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="shieldList" highlight-current-row v-loading="loading" style="width: 100%;">
			<el-table-column prop="content" label="屏蔽词名称" align="center" width="200">
    		</el-table-column>
			<el-table-column prop="type" label="应用短信类型" align="center" width="200">
			</el-table-column>
			<el-table-column prop="createTime" label="添加时间" align="center" width="300">
			</el-table-column>
			<el-table-column prop="opt" label="操作" align="center" width="200">
				<template scope="scope">
					<el-button type="text" size="small" @click="handleStopItem(scope.row)" v-show="!scope.row.status">停用</el-button>
					<el-button type="text" size="small" @click="handleStartItem(scope.row)" v-show="scope.row.status">启用</el-button>
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

		<el-dialog title="添加屏蔽词" :visible.sync="dialogAddFormVisible">
			<el-form :model="addForm" :rules="formRules" ref="addForm" label-width="80px">
			    <el-form-item label="名称" prop="content">
			      <el-input v-model="addForm.content"></el-input>
			    </el-form-item>
			    <el-form-item label="短信类型" prop="type">
			    	<el-checkbox-group v-model="addForm.type">
						<el-checkbox label="1">营销</el-checkbox>
						<el-checkbox label="2">通知</el-checkbox>
					</el-checkbox-group>
			    </el-form-item>
			  </el-form>
			  <div slot="footer" class="dialog-footer">
			  	<el-button type="primary" @click="handleAddSubmit('addForm')">确 定</el-button>
			    <el-button @click="closeDialog('addForm')">取 消</el-button>
			</div>
		</el-dialog>

		<el-dialog title="导入屏蔽词" :visible.sync="dialogImportFormVisible">
		    <input type="file" name="file" id="fileInfo">
		    <div slot="footer" class="dialog-footer">
			  	<el-button type="primary" @click="handleImportSubmit()">确定</el-button>
			    <el-button @click="dialogImportFormVisible = false">取 消</el-button>
			</div>
		</el-dialog>	

	</section>
</template>
<style lang="scss">
@import '~scss_common';
.el-dialog{
	width: 500px;
}
.el-table{
	.el-button--text{
		margin-left:10px;
	}
}
 .exportAdmin{
    text-decoration: none;
    display: inline-block;
    height: 34px;
    width: 58px;
    border: 1px solid #999;
    border-radius: 3px;
    line-height: 36px;
    text-align: center;
    cursor: pointer;
}
</style>
<script>
	import { getShieldList, removeShieldItem, stopShieldItem, startShieldItem, addShield, exportShield, importShield } from '../api/api';
	import qs from 'qs'

	export default {
		data() {
			return {
				aHref:'',
				sParams:{},
				loading: false,
				dialogAddFormVisible: false,
				dialogImportFormVisible: false,
				isUploadSuc: false,
				searchHasVal: false,
				shieldList: [],
				typeArr: ['营销','通知'],
				page: {
					num: 1,
					size: 20,
					total: 0
				},
				searchForm: {
					type: '',
					content: '',
					startTime: '',
					endTime: ''
				},
		        addForm: {
		          content: '',
		          type: []
		        },
		        formRules: {
		        	content: [
			            { required: true, message: '请输入名称', trigger: 'blur'}
			        ],
			        type: [
			            { type: 'array', required: true, message: '请至少选择一个短信类型', trigger: 'change'}
			        ]
		        },
		        fileList:[]  
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
				/*if (!this.searchForm.type && !this.searchForm.content && !this.searchForm.startTime && !this.searchForm.endTime) return;*/
				this.searchHasVal = true;
				this.sParams = {
					type: this.searchForm.type ? this.typeArr.indexOf(this.searchForm.type) + 1 : '',
					content: this.searchForm.content,
	          		startTime: this.searchForm.startTime,
	          		endTime: this.searchForm.endTime
				}
				this.getShieldList(this.sParams);
			},
			handleExport () {
				this.sParams = {
					type: this.searchForm.type ? this.typeArr.indexOf(this.searchForm.type) + 1 : '',
					content: this.searchForm.content,
	          		startTime: this.searchForm.startTime,
	          		endTime: this.searchForm.endTime
				}
				this.aHref = "/sms-admin/sensitiveWordRecord/exportSensitiveWord?"+ qs.stringify(this.sParams)
				/*exportShield(this.sParams).then(res => {
					let code = res.data.code || null;
	                if(code && code==105){
	                     this.$router.push({ path: '/login' });
	                     return;
	                }
					location.href = res.request.responseURL;
				})*/
			},
			handleStopItem (item) {	
				stopShieldItem({
					id: item.id
				}).then(res => {
					this.handleStatusResult(res.data.code, item);
				})
			},
			handleStartItem (item) {
				startShieldItem({
					id: item.id
				}).then(res => {
					this.handleStatusResult(res.data.code, item);
				})
			},
			handleRemoveItem (item) {
				removeShieldItem({
					id: item.id
				}).then(res => {
					if (res.data.code == 0) {
						this.getShieldList();
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
				
				this.getShieldList(params);
			},
			handleAddSubmit (formName) {
				let type;
		    	if (this.addForm.type.length < 2) {
		    		type = this.addForm.type.toString();
		    	} else {
		    		type = 3;
		    	}

				this.$refs[formName].validate((valid) => {
		            if (!valid) return;

		          	addShield({
		          		content: this.addForm.content,
		          		type: type,
		          	}).then(res => {
		          		if (res.data.code == 0) {
			          		this.dialogAddFormVisible = false;
										this.getShieldList();
										this.$refs[formName].resetFields();
									} else if(res.data.code!=0 && res.data.code!=105){
										this.$message(res.data.msg);
									}
		          	})
		        }); 
			},
			closeDialog(formName){
				this.dialogAddFormVisible = false;
				this.$refs[formName].resetFields();
			},
		    handleImportSubmit () {
		    	let formData = new FormData();
		    	formData.append('file', document.getElementById('fileInfo').files[0]);
		    	if (formData.get('file') == 'undefined') return;

	      		importShield(formData).then(res => {
              if (res.data.code == 0) {
	        			this.dialogImportFormVisible = false;
	        			this.getShieldList();
          		} else if(res.data.code!=0 && res.data.code!=105){
          			this.$message(res.data.msg);
          		}
            });
		    },
			handleStatusResult (code, item) {
				if (code == 0) {
					item.status = !item.status;
				}
			},
			//获取屏蔽词列表
			getShieldList (params) {
				params = params || {};

				this.loading = true;
				getShieldList(params).then(res => {
					if (res.data.code == 0) {
						let result = res.data.result;
						let list = result.list;
						let shieldList = [];

						for (let i=0; i<list.length; i++) {
							list[i].type = this.typeArr[list[i].type - 1];
							shieldList.push(list[i]);
						}

						this.shieldList = shieldList;
					
						if (result.pageNum == 1) {
							this.page.total = parseInt(result.total);
						}

						this.loading = false;
					}
				})
			}

		},
		mounted() {
			this.getShieldList();
		}
	};

</script>