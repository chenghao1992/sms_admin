<template>
	<div class="">
		<div class="">
			<el-form class="search-form" :inline="true"
				 :show-message="false">
				<el-form-item label="搜索">
					<el-input v-model="phone"
						icon="search" placeholder="输入手机号进行搜索">
					</el-input>
				</el-form-item>
        <el-form-item label="短信类型">
          <el-select v-model="type" placeholder="请选择短信类型">
						<el-option label="全部" value=""></el-option>
            <el-option label="营销" value="1"></el-option>
            <el-option label="通知" value="2"></el-option>
          </el-select>
        </el-form-item>
				<el-form-item label="操作时间">
					<el-date-picker v-model="operationStart" format="yyyy/MM/dd HH:mm:ss" @change="getStartTime" type="datetime" placeholder="选择日期时间">
					</el-date-picker>
					———
					<el-date-picker v-model="operationEnd" format="yyyy/MM/dd HH:mm:ss" @change="getEndtTime" type="datetime" placeholder="选择日期时间">
					</el-date-picker>
				</el-form-item>
				<el-button type="primary" @click="handleSearch">查询</el-button>
			</el-form>
		</div>
		<el-table class="" :data="rechargeList"
      highlight-current-row>
      <el-table-column
        prop="id"
				align="center"
        label="流水ID"
				show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="total"
				align="center"
        label="条数"
				show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="smsbalance"
				align="center"
        label="短信余额（条）"
				show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="username"
				align="center"
        label="用户名"
				show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="contactMobile"
				align="center"
        label="手机号"
				show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="type"
				align="center"
        label="短信类型"
				show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="operationTime"
				width="180"
				align="center"
        label="操作时间"
				show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="status"
				width="80"
				align="center"
        label="状态"
				show-overflow-tooltip>
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
import { rechargeRecord } from '../../api/api';

export default {
	data () {
		return {
			pageNum: 1,
			pageSize: 20,
			operationStart: null,
			operationEnd: null,
			total: 0,
			phone:'',
			type:'',
			rechargeList: []
      
		}
	},
	methods: {
		getStartTime(val) {
			this.operationStart = val;
		},
		getEndtTime(val) {
			this.operationEnd = val;
		},
		handleSearch () {
			this.pageNum = 1
			this.loadRechargeList()
		},
		handlePageChange (page) {
			this.pageNum = page
			this.loadRechargeList()
    },

		loadRechargeList () {
			let para = {
				userId: this.userId,
				pageNum: this.pageNum,
				pageSize: this.pageSize,
				type: this.type,
				phone:this.phone
			};
			if(this.operationStart) para.operationStart = this.operationStart;
			if(this.operationEnd) para.operationEnd = this.operationEnd;
			rechargeRecord(para).then(res => {
				var oldList = [];
				this.total = parseInt(res.data.result.total);
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
					return item;
				})
				this.rechargeList = newList;
				this.rechargeList.map( (val,idx) => {
					if(val.opType==1){
						val.total='-'+val.total
					}else{
						val.total='+'+val.total
					}
				})
			})
		}
	},
	mounted () {
		this.pageNum = 1
		this.loadRechargeList()
	}
}

</script>