import axios from 'axios';

axios.defaults.withCredentials = true//每次请求，无论是否跨域，都带上cookie信息
//base是服务器地址
//let base = 'http://192.168.1.88:8888';
let base = 'http://122.112.216.70:8888';
//axios.defaults.baseURL = base;

// export const async login(){
// 	let res = await axios.post('',params);
// 	console.log(res);
// }

/////////////////////////////用户操作////////////////////////////////
export const requestLogin = params => { 
	return axios.post(`${base}/user/login`, params).
	then(res => res.data); 
};

export const getMenuList = params => {
	return axios.get(`${base}/sys/queryMenuList`, { params: params }); 
};

export const getUserList = params => { 
	return axios.get(`${base}/user/queryUserList`, { params: params }); 
};

export const getAdminUserList = params => { 
	return axios.get(`${base}/user/queryAdminUserList`, { params: params }); 
};

export const modifyUser = params => { 
	return axios.post(`${base}/user/modifyUser`, params).then(res => res.data); 
};

export const regist = params => { 
	return axios.post(`${base}/user/regist`, params).then(res => res.data); 
};

export const removeUser = params => { 
	return axios.get(`${base}/user/removeUser`, { params: params }); 
};

// export const getAvatar = params => {
// 	return axios.post(`${base}/user/getAvatar`, params).then(res => res.data); 
// };



/////////////////////////////博客操作////////////////////////////////
export const getBlogs = params => {
	return axios.get(`${base}/post`, { params: params }); 
};

export const getBlogById = params => {
	return axios.get(`${base}/post/${params.blogId}`, { params: params }); 
};

export const getBlogHits = params => {
	return axios.get(`${base}/post/mgmt/getHits`, { params: params }); 
};

export const addOrUpdateBlog = params => {
	return axios.post(`${base}/post/mgmt/addOrUpdatePost`, params).then(res => res.data);
};

export const uploadBlogImage = params => {
	//console.log(params.data.get('image'))
	return axios({
	   url: `${base}/post/uploadBlogImage`,
       method: 'post',
       data: params.data,
       headers: { 'Content-Type': 'multipart/form-data' },
	}).then(res => res); 
};


export const delBlog = params => {
	return axios.get(`${base}/post/mgmt/delPost`, { params: params }); 
};

export const getHits = params => {
	return axios.get(`${base}/post/mgmt/getHits`, { params: params }); 
};

/////////////////////////运行PY脚本///////////////////////////////////



/*export const batchRemoveUser = params => { return axios.get(`${base}/user/batchremove`, { params: params }); };

export const editUser = params => { return axios.get(`${base}/user/edit`, { params: params }); };

export const addUser = params => { return axios.get(`${base}/user/add`, { params: params }); };*/
