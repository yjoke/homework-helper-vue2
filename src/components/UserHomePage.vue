<template>
  <div>
    <the-header :avatar="avatar">{{ name }}</the-header>
    <el-container class="content">
      <the-aside :menus="this.$router.options.routes[3].children" :tag="name">
        <el-image class="image" src='http://yjoker.work/resource/hdimg.jpg'/>
      </the-aside>

      <el-main>
        <div class="cont">
          <router-view></router-view>
        </div>
        <the-footer/>
      </el-main>
    </el-container>
  </div>
</template>

<script>
  import TheHeader from "@/components/common/TheHeader";
  import TheAside from "@/components/common/TheAside";
  import TheFooter from "@/components/common/TheFooter";

  export default {
    name: "UserHomePage",
    data() {
      return {
        name: "叁川故里",
        avatar: "http://yjoker.work/resource/hdimg.jpg",
      };
    },
    components: {
      TheFooter,
      TheAside,
      TheHeader

    },
    methods: {}

  };
</script>

<style scoped>
  .image {
    border-radius: 50%;
    height: 60px;
    width: 60px;

    overflow: hidden;
    margin-top: 20px;
    margin-left: -30px;
    left: 50%;
  }

  .content {
    position: absolute;
    width: 100%;
    top: 60px;
    bottom: 0;
  }

  .cont {
    margin-top: 20px;
    margin-block: 20px;
  }
</style>