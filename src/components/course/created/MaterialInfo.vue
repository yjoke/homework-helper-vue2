<template>
  <panda-men>{{ courseId }}</panda-men>
</template>

<script>
  import PandaMen from "@/components/PandaMen";
  export default {
    name: "MaterialInfo",
    components: {PandaMen},
    data() {
      return {
        courseId: '',
      }
    },
    created() {
      this.courseId = this.$route.query.courseId;
      // console.log(this.courseId);
      console.log(this.$route.query);
    }
  }
</script>

<style scoped>

</style>