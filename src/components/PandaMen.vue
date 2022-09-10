<template>
  <div>
    <slot></slot>
    <el-image :src="url"></el-image>
  </div>
</template>

<script>
  export default {
    name: "PandaMen",
    data () {
      return {
        url: require("@/assets/panda-men.jpg")
      }
    }
  }
</script>

<style scoped>

</style>