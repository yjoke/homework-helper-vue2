<template>
  <div>
    <the-header :avatar="avatar">{{ username }}</the-header>
    <el-container>
      <the-aside/>

      <el-main>
        <div class="cont">
          <router-view></router-view>
        </div>
      </el-main>
<!--      <the-footer/>-->
    </el-container>
  </div>
</template>

<script>
  import TheHeader from "@/components/common/TheHeader";
  import TheAside from "@/components/common/TheAside";

  export default {
    name: "TestPage",
    data() {
      return {
        username: "叁川故里",
        avatar: "http://yjoker.work/resource/hdimg.jpg",
      };
    },
    components: {
      TheAside,
      TheHeader

    },
    methods: {
    }

  };
</script>

<style scoped>
</style>