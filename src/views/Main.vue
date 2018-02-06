<template>
	<div class="mes_index">
		<div class="channel_tit"><i class="fa i_icon fa-vcard-o"></i>通道状态：</div>
		<el-table height="210" :data="tableData2" style="width: 90%">
    		<el-table-column align="center" prop="channelName" label="通道名称" ></el-table-column>
    		<el-table-column align="center" prop="status" label="状态" ></el-table-column>
    		<el-table-column align="center" label="操作">
				<template scope="scope">
			       <el-button size="small" @click="operationHandel(scope.$index, scope.row)" type="text">{{scope.row.tag}}</el-button>
			    </template>
    		</el-table-column>
  		</el-table>
		<div class="quick_tit"><i class="fa i_icon fa-share-square"></i>快捷功能：</div>
		<div style="display: flex; margin-top: 20px;width:100%; height: 130px;flex-wrap:wrap;">
	        <div  class="transition-box" @click="goPath('addUser')">
	        	<div class="quik_icon_fa"><i class="fa fa-user-plus quik_icon"></i></div>
				添加用户 
	        </div>
	        <div  class="transition-box" @click="goPath('checkTemplate')">
	        	<div class="quik_icon_fa"><i class="fa fa-envelope quik_icon"></i></div>
				审核模板  
	        </div>
	        <div  class="transition-box" @click="goPath('rechargeRecord')">
	        	<div class="quik_icon_fa"><i class="fa fa-money quik_icon"></i></div>
				充值记录
	        </div>
			<div  class="transition-box" @click="goPath('sendStatistical')">
				<div class="quik_icon_fa"><i class="fa fa-line-chart quik_icon"></i></div>
				发送统计 
			</div>
	    </div>
	</div>
</template>


<script>
  import { goldIndex,goldCloseChannel,goldOpenChannel } from '../api/api';
  export default {
    methods: {
      goPath(str){
		switch(str)
		{
			case 'addUser':
			 	this.$router.push({ path: '/user/add' });
			break;
			case 'checkTemplate':
			 	this.$router.push({ path: '/template/list' });
			break;
			case 'rechargeRecord':
			 	this.$router.push({ path: '/record' });
			break;
			case 'sendStatistical':
			 	this.$router.push({ path: '/send/statistical' });
			break;
		}
      },		
      operationHandel(index, row){
      	this.$confirm('确认'+row.tag+'通道？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
        	switch(row.tag){
        		case '禁用':
        			this.closeRequest(row.id);
        		break;
        		case '开启':
        			this.openRequest(row.id);
        		break;
        	}
        }).catch(() => {
                 
        });
      },
      requestIndex(){
		goldIndex().then(res => {
            let { data } = res;
			if(data.code == 0){
				for(let i=0;i<data.result.length;i++){
					let channelObj = {};
					channelObj.channelName = data.result[i].channelName;
					channelObj.id = data.result[i].id;
					channelObj.status = data.result[i].status == 1?'禁用':'开启';
					channelObj.tag = data.result[i].status == 1?'开启':'禁用';
					this.tableData2.push(channelObj);
				}
			}
        });
     },
     closeRequest(id){
		goldCloseChannel({channelId:id}).then(res=>{
			let {code} = res;
			if(code == 0){
				this.tableData2 = [];
				this.requestIndex();
			}
	    })
     },
     openRequest(id){
		goldOpenChannel({channelId:id}).then(res=>{
			let {code} = res;
			if(code == 0){
				this.tableData2 = [];
				this.requestIndex();
			}
        })
     }
    },
    data() {
      return {
        tableData2: [],
      }
    },
    mounted(){
    	this.requestIndex();
    }
  }
</script>

<style  lang="scss">
	.mes_index{
		padding-left: 30px;
		td{
			border-bottom: 0;
		}
		.i_icon{
			font-size: 22px;
			padding-right: 10px;
			vertical-align: bottom;
		}
		.channel_tit{
			font-size: 16px;
			font-weight: bold;
			padding:20px 0 40px 0;
		}
		.quick_tit{
			font-size: 16px;
			font-weight: bold;
			padding:60px 0 20px 0;
		}
		.transition-box {
		    margin-bottom: 10px;
		    width: 140px;
		    height: 130px;
		    border-radius: 4px;
		    background-color: #fff;
		    text-align: center;
		    color: #000;
		    box-sizing: border-box;
		    margin-right: 80px;
		    border: 1px solid #000;
		    font-size: 16px;
		    cursor: pointer;
		    .quik_icon_fa{
		    	padding: 15px 0 25px 0;
		    }
		  }
		  .transition-box:last-child{
		  	margin-right: 0;
		  }
		  .quik_icon{
		  	font-size: 36px;
		  }
	}
	
</style>