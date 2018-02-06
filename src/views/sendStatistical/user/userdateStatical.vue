<template>
	<div class="user_date">
		<div class="">
			<el-form class="search-form" :model="platformTime" :rules="rules" ref="platformTime" :inline="true" :show-message="true">
                <el-form-item label="搜索用户" prop="name">
                    <el-input v-model="platformTime.name" icon="search" size="small"  placeholder="用户名"></el-input>
                </el-form-item><br/>
				<el-form-item label="选择时间" prop="year">
					<el-date-picker @change="getYear" align="right" v-model="platformTime.year" type="year" size="small" placeholder="选择年份"></el-date-picker>
				</el-form-item>年
				<el-form-item class="pt_mon" prop="month">
					<el-date-picker @change="getMonth" popper-class="hideBar" align="right" v-model="platformTime.month" format="MM" type="month" size="small" placeholder="选择月份"></el-date-picker>
				</el-form-item>月
				<el-button type="primary" @click="submitForm('platformTime')">搜索</el-button>
			</el-form>
		</div>
		<!--画图-->
		<el-row>
            <el-col :span="25">
                <div class="echart" id="chartLine_user1" style="width:100%;  height:400px; margin-top:10px"></div>
                <div class="word_total" v-if="instruction">
                    <span class="p_firt_sp">营销短信发送总量：{{mark_total}}条</span>
                    <span>通知短信发送总量：{{notice_total}}条</span>
                </div>
            </el-col>
        </el-row>
	</div>
</template>

<script>
  import echarts from 'echarts';
  import { sendStatistical } from '../../../api/api';
  export default {
  	data(){
		return{
			platformTime:{
                name:'',
				year:'',
				month:''
			},
            formatDate:{
                year:'',
                month:''
            },
            rules:{
                 name: [
                    { required: true, message: '请输入用户名', trigger: 'change' }
                  ],
                 year: [
                    { type: 'date',required: true, message: '请选择年份', trigger: 'change' }
                  ],
                  month: [
                    { type: 'date',required: true, message: '请选择月份', trigger: 'change' }
                  ],
            },
			chartLine: null,
            dataX: [],
            dataY:[],
            dataY1:[],
            txt:'',
            mark_total:0,
            notice_total:0,
            instruction:false
		}
  	},
    methods: {
            getYear(Y){
                this.formatDate.year = Y;
            },
            getMonth(M){
                this.formatDate.month = M;
            },
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                  if (valid) {
                    this.dataX = [];
                    this.dataY = [];
                    this.dataY1 = [];
                    this.mark_total = 0;
                    this.notice_total = 0;
                    let params = {statisticsType:2,year:this.formatDate.year,month:this.formatDate.month,user:this.platformTime.name};
                    this.getDatas(params);
                  } else {
                    console.log('error submit!!');
                    return false;
                  }
                });
            },
            getDatas(dat){
                sendStatistical(dat).then(res => {
                    let {code,msg,result} = res;
                    if(code == 0){
                        if(result.length!=0){
                           this.dataX = result.dataX;
                           this.dataY = result.dataY_1;
                           this.dataY1 = result.dataY_2;
                           this.mark_total = result.total_1;
                           this.notice_total = result.total_2;
                        }
                        if(this.formatDate.month) this.txt = this.formatDate.month+'月';
                        this.instruction = true;
                        this.drawCharts();
                    }else if(code!=0 && code!=105){
                        this.$message(msg);
                    }
                })
            },
            drawLineChart() {
                let $echartsDOM = document.getElementById('chartLine_user1');
                if(!$echartsDOM) return;
                this.chartLine = echarts.init($echartsDOM);
                this.chartLine.setOption({
                    title: {
                        text: this.txt,
                        left:'40%'
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data: ['营销短信','通知短信'],
                        right:"5%"
                    },
                    grid: {
                        left: '2%',
                        right: '3%',
                        bottom: '0%',
                        containLabel: true
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: this.dataX,
                        name:'时间',
                        /*axisLabel:{
                            formatter:function(val){
                                 return val.split("-").join("\n"); //横轴信息文字竖直显示
                            }
                        }*/
                    },
                    yAxis: {
                        type: 'value',
                        name: '数量',//可以填写单位
                        axisLabel:{
                            rotate:0
                        }
                    },
                    series: [
                        {
                            name: '营销短信',
                            type: 'line',
                            symbol:'none',
                            data: this.dataY,
                            itemStyle : {  
                                normal : {  
                                    color:'#0bcf0b',
                                    lineStyle:{  
                                        color:'#0bcf0b'  
                                    }  
                                }  
                            }, 
                        },
                        {
                            name: '通知短信',
                            type: 'line',
                            symbol:'none',
                            data: this.dataY1,
                            itemStyle : {  
                                normal : {  
                                    color:'#ff3200',
                                    lineStyle:{  
                                        color:'#ff3200'  
                                    }  
                                }  
                            }, 
                        }
                    ]
                });
            },
            drawCharts() {
                this.drawLineChart()
            },
        },
    mounted(){
		let mu = document.getElementById('chartLine_user1');
		let fu_mu_wid = document.getElementsByClassName('content-container')[0];
		mu.style.width=fu_mu_wid.offsetWidth-56+'px';
		let myDate = new Date();
        let date = myDate.getDate();
        for(let i=0;i<date;i++){
            this.dataX.push(i+1);
        }
        this.drawCharts();
    },
    updated: function () {
        /*this.drawCharts()*/
    }
  }
</script>
<style lang="scss">
	.hideBar .el-date-picker__header{
		display: none;
	}
    .user_date{
        .word_total{
            margin: 30px 0 0 35px;
            span{
                font-size: 16px;
                color: #ff0000;
            }
            .p_firt_sp{
                margin-right: 20px;
            }
        }
    }
</style>