<template>
  <div>
    <the-header>{{ name }}</the-header>
    <el-container class="content">
      <the-aside :menus="this.$router.options.routes[5].children" :tag="name">
        <el-image class="image" :src="src"/>
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
    name: "CreatedCoursePage",
    components: {
      TheFooter,
      TheAside,
      TheHeader
    },
    data() {
      return {
        name: "",
        src: ''
      };
    },
    created() {
      let courseId = this.$route.query.courseId;
      this.service.get("course/" + courseId)
          .then(res => {
            console.log(res);
            this.src = res.data.courseImg;
            this.name = res.data.courseName;
          })
    },
  }
</script>

<style scoped>
  .image {
    border-radius: 10%;
    width: 140px;

    overflow: hidden;
    margin-top: 10px;
    margin-left: -70px;
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