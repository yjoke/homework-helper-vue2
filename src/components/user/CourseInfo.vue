<template>
  <el-card>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="我学的课" name="first">
        <div>
          <el-button class="button" type="primary">添加课程</el-button>
        </div>
        <div>
          <el-row :gutter="20">
            <el-col :span="6">
              <el-card>1</el-card>
            </el-col>
            <el-col :span="6">
              <el-card>1</el-card>
            </el-col>
            <el-col :span="6">
              <el-card>1</el-card>
            </el-col>
            <el-col :span="6">
              <el-card>1</el-card>
            </el-col>
          </el-row>
        </div>
      </el-tab-pane>
      <el-tab-pane label="我交的课" name="second">配置管理</el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script>

  export default {
    name: "CourseInfo",
    data() {
      return {
        activeName: 'first'
      };
    },
    methods: {
      handleClick(tab, event) {
        console.log(tab, event);
      }
    }
  }
</script>

<style scoped>
  .button {
    margin-top: 5px;
    margin-bottom: 15px;
  }
</style>