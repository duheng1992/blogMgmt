<template>
	<el-row class="container"> <!-- el自带的容器 -->
		<el-col :span="24" class="header">
			<el-col :span="10" class="logo" :class="collapsed?'logo-collapse-width':'logo-width'">
				{{collapsed?'':sysName}}
			</el-col>
			<el-col :span="7">
				<div class="tools" @click.prevent="collapse">
					<i class="fa fa-align-justify"></i>
				</div>
			</el-col>
			<el-col :span="7" class="userinfo">
				
				<el-dropdown trigger="hover">
					<span class="el-dropdown-link userinfo-inner"><img :src="this.sysUserAvatar" />{{userClassName}} {{sysUserName}}</span>
					<el-dropdown-menu slot="dropdown">
						<el-dropdown-item>我的消息</el-dropdown-item>
						<el-dropdown-item>设置</el-dropdown-item>
						<el-dropdown-item divided @click.native="logout">退出登录</el-dropdown-item>
					</el-dropdown-menu>
				</el-dropdown>
			</el-col>
		</el-col>
		<el-col :span="24" class="main">  <!-- el自带的容器 main-->
			<el-aside :class="collapsed?'menu-collapsed':'menu-expanded'"> 
			 <!-- el自带的容器 aside -->
				<!--导航菜单-->
				<el-menu default-active="1" class="el-menu-vertical-demo" @open="handleopen" @close="handleclose" @select="handleselect"
					 unique-opened router 
					  background-color="#545c64"
				      text-color="#fff"
				      active-text-color="#ffd04b"
				      model="horizonal"
				       :collapse="collapsed">
				    <template v-for="(menu,index) in menuList">
				    <!-- menu_url是数据库里的配置 -->
					    <el-menu-item v-if="menu.isLeaf == '1'" :index="menu.menu_url" > 
					    	
						        <i :class="menu.icon"></i>
						        <span>{{ menu.menu_name }}</span>
						   
					    </el-menu-item>
					    <el-submenu v-else :index="menu.menu_url">
				            <template slot="title">
				                <i :class="menu.icon"></i>
				                <span>{{menu.menu_name}}</span>
				               
				            </template>
				            <menu-tree :navmenus="menu.children"></menu-tree>
				        </el-submenu>
					</template>
      
				</el-menu>
	<!-- 模板范例 -->
    <!-- <el-menu
      default-active="2"
      class="el-menu-vertical-demo"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b" :collapse="collapsed" router unique-opened>
      <el-submenu index="1">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span>Navigator One</span>
        </template>
        <el-menu-item-group title="Group One">
          <el-menu-item index="/chartMgmt">item one</el-menu-item>
          <el-menu-item index="1-2">item one</el-menu-item>
        </el-menu-item-group>
        <el-menu-item-group title="Group Two">
          <el-menu-item index="1-3">item three</el-menu-item>
        </el-menu-item-group>
        <el-submenu index="1-4">
          <template slot="title">item four</template>
          <el-menu-item index="1-4-1">item one</el-menu-item>
        </el-submenu>
      </el-submenu>
      <el-menu-item index="2">
        <i class="el-icon-menu"></i>
        <span>Navigator Two</span>
      </el-menu-item>
      <el-menu-item index="3" disabled>
        <i class="el-icon-document"></i>
        <span>Navigator Three</span>
      </el-menu-item>
      <el-menu-item index="4">
        <i class="el-icon-setting"></i>
        <span>Navigator Four</span>
      </el-menu-item>
    </el-menu> -->
				
			</el-aside>
			<section class="content-container">
				<div class="grid-content bg-purple-light">
					<el-col :span="24" class="breadcrumb-container">
						<strong class="title">{{$route.name}}</strong>
						<el-breadcrumb separator="/" class="breadcrumb-inner">
							<!--  -->
							<el-breadcrumb-item  v-for="item in $route.matched" :key="item.path" :to="item.path">
								{{ item.name }}
							</el-breadcrumb-item>
						</el-breadcrumb>
					</el-col>
					<el-col :span="24" class="content-wrapper">
						    <transition name="fade" mode="out-in">
						    <!-- keepalive是为了使用钩子函数 activated -->
						    <keep-alive>
      							<router-view></router-view>
      						</keep-alive>
      						</transition>
					</el-col>
				</div>
			</section>
		</el-col>
		
	</el-row>
</template>

