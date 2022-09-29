<template>
  <div>
    <el-card>
      <el-divider></el-divider>
      <div>
        <span>还没有作业的相关东西</span>
      </div>
      <el-divider></el-divider>
      <div>
        <panda-men/>
      </div>
    </el-card>
  </div>
</template>

<script>

  import PandaMen from "@/components/PandaMen";
  export default {
    name: "HomeworkInfo",
    components: {PandaMen},
    data() {
      return {
        courseId: '',
        count: 0,
      }
    },
    created() {
      this.courseId = this.$route.query.courseId;
      // console.log(this.courseId);
      console.log(this.$route.query);
    },
    methods: {
      load () {
        this.count += 2
      }
    }
  }
</script>

<style scoped>

</style>