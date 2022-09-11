<template>
  <el-aside width="220px">
    <el-card class="card">
      <div>
        <div>
          <slot></slot>
          <div class="tag">
            {{ tag }}
          </div>
        </div>
        <el-menu class="menu"
                 router
                 text-color="#B6B196"
                 active-text-color="#FFFFFF"
                 background-color="rgba(0,0,0,0)">

          <div v-for="(item, index) in menus" :key="index">
            <el-menu-item :index="item.path">
              <i :class="item.iconClass" style="margin-left: 10px;"/>
              <span style="margin-left: 10px;">{{ item.viewName }}</span>
            </el-menu-item>
          </div>
        </el-menu>
      </div>
    </el-card>
  </el-aside>
</template>

<script>
  export default {
    name: "TheAside",
    props: ["menus", "tag"],
    data() {
      return {
        // menus: [],
        // tag: "叁川故里"
      }
    },
    created() {
      // this.menus = this.$router.options.routes[3].children;
      console.log(this.menus);
    }
  }
</script>

<style scoped>
  .card {
    background-image: url("/src/assets/images/background/aside-background.jpg");
    margin-top: 20%;
    margin-left: 15%;
    height: 90%;
    width: 180px;
    border-radius: 10px;
  }

  .tag {
    text-align: center;
    font-size: large;
    font-weight: bold;
    margin-top: 5px;
    margin-bottom: 10px;
  }

  .menu {
    border-right: 0;
  }
</style>