<script>
	import { getMenuList } from '../utils/ajax';
	import { arrToTree } from '../utils/arrToTree';
	import { getAvatar } from '../utils/ajax';

	import { getAvatorBase } from '../config/imgSrc';

	import menuTree from '../components/menuTree'

	export default {
		data() {
			return {
				sysName:'博客后台管理系统',
				collapsed:false,
				sysUserName: '',
				sysUserAvatar: '',
				userClassName : '普通用户',
				userId : '',
				userClass: '',
				menuList : [],
				tabName : '',
				form: {
					name: '',
					region: '',
					date1: '',
					date2: '',
					delivery: false,
					type: [],
					resource: '',
					desc: ''
				}
			}
		},
		methods: {
			onSubmit() {
				console.log('submit!');
			},
			//菜单展开
			handleopen() {
				console.log('handleopen');
				//console.log(this.$route)
			},
			//菜单关闭
			handleclose() {
				console.log('handleclose');
			},
			//菜单选中
			handleselect: function (a, b) {
				//console.log('a:'+a, "  b:"+b);
				console.log(this.$route)
			},
			//退出登录
			logout: function () {
				var _this = this;
				this.$confirm('确认退出吗?', '提示', {
					//type: 'warning'
				}).then(() => {
					console.log("--登出--")
					//sessionStorage.removeItem('user');
					this.$store.commit("$_removeStorage");
					_this.$router.push('/login');
				}).catch(() => {

				});


			},
			//折叠导航栏
			collapse:function(){
				this.collapsed =! this.collapsed;
			},
			// showMenu(i,status){
			// 	this.$refs.menuCollapsed.getElementsByClassName('submenu-hook-'+i)[0].style.display=status?'block':'none';
			// }
		},
		mounted() {
			//1.读取用户信息
			var user = sessionStorage.getItem('user');
			//console.log(user)
			if (user) {

				user = JSON.parse(user);
				//console.log(user)
				this.sysUserName = user.userName || '';
				this.userClassName = user.blogItemname || '';
				this.userId = user.userId || '',
				this.userClass = user.userClass || '';

				//这里需要动态获取服务器头像
				//getAvatar(user).then(data => {
                 // console.log(user)
	            this.sysUserAvatar = getAvatorBase + this.userId + '/' + user.srcImg;
              
                //});
      
				//this.sysUserAvatar = user.srcImg || '';
			}

			//2.读取菜单信息
			getMenuList({}).then(data => {
			  //console.log(data)
              //data返回的值
              if(data.data.resCode == '02'){
                this.$message({
                  message: "菜单获取失败！",
                  type: 'error'
                });
              }
              if(data.data.resCode == '01'){
              	//console.log(JSON.parse(data.data.resData))
                //let menuNames = JSON.parse(data.data.resData).map(p => {
                //	return [p.menu_name, p.menu_id];
                //});
               
                var menutree = arrToTree(JSON.parse(data.data.resData));
                this.menuList = menutree;

                //console.log(this.menuList)
                
              }
            });
         },
         components:{
         	'menu-tree': menuTree,
         }
	}

</script>

<style scoped lang="scss">
	@import '@/styles/vars.scss';
	
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
					cursor: pointer;
					color:#fff;
					img {
						width: 40px;
						height: 40px;
						border-radius: 20px;
						margin: 10px 0px 10px 10px;
						float: right;
					};
				}
			}
			.logo {
				//width:230px;
				height:60px;
				font-size: 22px;
				padding-left:20px;
				padding-right:20px;
				border-color: rgba(238,241,146,0.3);
				border-right-width: 1px;
				border-right-style: solid;
				img {
					width: 40px;
					float: left;
					margin: 10px 10px 10px 18px;
				}
				.txt {
					color:#fff;
				}
			}
			.logo-width{
				width:230px;
			}
			.logo-collapse-width{
				width:60px
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
				// position: absolute;
				// right: 0px;
				// top: 0px;
				// bottom: 0px;
				// left: 230px;
				overflow-y: scroll;
				padding: 20px;
				.breadcrumb-container {
					//margin-bottom: 15px;
					.title {
						width: 200px;
						float: left;
						color: #475669;
					}
					.breadcrumb-inner {
						float: right;
					}
				}
				.content-wrapper {
					background-color: #fff;
					box-sizing: border-box;
				}
			}

		}
		
		.user-class {
			width:300px;
		}
		
	}
</style>