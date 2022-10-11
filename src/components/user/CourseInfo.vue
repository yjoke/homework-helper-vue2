<template>
  <div>
    <el-card>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="我学的课" name="first">
          <div>
            <el-button class="button" type="primary" @click="addCourse">加入课程</el-button>
          </div>

          <div v-if="addedCourses[0].id !== ''">
            <div v-for="(item, index) in addedCourses" :key="index" style="margin-bottom: 10px">
              <el-row :gutter="20" v-if="index % 4 === 0">
                <div v-for="(im, ix) in addedCourses" :key="ix">
                  <el-col :span="6" v-if="ix >= index && ix < index + 4">
                    <el-card
                        @click.native="skipAdded(ix)"
                        :body-style="{ padding: '0px' }"
                        style="border-radius: 5%"
                        shadow="hover">
                      <el-image :src="im.courseImg" class="imgList"/>
                      <div style="padding: 14px;">
                        <span>{{ im.courseName }}</span><br/>
                        <span style="font-size: small; margin-top: 2px">{{ im.createUserName }}</span>
                      </div>
                    </el-card>
                  </el-col>
                </div>
              </el-row>
            </div>
          </div>
          <div v-else>
            <span>你没有创建过任何课程</span>
          </div>

        </el-tab-pane>

        <el-tab-pane label="我交的课" name="second">
          <div>
            <el-button class="button" type="primary"  @click="drawer = true">创建课程</el-button>
          </div>

          <div v-if="courses[0].id !== ''">
            <div v-for="(item, index) in courses" :key="index" style="margin-bottom: 10px">
              <el-row :gutter="20" v-if="index % 4 === 0">
                <div v-for="(im, ix) in courses" :key="ix">
                  <el-col :span="6" v-if="ix >= index && ix < index + 4">
                    <el-card
                        @click.native="skipCreated(ix)"
                        :body-style="{ padding: '0px' }"
                        style="border-radius: 5%"
                        shadow="hover">
                      <el-image :src="im.courseImg" class="imgList"/>
                      <div style="padding: 14px;">
                        <span>{{ im.courseName }}</span>
                      </div>
                    </el-card>
                  </el-col>
                </div>
              </el-row>
            </div>
          </div>
          <div v-else>
            <span>你没有创建过任何课程</span>
          </div>


        </el-tab-pane>
      </el-tabs>
    </el-card>

    <el-drawer
      title="创建课程"
      :visible.sync="drawer">
      <div>
        <el-form @submit.native.prevent ref="form" :model="form" :rules="rules">
          <el-form-item prop="courseName" label="课程名字" :label-width="formLabelWidth">
            <el-input
                v-model="form.courseName"
                placeholder="请输入课程名称"
                style="width: 78%"></el-input>
          </el-form-item>
          <el-form-item label="课程封面图" :label-width="formLabelWidth">
            <el-upload
                class="cover-uploader"
                action="#"
                :http-request="uploadCover"
                accept="image/jpeg"
                :show-file-list="false"
                :multiple="false"
                :before-upload="beforeCoverUpload">
              <div v-if="form.courseImg">
                <el-image :src="form.courseImg" class="cover"/>
              </div>
              <i v-else class="el-icon-plus cover-uploader-icon"></i>
            </el-upload>
          </el-form-item>
          <el-button
              style="margin-left: 10px;"
              type="success"
              @click="uploadCourseInfo('form')">创&nbsp;建</el-button>
        </el-form>

      </div>
    </el-drawer>

  </div>
</template>

