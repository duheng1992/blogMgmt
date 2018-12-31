<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters"  @submit.native.prevent>
				<el-form-item>
					<!-- v-model通常用于input的双向数据绑定  v-bind 动态地绑定一个或多个特性，或一个组件 prop 到表达式。-->
					<el-input v-model="filters.name" placeholder="姓名"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="getUser">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<template>
			<el-table :data="users" highlight-current-row v-loading="loading" style="width: 100%;">
				<el-table-column type="index" width="60">
				</el-table-column>
				<el-table-column prop="nick_name" label="姓名" width="120" sortable>
				</el-table-column>
				<el-table-column prop="sex" label="性别" width="100" :formatter="formatSex" sortable>
				</el-table-column>
				<el-table-column prop="phone" label="电话" width="120" sortable>
				</el-table-column>
				<el-table-column prop="zone" label="地区" min-width="100" sortable>
				</el-table-column>
				<el-table-column prop="email" label="邮箱" min-width="180" sortable>
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
		<el-col :span="24" class="toolbar"><!--:disabled="this.users.length===0"-->
			<el-button type="danger" size='small' @click="batchRemove" disabled>批量删除</el-button>
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="pagesize" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

		<!--新增界面-->
		<el-dialog title="新增(默认初始密码123456)" :visible.sync="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
				<el-form-item label="用户名" prop="name">
					<el-input v-model="addForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="昵称" prop="nickName">
					<el-input v-model="addForm.nickName" auto-complete="off"></el-input>
				</el-form-item>
				<!-- prop 用户校验字段用 -->
				<el-form-item label="性别">
					<el-radio-group v-model="addForm.sex">
						<el-radio class="radio" :label="'1'">男</el-radio>
						<el-radio class="radio" :label="'0'">女</el-radio>
					</el-radio-group>
				</el-form-item>
				<!-- <el-form-item label="年龄">
					<el-input-number v-model="addForm.age" :min="0" :max="200"></el-input-number>
				</el-form-item> -->
				<!-- <el-form-item label="生日">
					<el-date-picker type="date" placeholder="选择日期" v-model="addForm.birth"></el-date-picker>
				</el-form-item> -->
				<el-form-item label="电话" prop="phone">
					<el-input type="phone" v-model="addForm.phone"></el-input>
				</el-form-item>
				<el-form-item label="邮箱" prop="email">
					<el-input type="email" v-model="addForm.email"></el-input>
				</el-form-item>
				<el-form-item label="地址" prop="zone">
					<el-input type="zone" v-model="addForm.zone"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>

		<!--编辑界面-->
		<el-dialog title="编辑" :visible.sync="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-form-item label="用户名" prop="user_name">
					<el-input v-model="editForm.user_name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="昵称" prop="nick_name">
					<el-input v-model="editForm.nick_name" auto-complete="off"></el-input>
				</el-form-item>
				<!-- prop 用户校验字段用 -->
				<el-form-item label="性别">
					<el-radio-group v-model="editForm.sex">
						<el-radio class="radio" :label="'1'">男</el-radio>
						<el-radio class="radio" :label="'0'">女</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="电话" prop="phone">
					<el-input type="phone" v-model="editForm.phone"></el-input>
				</el-form-item>
				<el-form-item label="邮箱" prop="email">
					<el-input type="email" v-model="editForm.email"></el-input>
				</el-form-item>
				<el-form-item label="地址" prop="zone">
					<el-input type="zone" v-model="editForm.zone"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>

	</section>
