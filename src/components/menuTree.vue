


<script>
export default {
  data () {
    return {

    }
  },
  mounted:function(){
    //console.log(navmenus);
  },
  //props:['navmenus'],
  props: {
    navmenus:{
        type:Array,
    }
  },
  template: (()=> {
        return  `
          <div>
            <template v-for="(menu, index) in navmenus">
              <el-menu-item v-if="menu.isLeaf == '1'" :index="menu.menu_url">
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
          </div>
        `;
  })()
}
</script>

<style lang="css" scoped>
  
</style>
