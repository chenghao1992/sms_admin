<template>
    <div class="addChannel">
        <el-form :model="editForm" label-width="120px" style="width:60%" label-position="left" :rules="editFormRules" ref="editForm">
            <el-form-item label="通道类型" prop="type">
                <el-select v-model="editForm.type" placeholder='请选择通道'>
                    <el-option label="营销" value="1"></el-option>
                    <el-option label="通知" value="2"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="通道名称" prop="channelName">
                <el-input v-model="editForm.channelName" auto-complete="off" placeholder="请输入通道名称"></el-input>
            </el-form-item>
            <el-form-item label="通道识别码" prop="channelIdDesc">
                <el-input v-model="editForm.channelIdDesc" auto-complete="off" placeholder="请输入通道识别码"></el-input>
            </el-form-item>
            <el-form-item label="接口URL" prop="apiUrl">
                <el-input v-model="editForm.apiUrl" placeholder="请输入通道接口URL" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="长短信" prop="longSms">
                <el-input v-model.number="editForm.longSms" placeholder="请输入长短信字数" auto-complete="off"></el-input>
                 <span>输入0即代表不支持长短信 </span>
            </el-form-item>
            <el-form-item label="批量短信" prop="batchSms">
                <el-input v-model.number="editForm.batchSms" placeholder="请输入批量短信条数" auto-complete="off"></el-input>
                <span class ="spech"> 输入0即代表不支持批量短信</span>
            </el-form-item>
            <el-form-item label="分隔符" prop="separatorSipl">
                <el-input v-model="editForm.separatorSipl" placeholder="请输入批量短信号码分隔符，默认分隔符英文逗号" auto-complete="off"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click.native="editSubmit" >保 存</el-button>
            <el-button @click.native="closeDialog('editForm')">取 消</el-button>
        </div>
    </div>
</template>
<script>
import { saveChannel } from '../../api/api';

export default {
    data() {
         var validNumberB = (rule, value, callback) => {
            let reg = /^[0-9]*[0-9][0-9]*$/;
            if (value === '') {
                callback('请输入批量短信条数')
            } else if (!reg.test(value)) {
                callback('请输入大于等于0的整数')
            } else {
               callback()
            }
        }
        var validNumberL = (rule, value, callback) => {
            let reg = /^[0-9]*[0-9][0-9]*$/;
            if (value === '') {
                callback('请输入长短信字数')
            } else if (!reg.test(value)) {
                callback('请输入大于等于0的整数')
            } else {
                callback();
            }
        }
        return {
            editForm: {
                type:'',
                id: '',
                channelIdDesc: '',
                channelName: '',
                longSms: '',
                batchSms: '',
                separatorSipl: '',
                apiUrl: ''
            },
            editFormRules: {
                type: [{
                    required: true,
                    message: '请选择通道',
                    trigger: 'change,blur'
                }],
                channelIdDesc: [{
                    required: true,
                    message: '请输入通道识别码',
                    trigger: 'blur'
                }],
                channelName: [{
                    required: true,
                    message: '请输入通道名称',
                    trigger: 'blur'
                }],
                apiUrl: [{
                    required: true,
                    message: '请输入接口URL',
                    trigger: 'blur'
                }],
                longSms: [{
                    required: true,
                    validator: validNumberL,
                    trigger: 'blur'
                }],
                batchSms: [{
                    required: true,
                    validator: validNumberB,
                    trigger: 'blur'
                }],
                separatorSipl: [{
                    message: '请输入分隔符',
                    trigger: 'blur'
                }]
            },
        }
    },
    methods: {
       /*取消*/
       closeDialog(formName){
         this.$refs[formName].resetFields();
         this.$router.push({ path: '/channel/list' });
       },
       /*保存*/
       editSubmit: function() {
            this.$refs.editForm.validate((valid) => {
                if (valid) {
                     saveChannel(this.editForm).then( res => {
                        let {code,msg} = res;
                        if(code == 0){
                            this.$message({
                              message: msg,
                              type: 'success'
                            });
                            this.$router.push({ path: '/channel/list' });
                        }else if(code!=0 && code!=105){
                            this.$message.error(msg);
                        }
                    })
                }
            })
        },
    },
}
</script>
<style scoped>
    .addChannel{
        padding: 30px 0 0 20px;
    }
    span{
        position: absolute;
        right: -180px;
        top: 3px;
        color: #bfcbd9
    }
    span.spech{
        right: -195px;
    }
</style>
