import axios from 'axios';
import qs from 'qs'
import router from '../routes'

let headers = {headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}}
// let base = 'http://testapiadmin.kaisafax.com/sms-admin';
let base = '/sms-admin';

// axios 拦截器
// http response 拦截器

axios.defaults.timeout = 5000;
axios.defaults.baseURL = '/';
axios.interceptors.response.use(
    response => {
    	if(response.data && response.data.code == 105){
    		router.replace({
                path: '/login',
            })
            return response;
    	}else{
    		return response;
    	}
    },
    error => {
        
});
// 金服登陆模块
export const goldLogin = params => { return axios.post(`${base}/smsUser/login`, qs.stringify(params),headers).then(res => res.data); };
//金色修改密码接口
export const goldChangePassword = params => { return axios.post(`${base}/user/updatePwd`, qs.stringify(params),headers).then(res => res.data); };
//金服退出登录
export const goldLogout = params => { return axios.post(`${base}/smsUser/logout`, qs.stringify(params),headers).then(res => res.data); };

export const getShieldList = params => { return axios.get(`${base}/sensitiveWordRecord/getSensitiveWordPageInfo`,{ params: params });};

export const removeShieldItem = params => { return axios.get(`${base}/sensitiveWordRecord/delSensitiveWord`,{ params: params });};

export const startShieldItem = params => { return axios.get(`${base}/sensitiveWordRecord/enableSensitiveWord`,{ params: params });};

export const stopShieldItem = params => { return axios.get(`${base}/sensitiveWordRecord/disableSensitiveWord`,{ params: params });};

export const addShield = params => { return axios.get(`${base}/sensitiveWordRecord/addSensitiveWord`, { params: params }); };

export const exportShield = params => { return axios.get(`${base}/sensitiveWordRecord/exportSensitiveWord`, { params: params }); };

export const importShield = params => { return axios.post(`${base}/sensitiveWordRecord/importSensitiveWord`, params, {headers: {'Content-Type': 'multipart/form-data'
}}); };

export const getSignalList = params => { return axios.get(`${base}/mobileSegment/getMobileSegmentPageInfo`,{ params: params });};

export const removeSignalItem = params => { return axios.get(`${base}/mobileSegment/delMobileSegment`,{ params: params });};

export const addSignal = params => { return axios.get(`${base}/mobileSegment/addMobileSegment`,{ params: params });};

export const getSignalChannel = params => { return axios.get(`${base}/mobileSegment/getProvideChannelList`,{ params: params });};

// 剩余短信条数
export const remainMess = params => { return axios.get(`${base}/balanceAlarm/getBalanceAlarm`, { params: params }); };



// 通道
export const getChannelList = params => { return axios.get(`${base}/smsChannel/channelPageInfo`, { params: params }); };

export const saveChannel = params => { return axios.post(`${base}/smsChannel/channelSaveOrUpdate`, qs.stringify(params),headers).then(res => res.data); };

export const launchChannel = params => { return axios.post(`${base}/smsChannel/channelEnable`, qs.stringify(params),headers).then(res => res.data); };

export const disabledChannel = params => { return axios.post(`${base}/smsChannel/channelDisable`, qs.stringify(params),headers).then(res => res.data); };

export const getChannelAccountList = params => { return axios.get(`${base}/smsChannel/accountPageInfo`, { params: params }); };
// 查看账号
export const checkAccount  = params => { return axios.get(`${base}/smsChannel/accountInfo`, { params: params }); };
// 查看通道详情
export const checkChannelDetails  = params => { return axios.get(`${base}/smsChannel/channelInfo`, { params: params }); };
// 通道删除账户
export const channelDeleteAccount = params => { return axios.post(`${base}/smsChannel/deleteAccount`, qs.stringify(params),headers).then(res => res.data); };

export const saveChannelAccount = params => { return axios.post(`${base}/smsChannel/accountSaveOrUpdate`, qs.stringify(params),headers).then(res => res.data); };

// 模板
export const getTemplateList = params => { return axios.get(`${base}/template/templatePageInfo`, { params: params }); };

export const auditTemplate = params => { return axios.post(`${base}/template/auditPass`, qs.stringify(params),headers).then(res => res.data); };

