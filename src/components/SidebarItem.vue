<template>
    <div>
        <template v-for="item in routes">
            <router-link v-if="!item.hidden&&item.noDropdown&&item.children.length>0" :to="item.path+'/'+item.children[0].path">
                <el-menu-item :index="item.path+'/'+item.children[0].path" v-if="routesFun(item)">
                     <i :class="item.iconCls"></i>{{item.children[0].name}}
                </el-menu-item>
            </router-link>
            
              <el-submenu :index="item.name" v-if="!item.noDropdown&&!item.hidden&&routesFun(item)">
                  <template slot="title">
                       <i :class="item.iconCls"></i>{{item.name}}
                  </template>
                  <template v-for="child in item.children" v-if='!child.hidden'>
                      <sidebar-item class='menu-indent' v-if='child.children&&child.children.length>0' :routes='[child]'> </sidebar-item>
                      <router-link v-else class="menu-indent" :to="item.path+'/'+child.path">
                          <el-menu-item :index="item.path+'/'+child.path">
                              {{child.name}}
                          </el-menu-item>
                      </router-link>
                  </template>
              </el-submenu>
            
        </template>
    </div>
</template>

<script>

    export default {
      data() {
      return {
        roleKey:[],
        goldUserList:[]
      }
    },
      name: 'SidebarItem',
      props: {
        routes: {
          type: Array
        }
      },
      methods:{
        routesFun(item){ 
                /*if(item.meta && String(item.meta).indexOf(this.roleKey)>=0){
                     return true;
                }
                return true;  */
                for(var i=0;i<this.roleKey.length;i++){
                  if(item.name == this.roleKey[i].name){
                      if(i==0 && this.goldUserList.length!=0){
                        if(item.path==''){
                          this.$router.push({ path: item.redirect });
                        }else{
                          this.$router.push({ path: item.path });
                        }
                      }
                      if(i==this.roleKey.length-1){
                        sessionStorage.removeItem('goldUserList');
                      }
                      return true;
                  }
                }
            },
      },
      mounted() {
        let user = JSON.parse(sessionStorage.getItem('goldUser'));
        let userList = JSON.parse(sessionStorage.getItem('goldUserList'));
        if(user){
          this.roleKey = user.permission
        }
        if(userList){
          this.goldUserList = userList.permission
        }
      },
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
   a{
        text-decoration: none;
   }
</style>

