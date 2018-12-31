/*将对象数组转化成tree格式
input = [{"id":1, "name":'', pid:null}, {"id":2, "name":'', pid:"1"}]
output = [{"id":1, "name":'', pid:null, "children":[{"id":2, "name":'', pid:"1"}]}]

用途：要配合elementui的导航菜单使用
*/

export const arrToTree = input => { 
	//console.log(typeof input)
	var dataDeepCopy = JSON.parse(JSON.stringify(input));
	menuList(input, dataDeepCopy);
	for(let k = 0; k < input.length; k++){
		if(input[k].parent_menu_id){
			input.splice(k,1);
			k--;
		}
	}

	return input;
};

function menuList(arr, newData){
	var newArr = newData;
	if(arr && arr.length > 0){
		for(let i = 0; i < arr.length; i++){
			(function(k){
				//console.log(arr[i])
				arr[k].children = [];
				if(newArr && newArr.length > 0){
					for(let j = 0; j < newArr.length; j++){
						(function(){
							if(newArr[j].parent_menu_id == arr[k].menu_id){
								var obj = newArr[j];
								obj.children = [];
								arr[k].children.push(obj);
								newArr.splice(j,1);
								j--;
							}
						})(j);
					}
					
				}
			menuList(arr[i].children, newArr);   })(i);
		}
		
	}
}