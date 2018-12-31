<template>  <!--  v-loading="logining"-->
  <div element-loading-text="Loading..."
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)" style="100%">
  <!-- elementUi 样式 ： 带校验规则的form -->
  <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-position="left" label-width="0px" class="demo-ruleForm login-container" >
    <h3 class="title">系统登录</h3>
    <el-form-item prop="account">
      <el-input type="text" v-model="ruleForm2.account" auto-complete="off" placeholder="账号"></el-input>
    </el-form-item>
    <el-form-item prop="checkPass">
      <el-input type="password" v-model="ruleForm2.checkPass" auto-complete="off" placeholder="密码"></el-input>
    </el-form-item>
    <el-checkbox v-model="checked" checked class="remember">记住密码</el-checkbox>
    <el-form-item style="width:100%;">
      <!-- 组织按钮默认行为 -->
      <el-button type="primary" style="width:40%;" @click.native.prevent="handleSubmit2" :loading="logining">登录</el-button>
      <el-button @click.native.prevent="handleReset2" style="width:40%;">重置</el-button>
    </el-form-item>
  </el-form>

  </div>
</template>

<script>
  import { requestLogin } from '../utils/ajax';
  //import NProgress from 'nprogress'
  export default {
    data() {
      return {
        logining: false,
        ruleForm2: {
          account: '',
          checkPass: ''
        },
        rules2: {
          account: [
            { required: true, message: '请输入账号', trigger: 'blur' },
            //{ validator: validaePass }
          ],
          checkPass: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            //{ validator: validaePass2 }
          ]
        },
        checked: true
      };
    },
    methods: {
      handleReset2() {
        this.$refs.ruleForm2.resetFields(); //ElementUi内置
      },

      //提交登录按钮按下触发
      handleSubmit2(ev) {
        var _this = this;
        //element-ui带的验证
        this.$refs.ruleForm2.validate((valid) => {
          if (valid) {
            //_this.$router.replace('/table');
            this.logining = true;
            //NProgress.start();
            var loginParams = { username: this.ruleForm2.account, password: this.ruleForm2.checkPass };
            //调用ajax
            requestLogin(loginParams).then(data => {
              //console.log(data)
              this.logining = false;
              //NProgress.done();
              //data返回的值
              if(data.resCode == '02'){
                this.$message({
                  message: "登录失败，请检查用户名或密码是否正确！",
                  type: 'error'
                });

                return;
              }
              //console.log(data)
              if(data.resCode == '01'){
                let { user_id, user_name, user_class, src_img, blog_itemname } = data.resData[0];
                var newUser = {
                  'userId': user_id, 
                  'userName': user_name,
                  'srcImg': src_img,
                  'userClass': user_class,
                  'blogItemname': blog_itemname,
                  'loginTime': new Date().getTime()
                };

                //调用vuex
                this.$store.commit("$_setStorage", newUser);
                //路由跳转
                console.log('登录成功');
                this.$router.push({ path: '/' });
              }
            });
          } else {
            //console.log('error submit!!');
            return false;
          }
        });
      }
    }
  }

</script>

<style lang="scss" scoped>
  .login-container {
    box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);
    -webkit-border-radius: 5px;
    border-radius: 5px;
    -moz-border-radius: 5px;
    background-clip: padding-box;
    margin: 180px auto;
    width: 350px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
    .title {
      margin: 0px auto 40px auto;
      text-align: center;
      color: #505458;
    }
    .remember {
      margin: 0px 0px 35px 0px;
    }
  }
</style>