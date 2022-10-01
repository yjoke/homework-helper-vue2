<template>
  <el-card>
    <el-tabs v-model="activeName">
      <el-tab-pane label="修改课程信息信息" name="first">
        <div>
          <el-form ref="form" :model="form" :rules="rules">
            <el-form-item prop="courseImg" label="课程封面" :label-width="formLabelWidth">
              <div v-if="editFlag">
                <el-image :src="courseInfo.courseImg" class="cover"/>
              </div>
              <el-upload v-else
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
            <el-form-item prop="courseName" label="课程名字" :label-width="formLabelWidth">
              <span v-if="editFlag">{{ courseInfo.courseName }}</span>
              <el-input v-else
                        v-model="form.courseName"
                        placeholder="请输入课程名字"
                        style="width: 20%"></el-input>
            </el-form-item>
          </el-form>
          <el-button
              :type="editFlag ? 'primary' : 'info'"
              @click="editFlag ? edit() : cancel()">
            {{ editFlag ? "修改" : "取消" }}
          </el-button>
          <el-button v-if="editFlag" type="danger" @click="delCourse"> 删除课程 </el-button>
          <el-button v-if="!editFlag" type="success" @click="submitInfo('form')"> 确认 </el-button>
        </div>
      </el-tab-pane>

      <el-tab-pane label="课程邀请码" name="second">
        <div style="margin-left: 20px">
          <el-descriptions>
            <el-descriptions-item label="课程邀请码">
              <el-tag size="small"> {{ code }} </el-tag>
            </el-descriptions-item>
          </el-descriptions>
          <el-button type="warning" size="small" @click="modifyCode">
            {{ code === '' ? '生成邀请码' : '重新生成'}}
          </el-button>
          <el-button type="primary" size="small" @click="copyCode"> 复制 </el-button>
          <br/><br/>
          <span class="codeComment"> *邀请码有效期七天</span>
        </div>
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script>

  export default {
    name: "CourseInfo",
    data() {
      return {
        courseId: '',

        activeName: 'second',
        editFlag: true,
        formLabelWidth: '100px',
        courseInfo: {
          courseName: '',
          courseImg: '',
        },
        form: {
          courseName: '',
          courseImg: '',
        },
        rules: {
          courseName: [
            {required: true, message: "请输入课程名称", trigger: "blur"},
            {max: 16, message: "长度最大为 16", trigger: "blur"}
          ]
        },

        code: '',
      }
    },
    created() {
      this.courseId = this.$route.query.courseId;
      this.service.get("course/" + this.courseId)
          .then(res => {
            console.log(res);
            this.courseInfo.courseImg = res.data.courseImg;
            this.courseInfo.courseName = res.data.courseName;
          })
      this.service.get("course/code/" + this.courseId)
          .then(res => {
            console.log(res);
            this.code = res.data.code;
          })
    },
    methods: {
      uploadCover(file) {
        console.log(file)
        let cover = new FormData();
        cover.append("cover", file.file);
        this.service.post("/upload/cover", cover)
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
      edit() {
        this.editFlag = false;
        this.form = JSON.parse(JSON.stringify(this.courseInfo));
      },
      cancel() {
        this.editFlag = true;
      },
      submitInfo(form) {
        console.log(this.form);
        this.$refs[form].validate(valid => {
          console.log(valid);
          if (valid) {
            if (JSON.stringify(this.form) !== JSON.stringify(this.courseInfo)) {
              this.form.id = this.courseId;
              this.service.put("/course", this.form)
                  .then(res => {
                    console.log(res);
                    if (res.code === 2) {
                      this.courseInfo = JSON.parse(JSON.stringify(this.form));
                      this.$message.success("信息修改成功");
                      setTimeout(() => location.reload(), 500);
                    } else {
                      this.$message.error("信息修改失败");
                    }
                  })
                  .catch(() => {this.$message.error("信息修改失败")})
            }
            this.editFlag = true;
          }
        })
      },
      delCourse() {
        this.$confirm("自动作将会删除课程相关的所有数据, 是否继续?", "提示", {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
          this.service.delete("course/" + this.courseId)
              .then(res => {
                this.$message.error(res.msg);
              })
        })
      },

      modifyCode() {
        // TODO 没有添加友好的提示
        let message = '生成邀请码?';
        if (this.code !== '') message = '当前邀请码 ' + this.code + ' 将会失效, 是否继续?';
        this.$confirm(message, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.service.put("course/code/" + this.courseId)
              .then(res => {
                console.log(res)
                this.code = res.data.code;
              })
        })
      },
      copyCode() {
          // 模拟 输入框
          let cInput = document.createElement("input");
          cInput.value = this.code;

          document.body.appendChild(cInput);
          cInput.select(); // 选取文本框内容

          // 执行浏览器复制命令
          // 复制命令会将当前选中的内容复制到剪切板中（这里就是创建的input标签）
          // Input要在正常的编辑状态下原生复制方法才会生效

          document.execCommand("copy");

          this.$message({
            type: "success",
            message: "邀请码已成功复制到剪贴板"
          });
          // 复制成功后再将构造的标签 移除
          document.body.removeChild(cInput);

      }
    }
  }
</script>

<style scoped>
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

  .codeComment {
    font-size: small;
    color: red;
  }
</style>