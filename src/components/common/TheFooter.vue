<template>
  <div class="theFooter">
    <el-footer>
      <el-card>
        <div style="text-align: center">
          &copy;{{ time }}&nbsp;&nbsp;by&nbsp;&nbsp;
          <a href="http://yjoker.work" target="_blank">{{ author }}</a>
        </div>
      </el-card>
    </el-footer>
  </div>
</template>

<script>
  export default {
    name: "TheFooter",
    data () {
      return {
        time: "2022.09",
        author: "叁川故里",
      }
    }
  }
</script>

<style scoped>
  .theFooter {
    bottom: 0;
  }
</style>