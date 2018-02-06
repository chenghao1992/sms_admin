<template>
    <div class="channel_date">
        <div class="">
            <el-form class="search-form" :model="platformTime" :rules="rules" ref="platformTime" :inline="true" :show-message="true">
                <el-form-item label="选择时间" prop="year">
                    <el-date-picker @change="getYear" align="right" v-model="platformTime.year" type="year" size="small" placeholder="选择年份"></el-date-picker>
                </el-form-item>年
                <el-button type="primary" @click="submitForm('platformTime')">搜索</el-button>
            </el-form>
        </div>
        <!--画图-->
        <el-row>
            <el-col :span="25">
                <div class="echart" id="chartLine_channel2" style="width:100%;  height:500px; margin-top:10px"></div>
                <div class="word_total" v-if="instruction">
                    <span v-for="item in staticTotal" class="p_firt_sp">{{item.name}}发送总量：{{item.total}}条</span>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
  import echarts from 'echarts';
  import { sendStatistical ,getChannelsLists} from '../../../api/api';
  export default {
    data(){
        return{
            platformTime:{
                year:'',
                month:''
            },
            formatDate:{
                year:'',
            },
            rules:{
                 year: [
                    { type: 'date',required: true, message: '请选择年份', trigger: 'change' }
                  ],
                  month: [
                    { type: 'date',required: true, message: '请选择月份', trigger: 'change' }
                  ],
            },
            chartLine: null,
            channelNames:[],
            channelIds:[],
            results:{},
            series:[],
            dataX: [],
            staticTotal:[],
            txt:'',
            ym_total:0,
            wd_total:0,
            hy_total:0,
            instruction:false
        }
    },
    methods: {
            getYear(Y){
                this.formatDate.year = Y;
            },
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                  if (valid) {
                    this.dataX = [];
                    this.series = [];
                    this.staticTotal = [];
                    this.ym_total = 0;
                    this.wd_total = 0;
                    this.hy_total = 0;
                    let params = {statisticsType:3,year:this.formatDate.year};
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
                           this.results = result;
                           this.series = this.getSeries(this.channelIds,this.results);
                           this.staticTotal = this.getStaticTotal(this.channelIds,this.results);
                        }
                        
                        if(this.formatDate.year) this.txt = this.formatDate.year+'年';
                        this.instruction = true;
                        this.drawCharts();
                    }else{
                        this.$message(msg);
                    }
                })
            },
            getSeries(id,result){
                var serie = [];
                for(let i=0;i<id.length;i++){
                   var item={}
                   for(let key in result){
                        if(key == 'dataY_'+id[i].split('+')[0]){
                            item.data = result[key];
                            item.type = 'line';
                            item.symbol='none';
                            item.name = id[i].split('+')[1]
                        }
                   }
                   serie.push(item)
                }
                return serie;
            },
            getStaticTotal(id,result){
                var serie = [];
                for(let i=0;i<id.length;i++){
                   var item={}
                   for(let key in result){
                        if(key == 'total_'+id[i].split('+')[0]){
                            item.total = result[key];
                            item.name = id[i].split('+')[1]
                        }
                   }
                   serie.push(item)
                }
                return serie;
            },
            drawLineChart() {
                let $echartsDOM = document.getElementById('chartLine_channel2');
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
                        data: this.channelNames,
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
                    },
                    yAxis: {
                        type: 'value',
                        name: '数量',//可以填写单位
                        axisLabel:{
                            rotate:0
                        }
                    },
                    series: this.series
                });
            },
            drawCharts() {
                this.drawLineChart()
            },
        },
    mounted(){
        getChannelsLists().then( res=> {
            let {data} = res;
            if(data.code==0){
                data.result.map( (val,index) => {
                    this.channelNames.push(val.channelName);
                    this.channelIds.push(val.id+'+'+val.channelName)
                })
            }
            let mu = document.getElementById('chartLine_channel2');
            let fu_mu_wid = document.getElementsByClassName('content-container')[0];
            mu.style.width=fu_mu_wid.offsetWidth-56+'px';
            let myDate = new Date();
            let timeObj = {};
            timeObj.year = myDate.getFullYear(); 
            this.txt = timeObj.year+'年';
            let par = {statisticsType:3,year:timeObj.year}
            this.getDatas(par);
        })
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
    .channel_date{
        .word_total{
            margin: 30px 0 0 35px;
            line-height: 24px;
            span{
                font-size: 16px;
                color: #ff0000;
            }
            .p_firt_sp{
                margin-right: 30px;
            }
        }
    }
</style>

