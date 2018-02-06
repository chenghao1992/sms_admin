<template>
	<div class="send_head">
		<div class="head_line">发送报表</div>
	  	<el-tabs v-model="activeName" @tab-click="tabsClcikFun">
	    	<el-tab-pane label="按平台统计" name="first">
	    		<platformdate-mon v-if="tabFirst"></platformdate-mon>
	    	</el-tab-pane>
	    	<el-tab-pane label="按用户统计" name="second">
	    		<userdate-mon v-if="tabSecond"></userdate-mon>
	    	</el-tab-pane>
	    	<el-tab-pane label="按通道统计" name="third">
	    		<channeldate-mon v-if="tabThird"></channeldate-mon>
	    	</el-tab-pane>
	  	</el-tabs>
	</div>
</template>
<script>
  import platformdateMon from './platform/platformdateMon';
  import userdateMon     from './user/userdateMon';
  import channeldateMon  from './channel/channeldateMon'
  export default {
  	components: { platformdateMon,userdateMon,channeldateMon },
  	data() {
      return {
        activeName: 'first',
        tabFirst:true,
        tabSecond:false,
        tabThird:false
      };
    },
    methods: {
     	tabsClcikFun(tab){
     		if(tab.name == 'first'){
				this.tabFirst = true;
				this.tabSecond = false;
				this.tabThird = false;
     		}else if(tab.name == 'second'){
				this.tabFirst = false;
				this.tabSecond = true;
				this.tabThird = false;
     		}else if(tab.name == 'third'){
				this.tabFirst = false;
				this.tabSecond = false;
				this.tabThird = true;
     		}
     	}
    },
    mounted(){
    	
    }
  }
</script>
<style  scoped lang="scss">
	.send_head{
		.head_line{
			color:#000;
			font-size: 16px;
			padding-left:16px;
			height:50px;
			font-weight: bold;
			line-height:50px;
			border-bottom: 1px solid #000;
			margin-bottom:30px;
		}
	}
</style>
