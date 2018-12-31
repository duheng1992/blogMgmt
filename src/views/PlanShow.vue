<template>
  <div>
  
  <el-row>
    <el-col>
      <el-upload
        class="upload"
        action="https://jsonplaceholder.typicode.com/posts/"
        :on-change="handleChange"
        :auto-upload="false"
        :multiple='false'
        :limit=1>
        <el-button size="small" type="primary">点击上传</el-button>
        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
      </el-upload>  
      <div class="showInfo">
sdsd
      </div>
    </el-col>
    <el-col class="col" :span="3" v-for="(o, index) in 7" :key="o" :offset="index > 0 ? 1 : 0">
      <el-card :body-style="{ padding: '3px' }" shadow="hover">
        <img src="static/images/plane/plane1.png" class="image">
        <div style="padding: 14px;">
          <span>Yummy hamburger</span>
          <div class="bottom clearfix">
            <time class="time">{{ currentDate }}</time>
            <el-button type="text" class="button">Operating button</el-button>
          </div>
        </div>
      </el-card>
    </el-col>
  </el-row>
</div>

</template>


<style scoped>

  .el-row {
    text-align: center;
  }

  .col {
    margin: 8px;
  }

  .time {
    font-size: 13px;
    color: #999;
  }
  
  .bottom {
    margin-top: 13px;
    line-height: 12px;
  }

  .button {
    padding: 0;
    float: right;
  }

  .image {
    width: 100%;
    display: block;
  }

  .clearfix:before,
  .clearfix:after {
      display: table;
      content: "";
  }
  
  .clearfix:after {
      clear: both
  }

   .el-main {
    background-color: #E9EEF3;
    color: #333;
    text-align: center;
    line-height: 160px;
  }
   .el-header{
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 60px;
  }
  
  body > .el-container {
    margin-bottom: 40px;
  }

  .upload {
    float: left;
  }

  .showInfo {
    float: right;
  }
</style>

<script>
import {planImgSrc} from '../config/imgSrc';

export default {
  data() {
    return {
      currentDate: new Date(),
      imgList:''
    };
  },

  methods: {
    getPlans: function(){
      //获取目录下的所有文件
      
    },
    handleChange: function(){

    },

  },
  mounted: function(){
    this.getPlans();
  }
}
</script>