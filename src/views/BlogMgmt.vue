<template>
  <div class="root">
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;" v-show="!isEdit">
      <!-- @submit.native.prevent 阻止表单默认的回车提交-->
      <el-form :inline="true" :model="filters" @submit.native.prevent>
        <el-form-item>
          <!-- v-model通常用于input的双向数据绑定  v-bind 动态地绑定一个或多个特性，或一个组件 prop 到表达式。-->
          <el-input class="input" v-model="filters.name" placeholder="输入博客标题/简介/用户名/昵称" @keyup.enter.native="getAllBlogs"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="inputBtn" @click="getAllBlogs">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="inputBtn" @click="handleAdd">新增</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!--列表-->
    <template>
      <el-table :data="blogs" highlight-current-row v-loading="loading" style="width: 100%;" v-show="!isEdit">
        <el-table-column type=" " width="60">
        </el-table-column>
        <el-table-column prop="title" label="标题" width="180" sortable>
        </el-table-column>
        <el-table-column prop="nick_name" label="作者昵称" width="120" sortable>
        </el-table-column>
        <el-table-column prop="user_name" label="用户名" width="120" sortable>
        </el-table-column>
        <el-table-column prop="blog_sumary" label="简介" width="200" sortable>
        </el-table-column>
        <el-table-column prop="create_time" label="创建时间" :formatter="dateFormatters" sortable>
        </el-table-column>
        <el-table-column prop="update_date" label="更新时间" :formatter="dateFormatters" sortable>
        </el-table-column>
        <el-table-column prop="hits" label="点击" min-width="60" sortable>
        </el-table-column>
        <el-table-column label="操作" width="150">
        <template slot-scope="scope">
          <el-button type="primary" circle icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)"></el-button>
          <el-button type="danger" circle icon="el-icon-delete" @click="handleDel(scope.$index, scope.row)"></el-button>
        </template>
        </el-table-column>
      </el-table>
    </template>

    <!--工具条-->
    <el-col :span="24" class="toolbar"  v-show="!isEdit">
      <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="pagesize" :total="total" style="float:right;">
      </el-pagination>
    </el-col>

    <router-view transition="fade" transition-mode="out-in"></router-view>
  </div>

</template>


<style scoped>
  .root {
    padding: 10px;
  }

  .input {
    width: 300px;
    margin : 10px 0 0 0;
  }

  .inputBtn {
    width: 70px;
    height: 40px;
    margin : 10px 0 0 0;
  }
</style>

<script>
import { dateFormatter } from '../utils/dateFormatter.js';
import { getBlogs } from '../utils/ajax.js';
import { delBlog } from '../utils/ajax.js';
export default {
  data() {
    return {
      filters: {
        name: ''
      },
      loading: false,
      blogs: [],
      page: 1,
      pagesize: 10,
      total: 0,
      isEdit: false,
    };
  },

 methods: {
      //日期显示转换
      dateFormatters: function (row, column) {
        //console.log(dateFormatter(new Date('2017-01-01'),'yyyy-mm-dd'))
        if(column.property == 'create_time'){
          return dateFormatter(row.create_time, 'yyyy/MM/dd');
        }

        if(column.property == 'update_date'){
          if(row.update_date)
            return dateFormatter(row.update_date, 'yyyy/MM/dd');
          return '';
        }
        
        return '';
      },
      handleCurrentChange(val) {
        this.page = val;
        this.getAllBlogs();
      },
      //获取博客列表
      getAllBlogs: function () {
        
        let para = {
          name: this.filters.name,
          page: this.page,
          pagesize: this.pagesize

        };
        //console.log(para.name)
        this.loading = true;
        //NProgress.start();
        getBlogs(para).then((res) => {
          //console.log(res)
          if(res.data.resCode == '01'){
            var res = JSON.parse(res.data.resData);
            if(res.length){
            //是数组，表示查到了数据
            this.blogs = res;
            //console.log(res)
            this.total = res[0].total;
            //console.log("第"+this.page+"页，共"+this.total+"条");
            } else {
              this.blogs = [];
              this.total = 0;
            }
          } else {
            //没找到博客
            this.blogs = [];
            this.total = 0;
          }
          
          //console.log(typeof res)
          //console.log(res)
          

          this.loading = false;
          //NProgress.done();
        });
      },

      //显示新增界面
      handleAdd: function () {
        var user = sessionStorage.getItem('user');
        //console.log(user)
        if (user) {

          user = JSON.parse(user);
          //this.userId = user.userId,
          this.isEdit = true;
          //console.log(this.userId)
          this.$router.push({path:'/blogMgmt/blogAdd', query: { userId: user.userId, userName: user.userName }}); //若是用params，其只能用name来引入路由，所以要声明name
        } else {
          this.$alert('非法用户：获取登陆用户信息失败！', '警告', {
            confirmButtonText: '确定',
            callback: action => {
              this.$message({
                type: 'info',
                message: ``
              });
            }
          });
        }
        //console.log("--------")
      },

      handleDel: function(index, row){
        var user = sessionStorage.getItem('user');
        //console.log(user)
        if (user) {

          user = JSON.parse(user);
          var para = {
            blogId: row.blog_id
          }

          if(row.blog_id){
            this.$confirm('此操作将永久删除该文章, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {

              delBlog(para).then((res) => {
                console.log(res)
                if(res.data.resCode == '01'){
                  this.$message({
                    type: 'success',
                    message: '删除成功!'
                  });
                  this.getAllBlogs();
                } else {
                  this.$message({
                    type: 'error',
                    message: '删除失败!'
                  });
                }
              });
              
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消删除'
              });          
            });
          } else {
            this.$message({
              showClose: true,
              message: '错了哦，选择文章信息获取错误！',
              type: 'error'
            });

            return;
          }

        } else {
          this.$alert('非法用户：获取登陆用户信息失败！', '警告', {
            confirmButtonText: '确定',
            callback: action => {
              this.$message({
                type: 'info',
                message: ``
              });
            }
          });
        }
      },

      handleEdit: function(index, row){
        var user = sessionStorage.getItem('user');
        if (user) {
          this.isEdit = true;
          //console.log(this.userId)
          //获取选中文章的具体信息
           if(row.blog_id){
              user = JSON.parse(user);
              this.$router.push({path:'/blogMgmt/blogAdd', query: { 
                                              userId: user.userId, 
                                              userName: user.userName,
                                              blogId: row.blog_id
                                            }
              }); //
            } else {
              this.$message({
                showClose: true,
                message: '错了哦，选择文章信息获取错误！',
                type: 'error'
              });

              return;
            }
        } else {
          this.$alert('非法用户：获取登陆用户信息失败！', '警告', {
            confirmButtonText: '确定',
            callback: action => {
              this.$message({
                type: 'info',
                message: ``
              });
            }
          });
        }
      }
  },

  mounted: function(){
    //console.log("--------------")
    this.getAllBlogs();
  },
  activated: function(){
    console.log("-----activated-----")
  },
  beforeUpdate: function(){
    //console.log(this.$route.path)
    if(this.$route.path === '/blogMgmt'){
      //重新返回列表
      //this.getAllBlogs();
      this.isEdit = false;
    }
  },

  watch: {
    //监听新增和修改的，刷新列表
    isEdit(newN, oldN){
      //console.log(newN)
      if(!newN){
         this.getAllBlogs();
      }
    }
  }
}
</script>