</template>
<script>
	import { getUserList } from '../utils/ajax';
	import { regist } from '../utils/ajax';
	import { modifyUser } from '../utils/ajax';
	import { removeUser } from '../utils/ajax';
	//import NProgress from 'nprogress'
	export default {
		data() {
			return {
				filters: {
					name: ''
				},
				loading: false,
				//存放所有用户列表
				users: [],
				//分页信息
				total: 0,
				page: 1,
				pagesize: 7,
				//radio: 1,
				//新增界面
				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
					name: [
						{ required: true, message: '请输入用户名', trigger: 'blur' },
					],
					nickName: [
						{ required: true, message: '请输入昵称', trigger: 'blur' },
					],
					sex: [
						{ required: true, message: '请输入性别', trigger: 'blur' },
					],
					phone: [
						{ required: true, message: '请输入电话', trigger: 'blur' },
					],
					email: [
						{ required: true, message: '请输入邮箱', trigger: 'blur' },
					],
					zone: [
						{ required: true, message: '请输入地址', trigger: 'blur' },
					],
				},
				//新增界面数据
				addForm: {
					name: '',
					nickName:'',
					sex: '1',
					zone: '',
					phone:'',
					email:'',
					userClass:'002'
				},

				editFormVisible : false,
				editLoading: false,
				editFormRules: {
					user_name: [
						{ required: true, message: '请输入用户名', trigger: 'blur' },
					],
					nick_name: [
						{ required: true, message: '请输入昵称', trigger: 'blur' },
					],
					sex: [
						{ required: true, message: '请输入性别', trigger: 'blur' },
					],
					phone: [
						{ required: true, message: '请输入电话', trigger: 'blur' },
					],
					email: [
						{ required: true, message: '请输入邮箱', trigger: 'blur' },
					],
					zone: [
						{ required: true, message: '请输入地址', trigger: 'blur' },
					],
				},
				//编辑界面数据
				editForm: {
					user_name: '',
					nick_name:'',
					sex: 1,
					zone: '',
					phone:'',
					email:'',
					userClass:'002'
				},
			}
		},
		methods: {
			//性别显示转换
			formatSex: function (row, column) {
				return row.sex == '1' ? '男' : row.sex == '0' ? '女' : '未知';
			},
			handleCurrentChange(val) {
				this.page = val;
				this.getUser();
			},
			//获取用户列表
			getUser: function () {
				
				let para = {
					name: this.filters.name,
					page: this.page,
					pagesize: this.pagesize
				};
				//console.log(para.name)
				this.loading = true;
				//NProgress.start();
				getUserList(para).then((res) => {
					var res = JSON.parse(res.data.resData);
					//console.log(res.length)
					if(res.length){
						//是数组，表示查到了数据
						this.users = res;
						//console.log(res)
						this.total = res[0].total;
						//console.log("第"+this.page+"页，共"+this.total+"条");
					} else {
						this.users = [];
						this.total = 0;
					}

					//this.users = JSON.parse(res.data.resData);
					this.loading = false;
					//NProgress.done();
				});
			},
			//显示新增界面
			handleAdd: function () {
				//console.log("--------")
				this.addFormVisible = true;
				this.addForm = {
					name: '',
					nickName:'',
					sex: '1',
					zone: '',
					phone:'',
					email:'',
					userClass:'002'
				};
			},
			//删除
			handleDel: function (index, row) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.loading = true;
					//NProgress.start();
					let para = { id: row.user_id };
					removeUser(para).then((res) => {
						//this.listLoading = false;
						this.loading = false;
						//console.log(para)
						if(res.data.resCode == '01'){
							this.$message({
								message: res.data.resData,
								type: 'success'
							});
							this.getUser();
						} else {
							this.$message({
								message: res.data.resData,
								type: 'error'
							});
						}
						
					});
				}).catch(() => {

				});
			},
			//显示编辑界面
			handleEdit: function (index, row) {
				//console.log(index)
				//console.log(row)
				this.editForm = Object.assign({}, row);
				this.editFormVisible = true;
			},
			//编辑
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.editLoading = true;
							//NProgress.start();
							let para = Object.assign({}, this.editForm);
							modifyUser(para).then((res) => {
								this.editLoading = false;
								if(res.resCode == '01'){
									this.$message({
										message: '用户更新成功',
										type: 'success'
									});
									this.$refs['editForm'].resetFields();
									this.editFormVisible = false;
									this.getUser();
								} else {
									this.$message({
										message: '用户更新失败',
										type: 'error'
									});
								}
								
							});
						}).catch(()=>{

						})
					}
				});
			},
			//新增
			addSubmit: function () {
				this.$refs.addForm.validate((valid) => {
					//console.log(valid)
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {type: 'warning'}).then(() => {
							this.addLoading = true;  //新增时的loading
				// 			//NProgress.start();
				 			let para = Object.assign({}, this.addForm);
				 			//console.log(para)
				 			regist(para).then((res) => {
				 				//console.log(res)
								this.addLoading = false;

								if(res.resCode != '01'){
									this.$message({
										message: res.resData,
										type: 'error'
									});

									return;
								}
				// 				//NProgress.done();
								if(res.resCode == '01'){
									this.$message({
										message: '提交成功',
										type: 'success'
									});

									this.$refs['addForm'].resetFields();
									this.addFormVisible = false;
					 				this.getUser();
					 			}
							});
						}).catch(() => {

						});
					}
				});
			},
			//批量删除
			batchRemove: function () {

			},
		},
		mounted() {
			this.getUser();
		}
	};

</script>

<style scoped>
	.toolbar {
		height: 60px;
	}
</style>