<script>

  export default {
    name: "CourseInfo",
    data() {
      return {
        activeName: 'first',
        catchFlag: false,

        addedCourses: [{
          id: '',
          courseImg: '',
          courseName: '',
          createUserName: '',
        }],

        courses: [{
          id: '',
          courseImg: '',
          courseName: '',
        }],

        drawer: false,
        formLabelWidth: "100px",
        form: {
          courseName: '',
          courseImg: '',
        },
        rules: {
          courseName: [
            {required: true, message: "请输入课程名称", trigger: "blur"},
            {max: 16, message: "长度最大为 16", trigger: "blur"}
          ]
        }


      };
    },
    created() {
      this.getAdded();
    },
    methods: {
      handleClick(tab) {
        console.log("tab: ", tab);
        console.log(tab.index)
        if (!this.catchFlag && tab.index === '1') {
          this.getCreated();
          this.catchFlag = true;
        }

      },
      getAdded() {
        this.service.get("course/added")
            .then(res => {
              console.log(res.msg);
              if (res.code === 1) {
                if (res.data.length !== 0) this.addedCourses = res.data;
              }
            })
      },
      getCreated() {
        this.service.get("course/created")
            .then(res => {
              console.log(res);
              if (res.code === 1) {
                if (res.data.length !== 0) this.courses = res.data;
              }
            })
      },
      uploadCover(file) {
        console.log(file)
        let cover = new FormData();
        cover.append("cover", file.file);
        this.service.post("upload/cover", cover)
            .then(res => {
              console.log(res);
              if (res.code === 1) {
                this.form.courseImg = res.data.courseImg;
                this.$message.success("上传成功");
              } else this.$message.error(res.msg);
            })
            .catch(err => {
              console.log(err)
              this.$message.error(err.msg);
            })

      },
      beforeCoverUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt5M = file.size / 1024 / 1024 < 5;

        if (!isJPG) {
          this.$message.error('只能上传图片!');
        }
        if (!isLt5M) {
          this.$message.error('上传封面图片大小不能超过 5MB!');
        }
        return isJPG && isLt5M;
      },
      uploadCourseInfo(form) {
        console.log(form)
        this.$refs[form].validate(valid => {
          if (valid) {
            this.service.post("/course/created", this.form)
                .then(res => {
                  console.log("uploadCourse", res);
                  if (res.code === 1) {
                    this.drawer = false;
                    let newCourse = {
                      id: res.data.id,
                      courseImg: this.form.courseImg,
                      courseName: this.form.courseName,
                    };
                    this.form = {
                      courseName: '',
                      courseImg: '',
                    }
                    if (this.courses[0].id === '') this.courses = [];
                    this.courses.push(newCourse);
                    this.$message.success("创建成功");
                  } else {
                    this.$message.error(res.msg);
                  }
                }).catch(() => this.$message.error("网络异常"));
          }
        })
      },
      addCourse() {
        this.$prompt('请输入邀请码', '添加课程', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        })
        .then(({value}) => {
          this.service.post("course/added/" + value)
              .then(res => {
                console.log(res);
                if (res.code !== 1) {
                  this.$message.error(res.msg);
                  return ;
                }

                if (this.addedCourses[0].id === '') this.addedCourses = [];
                this.addedCourses.push(res.data);
                this.$message.success("创建成功");
              })
        })
      },

      skipAdded(ix) {
        console.log(this.addedCourses[ix].courseName)
        let routerData = this.$router.resolve({
          name: 'addedCoursePage',
          query: {
            courseId: this.addedCourses[ix].id
          }
        })
        window.open(routerData.href, '_blank')
      },
      skipCreated(ix) {
        console.log(this.courses[ix].courseName)
        let routerData = this.$router.resolve({
          name: 'createdCoursePage',
          query: {
            courseId: this.courses[ix].id
          }
        })
        window.open(routerData.href, '_blank')
      },
    },
  }
</script>

<style scoped>
  .button {
    margin-top: 5px;
    margin-bottom: 15px;
  }

  .imgList {
    width: 100%;
    height: 150px;
    display: block;
    border-radius: 5%;
  }

  .cover-uploader {
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .cover-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 192px;
    height: 108px;
    line-height: 108px;
    text-align: center;
  }

  .cover {
    width: 192px;
    height: 108px;
    display: block;
    border-radius: 5%;
  }
</style>