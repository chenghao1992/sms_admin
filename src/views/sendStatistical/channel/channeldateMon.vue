<template>
	<div class="channel_date_mon">
		<el-tabs  type="card" v-model="activeName" @tab-click="channelTimeClick">
		    <el-tab-pane label="日报表" name="first">
		    	<channeldate-statical v-if="channelFirst"></channeldate-statical>
		    </el-tab-pane>
		    <el-tab-pane label="月报表" name="second">
		    	<channelmon-statical v-if="channelSecond"></channelmon-statical>
		    </el-tab-pane>
		</el-tabs>
	</div>
</template>
<script>
  import channeldateStatical from './channeldateStatical';
  import channelmonStatical  from './channelmonStatical'
  export default {
  	components: { channeldateStatical, channelmonStatical},
  	data() {
      return {
        activeName: 'first',
        channelFirst:true,
        channelSecond:false
      };
    },
    methods: {
     	channelTimeClick(tab){
			if(tab.name=='first'){
				this.channelFirst = true;
				this.channelSecond = false;
			}else if(tab.name=='second'){
				this.channelFirst = false;
				this.channelSecond = true;
			}
     	}
    },
    mounted(){
    	
    }
  }
</script>
<style  lang="scss">
	.channel_date_mon{
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