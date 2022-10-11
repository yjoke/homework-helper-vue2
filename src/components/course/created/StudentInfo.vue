<template>
  <el-card>
    <el-button type="primary">新增学生</el-button>
    <el-table :data="studentList" style="width: 100%">
      <el-table-column label="头像"></el-table-column>
      <el-table-column prop="clazz" label="班级"></el-table-column>
      <el-table-column prop="name" label="姓名"></el-table-column>
      <el-table-column prop="number" label="学号"></el-table-column>
      <el-table-column prop="phone" label="手机号"></el-table-column>
    </el-table>
    <br/>
    <span style="color: red">还差一个成绩, 差一个操作, 差一个头像显示, 差分页, 差排序, 差搜索</span>
  </el-card>
</template>

<script>
  export default {
    name: "StudentInfo",
    data() {
      return {
        courseId: '',
        studentList: [],
      }
    },
    created() {
      this.courseId = this.$route.query.courseId;
      this.service.get("select/student-list/" + this.courseId)
          .then(res => {
            console.log(res);
            this.studentList = res.data;
          })
    }
    // TODO 还差一个成绩, 差一个操作, 差一个头像显示, 差分页, 差排序, 差搜索
  }
</script>

<style scoped>

</style>