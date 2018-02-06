<template>
	<div class="date_mon">
		<el-tabs  type="card" v-model="activeName" @tab-click="platformTimeClick">
		    <el-tab-pane label="日报表" name="first">
		    	<platformdate-statical v-if="platformFirst"></platformdate-statical>
		    </el-tab-pane>
		    <el-tab-pane label="月报表" name="second">
		    	<platformmon-statical v-if="platformSecond"></platformmon-statical>
		    </el-tab-pane>
		</el-tabs>
	</div>
</template>
<script>
  import platformdateStatical from './platformdateStatical';
  import platformmonStatical  from './platformmonStatical'
  export default {
  	components: { platformdateStatical, platformmonStatical},
  	data() {
      return {
        activeName: 'first',
        platformFirst:true,
        platformSecond:false,
      };
    },
    methods: {
     	platformTimeClick(tab, event){
     		if(tab.name=='first'){
				this.platformFirst = true;
				this.platformSecond = false;
     		}else if(tab.name=='second'){
				this.platformFirst = false;
				this.platformSecond = true;
     		}
     	}
    },
    mounted(){
    	
    }
  }
</script>
<style  lang="scss">
	.date_mon{
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