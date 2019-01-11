<template>
  <div class="root">
  		<span class="userInfo">当前登陆用户：{{userName}}</span>
  		<el-button class="submit" type="success" size="small" @click="addBlog">提交<i class="el-icon-upload el-icon--right"></i></el-button>
  		分类：
  		<el-radio-group v-model="classify">
	      <el-radio-button label="coding">技术</el-radio-button>
	      <el-radio-button label="sharing">日常</el-radio-button>
	      <el-radio-button label="note">随笔</el-radio-button>
	    </el-radio-group>
	    标题：
	    <el-input class="input" v-model="title" placeholder="请输入内容"></el-input>
	    描述：
	    <el-input class="input" v-model="description" placeholder="请输入内容"></el-input>
	    summary：
	    <el-input class="input"  v-model="blogSumary" placeholder="请输入内容"></el-input>
  		<hr/>
  		<mavon-editor class="mk" :ishljs="true" v-model="content" ref="md" @imgAdd="$imgAdd" ></mavon-editor>
  </div>
</template>

<style scoped>
	.userInfo,.submit {
		margin: 10px 30px 10px 0;
		font-weight: blod;
	}

	.mk {
		min-height: 600px; 
		min-width: 300px;
	}

	.input {
		width: 150px;
	}
</style>

<script>

import { highlightJs } from 'highlight.js';
import { addOrUpdateBlog } from '../utils/ajax.js';
import { getBlogById } from '../utils/ajax.js';
import { uploadBlogImage } from '../utils/ajax.js';
import { getBlogImgBase } from '../config/imgSrc';

export default {
  nameL:'blogAdd',
  data() {
    return {
     	userId : '',
     	userName: '',
     	content: '',
     	title:'',
     	blogSumary: '',
     	classify:'',
     	description:'',
     	blogId:''
    };
  },

  mounted: function() {
  	var userId = this.$route.query.userId;
  	var userName = this.$route.query.userName;
  	var blogId = this.$route.query.blogId;
  	this.blogId = blogId;
  	this.userId = userId;
  	this.userName = userName;

  	//通过blogId获取文章信息
  	if(this.blogId){
  		getBlogById({blogId : this.blogId}).then(res => {

	  		var data = JSON.parse(res.data.resData)[0] || {};

	  		this.content = data.content;
	  		this.title = data.title;
	  		this.blogSumary = data.blog_sumary;
	  		this.classify = data.classify;
	  		this.description = data.description;

	  	});
  	}



  },
  methods: {

    //每插入一次图片，就触发
  	$imgAdd(pos, $file){
      //console.log(file)
      var formdata = new FormData();
      formdata.append('file', $file);
      //console.log(formdata.get('image'))
        var param = {
            data: formdata
        }

        uploadBlogImage(param).then(res => {
          //console.log(res)
          var url = res.data.resData;
          //let res = //访问服务器,返回url：将返回的url替换到文本原位置![...](0) -> ![...](url)
	 console.log(`${getBlogImgBase}url`);
          this.$refs.md.$img2Url(pos, `${getBlogImgBase}`+url);

        });

  	},

  	addBlog(){
  		//console.log(this.content)
  		//组织传递的参数
  		let para = {
          userId: this.userId,
          userName: this.userName,
          content: this.content,
          blogSumary: this.blogSumary,
          classify: this.classify,
          description: this.description,
          title: this.title,
          blogId: this.blogId,
        };

        if(!para.userId){
        	this.$message({
	          showClose: true,
	          message: '错了哦，当前登录用户信息获取错误！',
	          type: 'error'
	        });

	        return;
        }
        if(!para.userName){
        	this.$message({
	          showClose: true,
	          message: '错了哦，当前登录用户信息获取错误！',
	          type: 'error'
	        });

	        return;
        }
        if(!para.content){
        	this.$message({
	          showClose: true,
	          message: '错了哦，文章内容未填写！',
	          type: 'error'
	        });

	        return;
        }
        if(!para.blogSumary){
        	this.$message({
	          showClose: true,
	          message: '错了哦，文章summary未填写！',
	          type: 'error'
	        });

	        return;
        }
        if(!para.classify){
        	this.$message({
	          showClose: true,
	          message: '错了哦，文章分类未选择！',
	          type: 'error'
	        });

	        return;
        }
        if(!para.description){
        	this.$message({
	          showClose: true,
	          message: '错了哦，文章描述未填写！',
	          type: 'error'
	        });

	        return;
        }
        if(!para.title){
        	this.$message({
	          showClose: true,
	          message: '错了哦，文章标题未填写！',
	          type: 'error'
	        });

	        return;
        }
  		addOrUpdateBlog(para).then((res) => {
          //console.log(res)
          if(res.resCode == '01'){
          	this.$message({
	          showClose: true,
	          message: '添加成功！',
	          type: 'success'
	        });
	        //this.$store.cancelBlogEditState();
	        this.$router.push({path:'/blogMgmt'}); 
          } else {
          	this.$message({
	          showClose: true,
	          message: '插入文章失败，请稍后重试！',
	          type: 'error'
	        });
          }
        });

  	}
  }

}

</script>
