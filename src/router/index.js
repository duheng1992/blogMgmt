import Vue from 'vue'
import Router from 'vue-router'
import NotFound from '@/views/404'
import UserTable from '@/views/UserTable'
import AdminTable from '@/views/AdminTable'
import PlanShow from '@/views/PlanShow'
import BlogMgmt from '@/views/BlogMgmt'
import Charts from '@/views/Charts'
import BlogAdd from '@/views/BlogAdd'
//登录界面
import Login from '@/views/Login.vue'
//主界面
import Home from '@/views/Home.vue'


Vue.use(Router);

let routes = [
	 {
      path: '/login',
      name: 'login',
      component: Login,
      hidden: true
    },
    {
      path: '/',
      name: '主页',
      component: Home
    },
    {
        path: '/404',
        component: NotFound,
        name: '',
        hidden: true
    },
    {
        path: '/',
        component: Home,
        name: '主页',
        iconCls: 'el-icon-message',//图标样式class
        children: [
          {
            //直接输入 /,则跳转
            path: '',
            redirect: '普通会员'
          },

       		{ path: '/userTable', component: UserTable, name: '普通会员'},
       		{ path: '/adminTable', component: AdminTable, name: '管理员'},
       		{ 
            path: '/blogMgmt', 
            component: BlogMgmt, 
            name: '博文管理',
            children: [
               { path: '/blogMgmt/blogAdd', component: BlogAdd, name: '博文新增'},
            ],
          },
          { path: '/chartMgmt', component: Charts, name: '图表统计'},
        ]
    },
    {
        path: '/picMgmt',
        component: Home,
        name: '图片列表',
        iconCls: 'el-icon-message',//图标样式class
        children: [
            { path: '/plane', component: PlanShow, name: '飞机'}, //配置子路由，默认是其子组件，可以用router-view
          
        ]
    },
    // {
    //     path: '/',
    //     component: Home,
    //     name: '导航一',
    //     iconCls: 'el-icon-message',//图标样式class
    //     children: [
    //         { path: '/table', component: Table, name: 'Table' },
    //     ]
    // },
];

//没有用到require，不是commonJs规范，这里用es6规范
export default routes;