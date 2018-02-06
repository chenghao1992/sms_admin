<template>
	<div class="">
		<div class="">
			<el-form class="search-form" :inline="true" :show-message="false">
				<el-form-item label="类型">
					<el-select v-model="type" placeholder="请选择类型">
						<el-option label="全部" value=""></el-option>
						<el-option label="营销" value="1"></el-option>
						<el-option label="通知" value="2"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="操作日期">
					<el-date-picker v-model="operationStart" format="yyyy/MM/dd HH:mm:ss" @change="getStartTime" type="datetime" placeholder="选择日期时间">
					</el-date-picker>
					———
					<el-date-picker v-model="operationEnd" format="yyyy/MM/dd HH:mm:ss" @change="getEndtTime" type="datetime" placeholder="选择日期时间">
					</el-date-picker>
				</el-form-item>
				<el-button type="primary" @click="handleSearch">查询</el-button>
			</el-form>
		</div>
		<el-table class="" :data="purchaseList" v-loading="loadingList">
			<el-table-column prop="total" align="center" label="消费条数" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="type" align="center" label="类型" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="consumeDay" align="center" label="消费日期" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="status" align="center" label="状态" show-overflow-tooltip>
			</el-table-column>
		</el-table>
		<div class="table-pager">
			<el-pagination class="pager" :current-page="pageNum" :page-size="pageSize" :total="total" @current-change="handlePageChange" layout="total, prev, pager, next">
			</el-pagination>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.search-form {
	padding-top: 15px;
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
import { consumeRecord } from '../../api/api';
export default {
	name: 'purchase-record',
	props: {
		id: {
			type: String,
			required: false
		}
	},
	data() {
		return {
			loadingList: false,
			userId: this.$route.params.id,
			pageNum: 1,
			pageSize: 20,
			operationStart: null,
			operationEnd: null,
			total: 0,
			type:'',
			purchaseList: []
		}
	},
	computed: {
		start_end_time() {
			return this.$refs.datePicker.displayValue
		}
	},
	methods: {
		getStartTime(val) {
			this.operationStart = val;
		},
		getEndtTime(val) {
			this.operationEnd = val;
		},
		handleSearch() {
			this.loadPurchaseList()
		},
		handlePageChange(page) {
			this.pageNum = page
			this.loadPurchaseList()
		},

		loadPurchaseList() {
			let para = {
				userId: this.userId,
				pageNum: this.pageNum,
				pageSize: this.pageSize,
				type: this.type,
				operationStart: this.operationStart,
				operationEnd: this.operationEnd,
			};
			consumeRecord(para).then(res => {
				var oldList = [];
				this.total = res.data.result.size;
				oldList = res.data.result.list;
				var newList = oldList.map((item, index) => {
					if (item.type == 1) {
						item.type = '营销';
					} else {
						item.type = '通知';
					}
					if (item.status == 0) {
						item.status = '成功'
					}else {
						item.status = '失败'
					}
					if(item.consumeDay){
						item.consumeDay = item.consumeDay.split(' ')[0];
					}
					return item;
				})
				this.purchaseList = newList;
			})
		}
	},
	mounted() {
		this.loadPurchaseList()
	}
}

</script>