// 短信发送管理
export const getSMSUserList = params => { return axios.get(`${base}/smsUser/userPageInfo`, { params: params }); };

export const getSMSManagementList = params => { return axios.get(`${base}/sendManagement/sendManagementPageInfo`, { params: params }); };

export const getSMSRecordList = params => { return axios.get(`${base}/sendManagement/sendRecordPageInfo`, { params: params }); };

export const undoSendSMS = params => { return axios.post(`${base}/sendManagement/undoSend`, qs.stringify(params),headers).then(res => res.data); };


//金服首页请求数据
export const goldIndex = params => { return axios.get(`${base}/index/index`, { params: params }); };
// 金服关闭通道
export const goldCloseChannel = params => { return axios.post(`${base}/smsChannel/channelDisable`, qs.stringify(params),headers).then(res => res.data); };
// 金服开启通道
export const goldOpenChannel = params => { return axios.post(`${base}/smsChannel/channelEnable`, qs.stringify(params),headers).then(res => res.data); };
// 金服发送统计
export const sendStatistical = params => { return axios.post(`${base}/smsStatistics/getSmsStatisticsList`, qs.stringify(params),headers).then(res => res.data); };


// 金服务模糊查询
export const inputBlurSearch = params => { return axios.get(`${base}/smsUser/likeSign`, { params: params }); };
// 精确查询
export const accurateSearch = params => { return axios.get(`${base}/smsUser/bySign`, { params: params }); };
// 修改权重接口
export const modifyWeight  = params => { return axios.post(`${base}/smsUser/updateWeight`, qs.stringify(params),headers).then(res => res.data); };
// 添加用户接口
export const addUserInterfaces  = params => { return axios.post(`${base}/smsUser/userSaveOrUpdate`, qs.stringify(params),headers).then(res => res.data); };
// 客户修改前的用户详情接口
export const userDetails = params => { return axios.get(`${base}/smsUser/userInfo`, { params: params }); };
// 修改用户信息接口
export const modifyUserInfo = params => { return axios.post(`${base}/smsUser/userSaveOrUpdate`, qs.stringify(params),headers).then(res => res.data); };
//充值记录
// export const goldIndex = params => { return axios.get(`${base}/index/index`, { params: params }); };
//添加模板
export const userSaveOrUpdate = params => { return axios.post(`${base}/smsUser/userSaveOrUpdate`, qs.stringify(params),headers).then(res => res.data); };
//用户管理列表
export const userPageInfo = params => { return axios.get(`${base}/smsUser/userPageInfo`, { params: params }); };
//用户详情
export const userInfo = params => { return axios.get(`${base}/smsUser/userInfo`, { params: params }); };
//用户消费记录
export const consumeRecord = params => { return axios.get(`${base}/smsUser/consumeRecord`, { params: params }); };
//用户充值记录
export const rechargeRecord = params => { return axios.get(`${base}/smsUser/rechargeRecord`, { params: params }); };
//账户充值
export const userRecharge = params => { return axios.post(`${base}/smsUser/recharge`, qs.stringify(params),headers).then(res => res.data); };
//重置密码
export const resetPwd = params => { return axios.post(`${base}/smsUser/resetPwd`, qs.stringify(params),headers).then(res => res.data); };
//重置秘钥
export const resetSecret = params => { return axios.post(`${base}/smsUser/resetSecret`, qs.stringify(params),headers).then(res => res.data); };
//冻结用户
export const frostUser = params => { return axios.post(`${base}/smsUser/frostUser`, qs.stringify(params),headers).then(res => res.data); };
// 解冻账户
export const unfreezeAccount = params => { return axios.post(`${base}/smsUser/unfreezeUser`, qs.stringify(params),headers).then(res => res.data); };
// 用户名验证唯一性
export const usernameOnly = params => { return axios.get(`${base}/smsUser/checkUserName`, { params: params }); };
// 查询通道列表
export const getChannelsLists = params => { return axios.get(`${base}/mobileSegment/getProvideChannelList`, { params: params }); };
// 导出手机号码数
export const exportPhonesNum = params => { return axios.get(`${base}/sendManagement/exportMobile`, { params: params }); };