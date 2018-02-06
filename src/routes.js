// import Login from './views/Login.vue'
// import NotFound from './views/404.vue'
// import Home from './views/Home.vue'
// import Main from './views/Main.vue'

// import ChannelList from './views/channel/List.vue'
// import ChannelAccount from './views/channel/Account.vue'
// import addChannel from './views/channel/addChannel.vue'
// import changeChannel from './views/channel/changeChannel.vue'
// import TemplateList from './views/template/List.vue'
// import SMSSchedulerList from './views/sms/SMSSchedulerList.vue'
// import SMSSentList from './views/sms/SMSSentList.vue'
// import SMSSendingList from './views/sms/SMSSendingList.vue'
// import SMSCompleteList from './views/sms/SMSCompleteList.vue'

// import tableLayout from './views/captain/tableLayout.vue'
// import sendHead from './views/sendStatistical/sendHead.vue'
// import ChangePassword from './views/ChangePassword.vue'

// import Shield from './views/Shield.vue'
// import Signal from './views/Signal.vue'

// import UserListView from './views/user/UserListView.vue'
// import AddUserView from './views/user/AddUserView.vue'
// import EditUserView from './views/user/EditUserView.vue'
// import UserInfoView from './views/user/UserInfoView.vue'
// import RechargeRecordView from './views/recharge/RechargeRecordView.vue'
import VueRouter from 'vue-router'

let routes = [
    {
        path: '/login',
        component: resolve =>require(['./views/Login.vue'], resolve),
        name: '',
        hidden: true
    },
    {
        path: '/404',
        component: resolve =>require(['./views/404.vue'], resolve),
        name: '',
        hidden: true
    },
    { 
        path: '/', 
        component: resolve =>require(['./views/Home.vue'], resolve),
        name:'',
        hidden:true,
    },
    {
        path: '',
        component: resolve =>require(['./views/Home.vue'], resolve),
        name: '',
        iconCls: 'fa fa-home',//图标样式class
        noDropdown:true,
        name: '首页',
        redirect:'/index',
        children: [
           { path: 'index', component: resolve =>require(['./views/Main.vue'], resolve), name: '首页', hidden: true },
           { path: 'changepassword', component: resolve =>require(['./views/ChangePassword.vue'], resolve), name: '修改密码', hidden: true }
        ]
    },
    {
        path: '/user',
        component: resolve =>require(['./views/Home.vue'], resolve),
        name: '用户管理',
        iconCls: 'fa fa-hand-o-right',
        redirect:'/user/list',
        children: [
            { path: 'list', component: resolve =>require(['./views/user/UserListView.vue'], resolve), name: '用户列表' },
            { path: 'add', component: resolve =>require(['./views/user/AddUserView.vue'], resolve), name: '添加用户', hidden: true },
            { path: 'edit/:id', component: resolve =>require(['./views/user/EditUserView.vue'], resolve), name: '修改用户', hidden: true },
            { path: 'info/:id', component: resolve =>require(['./views/user/UserInfoView.vue'], resolve), name: '用户信息', hidden: true }
        ]
    },
    {
        path: '',  // /recharge
        component: resolve =>require(['./views/Home.vue'], resolve),
        name: '充值记录',
        noDropdown:true,
        iconCls: 'fa fa-cc-paypal',
        redirect:'/record',
        children: [
            { path: 'record', component: resolve =>require(['./views/recharge/RechargeRecordView.vue'], resolve), name: '充值记录' }
        ]
    },
     {
        path: '/channel',
        component: resolve =>require(['./views/Home.vue'], resolve),
        name: '通道管理',
        iconCls: 'fa fa-user-circle',
        redirect:'/channel/list',
        children: [
            { path: 'list', component: resolve =>require(['./views/channel/List.vue'], resolve), name: '通道列表' },
            { 
                path: '/channel/detail', 
                component: resolve =>require(['./views/captain/tableLayout.vue'], resolve), 
                redirect:'/channel/detail/account',
                name: '通道',
                hidden: true,
                children:[
                     { path: 'account/:channelId', component: resolve =>require(['./views/channel/Account.vue'], resolve), name: '帐号信息', hidden: true },
                     { path: 'modification/:channelId', component: resolve =>require(['./views/channel/changeChannel.vue'], resolve), name: '修改通道', hidden: true }
                ] 
            },
            { path: 'add', component: resolve =>require(['./views/channel/addChannel.vue'], resolve), name: '添加通道', hidden: true }
        ]
    },
    {
        path: '/template',
        component: resolve =>require(['./views/Home.vue'], resolve),
        name: '模板管理',
        iconCls: 'fa fa-id-card',
        redirect:'/template/list',
        children: [
            { path: 'list', component: resolve =>require(['./views/template/List.vue'], resolve), name: '模板列表' }
        ]
    },
    {
        path: '/sms',
        component: resolve =>require(['./views/Home.vue'], resolve),
        name: '短信发送管理',
        iconCls: 'fa fa-file-sound-o',
        redirect:'/sms/scheduler',
        children: [
            { path: 'scheduler', component: resolve =>require(['./views/sms/SMSSchedulerList.vue'], resolve), name: '短信发送列表' },
            { path: 'sent', component: resolve =>require(['./views/sms/SMSSentList.vue'], resolve), name: '短信发送列表', hidden: true },
            { path: 'sending', component: resolve =>require(['./views/sms/SMSSendingList.vue'], resolve), name: '短信发送列表', hidden: true },
            { path: 'complete', component:  resolve =>require(['./views/sms/SMSCompleteList.vue'], resolve), name: '短信发送列表', hidden: true }
        ]
    },
    {
        path: '',
        component: resolve =>require(['./views/Home.vue'], resolve),
        iconCls: 'fa fa-shield',
        noDropdown: true,
        name: '屏蔽词管理',
        redirect:'/Shield',
        children: [
            { path: 'Shield', component: resolve =>require(['./views/Shield.vue'], resolve), name: '屏蔽词管理' }
        ]
    },
    {
        path: '',
        component: resolve =>require(['./views/Home.vue'], resolve),
        iconCls: 'fa fa-signal',
        noDropdown: true,
        name: '号段维护',
        redirect:'/Signal',
        children: [
            { path: 'Signal', component: resolve =>require(['./views/Signal.vue'], resolve), name: '号段维护' }
        ]   
    },
    {
        path: '/send',
        component: resolve =>require(['./views/Home.vue'], resolve),
        name: '发送统计',
        iconCls: 'fa fa-line-chart',
        redirect:'/send/statistical',
        children: [
            { path: 'statistical', component: resolve =>require(['./views/sendStatistical/sendHead.vue'], resolve), name: '统计记录' },
        ]
    },
    {
        path: '/404',
        component: resolve =>require(['./views/404.vue'], resolve),
        name: '',
        hidden: true
    },
    { 
        path: '/', 
        component: resolve =>require(['./views/Home.vue'], resolve),
        name:'',
        hidden:true,
    },
    {
        path: '*',
        hidden: true,
        redirect: { path: '/404' }
    }
];



const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  //NProgress.start();
  if (to.path == '/login') {
    sessionStorage.removeItem('goldUser');
  }
  let user = JSON.parse(sessionStorage.getItem('goldUser'));
  if (!user && to.path != '/login') {
    next({ path: '/login' })
  } else {
    next()
  }
  next();
})
export default router;