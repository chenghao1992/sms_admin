<template>
	<div class="user_date_mon">
		<el-tabs  type="card" v-model="activeName" @tab-click="userTimeClick">
		    <el-tab-pane label="日报表" name="first">
		    	<userdate-statical v-if="userFirst"></userdate-statical>
		    </el-tab-pane>
		    <el-tab-pane label="月报表" name="second">
		    	<usermon-statical v-if="userSecond"></usermon-statical>
		    </el-tab-pane>
		</el-tabs>
	</div>
</template>
<script>
  import userdateStatical from './userdateStatical';
  import usermonStatical  from './usermonStatical'
  export default {
  	components: { userdateStatical, usermonStatical},
  	data() {
      return {
        activeName: 'first',
        userFirst:true,
        userSecond:false
      }
    },
    methods: {
     	userTimeClick(tab){
			if(tab.name=='first'){
				this.userFirst = true;
				this.userSecond = false;
			}else if(tab.name=='second'){
				this.userFirst = false;
				this.userSecond = true;
			}
     	}
    },
    mounted(){
    	
    }
  }
</script>
<style  lang="scss">
	.user_date_mon{
		margin-top: 10px;
		.el-tabs__header{
			border: 0;
		}
		.el-tabs__item.is-active{
			border-bottom-color:#d1dbe5!important;
			border-radius:4px!important;
		}
		.el-tabs__item{
			height: 30px;
			line-height: 30px;
			padding:0 16px;
		}
	}
</style>