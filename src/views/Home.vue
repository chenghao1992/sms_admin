<template>
	<el-row class="container">
		<el-col :span="24" class="header">
			<el-col :span="10" class="logo" :class="collapsed?'logo-collapse-width':'logo-width'">
				{{collapsed?'':sysName}}
			</el-col>
			<el-col :span="10" class="userinfo">
				<span class="el-dropdown-link userinfo-inner"><i class="fa fa-user-o" aria-hidden="true"></i>&nbsp;&nbsp;{{sysUserName}}</span>
				<span class="el-dropdown-link userinfo-inner cursur_point" @click="changePassw"><i class="fa fa-cog" aria-hidden="true"></i>&nbsp;&nbsp;设置 </span>
				<span class="el-dropdown-link userinfo-inner cursur_point" @click="logout"><i class="fa fa-power-off" aria-hidden="true"></i> </span>
			</el-col>
		</el-col>
		<el-col :span="24" class="main">
			<aside :class="collapsed?'menu-collapsed':'menu-expanded'">
				<!--导航菜单-->
				<el-menu mode="vertical" theme="light" :default-active="$route.path">
			        <sidebar-item :routes='$router.options.routes'></sidebar-item>
			    </el-menu>
			</aside>
			<section class="content-container">
				<div class="grid-content bg-purple-light">
					<el-col :span="24" class="breadcrumb-container">
						<strong class="title">{{$route.name}}</strong>
						<el-breadcrumb separator=">" class="breadcrumb-inner">
							<el-breadcrumb-item v-for="item in $route.matched" :key="item.path">
								{{ item.name=='通道'?Role||realName:item.name }}
							</el-breadcrumb-item>
						</el-breadcrumb>
					</el-col>
					<el-col :span="24" class="content-wrapper">
						<transition name="fade" mode="out-in">
							<router-view></router-view>
						</transition>
					</el-col>
				</div>
			</section>
		</el-col>
	</el-row>
</template>

<script>
	import SidebarItem from '../components/SidebarItem';
	import { mapGetters } from 'vuex';
	import { goldLogout } from '../api/api'
	export default {
		data() {
			return {
				sysName:'佳兆业金服短信系统控制台',
				collapsed:false,
				sysUserName: '',
				sysUserAvatar: '',
				realName:''
			}
		},
		components: { SidebarItem },
		methods: {
			//退出登录
			logout: function () {
				var _this = this;
				this.$confirm('确认退出吗?', '提示', {
					type: 'warning'
				}).then(() => {
					goldLogout().then( res=> {
						if(res.code == 0){
							sessionStorage.removeItem('goldUser');
							_this.$router.push('/login');
						}
					})
				}).catch(() => {

				});
			},
			changePassw(){
				this.$router.push({ path: '/changepassword' });
			},
			showMenu(i,status){
				this.$refs.menuCollapsed.getElementsByClassName('submenu-hook-'+i)[0].style.display=status?'block':'none';
			}
		},
		mounted() {
			var user = sessionStorage.getItem('goldUser');
			if (user) {
				user = JSON.parse(user);
				this.sysUserName = user.user.userName || '';
				this.sysUserAvatar = user.avatar || '';
			}
			let channelName = JSON.parse(sessionStorage.getItem('channelName'))
        	this.realName = channelName;
		},
		computed:{
		...mapGetters([
	        'Role',
	      ])
		}
	}

</script>

<style scoped lang="scss">
	@import '~scss_vars';
	.container {
		position: absolute;
		top: 0px;
		bottom: 0px;
		width: 100%;
		.header {
			height: 60px;
			line-height: 60px;
			background: $color-primary;
			color:#fff;
			.userinfo {
				text-align: right;
				padding-right: 35px;
				float: right;
				.userinfo-inner {
					color:#fff;
					font-size: 16px;
					margin-right: 20px;
					display: inline-block;
					height: 100%;
				}
				.cursur_point{
					cursor: pointer;
				}
			}
			.logo {
				height:60px;
				font-size: 22px;
				padding-left:20px;
				padding-right:20px;
				img {
					width: 40px;
					float: left;
					margin: 10px 10px 10px 18px;
				}
				.txt {
					color:#fff;
				}
			}
			.tools{
				padding: 0px 23px;
				width:14px;
				height: 60px;
				line-height: 60px;
				cursor: pointer;
			}
		}
		.main {
			display: flex;
			// background: #324057;
			position: absolute;
			top: 60px;
			bottom: 0px;
			overflow: hidden;
			aside {
				flex:0 0 230px;
				width: 230px;
				// position: absolute;
				// top: 0px;
				// bottom: 0px;
				.el-menu{
					height: 100%;
				}
				.collapsed{
					width:60px;
					.item{
						position: relative;
					}
					.submenu{
						position:absolute;
						top:0px;
						left:60px;
						z-index:99999;
						height:auto;
						display:none;
					}

				}
			}
			.menu-collapsed{
				flex:0 0 60px;
				width: 60px;
			}
			.menu-expanded{
				flex:0 0 230px;
				width: 230px;
			}
			.content-container {
				// background: #f1f2f7;
				flex:1;
				 position: relative;
				// right: 0px;
				// top: 0px;
				// bottom: 0px;
				 left: -17px;
				overflow-y: scroll;
				padding: 20px;
				background:white;
				.breadcrumb-container {
					//margin-bottom: 15px;
					.title {
						width: 200px;
						text-align: right;
						float: right;
						color: #475669;
					}
					.breadcrumb-inner {
						float: left;
					}
				}
				.content-wrapper {
					background-color: #fff;
					box-sizing: border-box;
				}
			}
			aside{
				.el-menu{
					overflow-y: scroll;
				}
			}
		}
	}
</style>