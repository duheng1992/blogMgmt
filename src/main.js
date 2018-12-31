// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
//css框架
import ElementUI from 'element-ui'
//主样式文件
import 'element-ui/lib/theme-chalk/index.css'
//路由中间件
import VueRouter from 'vue-router'
//自定义路由
import routes from './router/index'
//字体样式中间件
import 'font-awesome/css/font-awesome.min.css'
import mavonEditor from 'mavon-editor';
import 'mavon-editor/dist/css/index.css';
//vuex
import store from './vuex/store'
//import Vuex from 'vuex'

//cookie
import cookies from 'vue-cookies';


//测试：生成随机数据,拦截Ajax 请求
//import Mock from './mock'
//Mock.bootstrap();

Vue.config.productionTip = false

//注册中间件
Vue.use(ElementUI)
Vue.use(cookies)
Vue.use(VueRouter)
Vue.use(mavonEditor)
// Vue.use(Vuex)

//注册路由，在里边声明自定义路由
const router = new VueRouter({
  mode: 'history',
  routes: routes
})

//路由拦截器（钩子函数）
/**
	功能：非登录状态下，获取用户信息，若获取不到，打回登录界面
	sessionStorage：h5自带属性，存入session
*/
router.beforeEach((to, from, next) => {
  //console.log(to.path)
  if (to.path == '/login') {
    sessionStorage.removeItem('user');
  }
  let user = JSON.parse(sessionStorage.getItem('user'));
  var now = new Date().getTime();
  var delay = 30*30*1000; //登录状态保持时间30分钟
  //console.log(now)
  //console.log(user.loginTime)
  //console.log(now - delay)
  if(user && (user.loginTime < (now - delay))){
    //过期了
    sessionStorage.removeItem('user');
    user = null;
    //console.log(now - delay)
    next({ path: '/login' });
  }

  //TODO:服务端路由拦截，若session过期，传回一个关键字，这里判断该关键字来进行路由跳转
  if ((!user || !user.userId ) && to.path != '/login') {
    //使用next来跳转界面
    next({ path: '/login' });
  } else {
    next();
  }
  

  
})

/* eslint-disable no-new */
new Vue({
  //el: '#app',
  //es6写法
  router,
  //mavonEditor,
  store,
  //父组件
  //components: { App },
  //template: '<App/>'
  render: h => h(App)  //渲染组件App
}).$mount('#app')  //手动挂载
