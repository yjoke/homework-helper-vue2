<template>
  <el-header class="el-header">
    <div class="title">石铁大作业帮</div>
    <div style="position:relative">
      <el-image class="el-image" :src="src"/>
      <span tabindex="0">
          <slot></slot>
      </span>
    </div>
  </el-header>
</template>

<script>
  export default {
    name: "TheHeader",
    props: ["avatar"],
    data() {
      return {
        src: this.avatar,
      }
    }
  }
</script>

<style scoped>
  .el-header {
    background-image: url("/src/assets/images/background/head-background.jpg");
    color: #FFF;
    line-height: 60px;
    display: flex;
    justify-content: space-between;
    background-size: cover;
  }

  .title {
    width: 200px;
    font-size: 24px;
  }

  .el-image {
    border-radius: 50%;
    height: 30px;
    width: 30px;

    overflow: hidden;
    vertical-align: middle;
    margin-right: 5px;
  }
</style>