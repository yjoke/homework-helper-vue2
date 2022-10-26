<template>
  <div>
    <el-card>
      <span v-if="homeworkList.length === 0"></span>
      <el-collapse
          v-else
          v-for="(item, index) in homeworkList"
          :key="index">
        <el-collapse-item :name="index">
          <template slot="title">
            <el-col :span="6">
              <span style="font-weight: bold">{{ item.title }}</span>
            </el-col>
            <el-col :span="12">
              <span style="font-weight: bold">提交时间:</span>
              <span>
                {{ item.gmtCreate }}&nbsp;-&nbsp;{{ item.gmtExpire }}
              </span>
            </el-col>
            <el-col :span="3">
              <span style="color: green" v-if="item.submitted">已提交</span>
              <span style="color: red" v-else>未提交</span>
            </el-col>
            <el-col :span="3">
              <span style="color: red" v-if="item.expired">已截止</span>
              <span style="color: green" v-else>未截止</span>
            </el-col>
          </template>

          <div style="white-space: pre-wrap">{{ item.content }}</div>
          <div style="margin-top: 10px;" v-if="!item.expired">
            <el-col :span="20">
              <span v-if="item.submitted">
                已提交作业:
                <el-link
                    type="primary"
                    target="_blank"
                    :underline="false"
                    @click="download(item.homeworkFileUrl, item.homeworkFileName)">
                  {{ item.homeworkFileName }}
                </el-link>
              </span>
              <span v-else>&nbsp;</span>
            </el-col>
            <el-col :span="4">
              <el-button
                  type="primary"
                  size="small"
                  @click="submitHomework(index)">
                {{ item.submitted ? "重新上传" : "上传作业" }}
              </el-button>
            </el-col>
          </div>
        </el-collapse-item>
      </el-collapse>
    </el-card>

    <el-dialog
        title="文件上传"
        :visible.sync="dialogVisible"
        width="27%">
      <el-upload
          class="upload-demo"
          drag
          action="#"
          :http-request="uploadFile"
          :show-file-list="false"
          :multiple="false"
          :before-upload="beforeCoverUpload">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">*文件大小不超过 100 MB</div>
      </el-upload>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "HomeworkInfo",
    data() {
      return {
        courseId: '',
        homeworkList: [{
          homeworkId: '',
          title: '',
          content: '',
          gmtCreate: '',
          gmtExpire: '',
          expired: false,

          submitted: false,
          homeworkFileName: '',
          homeworkFileUrl: '',
        }],

        dialogVisible: false,
        homeworkListIndex: '',
        homework: '',
      }
    },
    created() {
      this.courseId = this.$route.query.courseId;
      this.service.get("assign/" + this.courseId)
          .then(res => {
            console.log(res);
            this.homeworkList = res.data;
          })
    },
    methods: {
      onSubmit() {
        this.form.courseId = this.courseId;
        this.service.post("assign", this.form)
            .then(res => {
              console.log(res);
              if (res.code === 0 || res.code === -1) {
                this.$message.error(res.msg);
                return;
              }
              this.homeworkList.push(res.data);
              this.dialogShowFlag = false;
              this.form = {
                title: '',
                content: '',
                gmtExpire: '',
              };
              this.$message.success(res.msg);
            });
      },
      submitHomework(index) {
        console.log(index);
        this.homeworkListIndex = index;
        let homeworkInfo = this.homeworkList[this.homeworkListIndex];
        console.log(homeworkInfo);
        this.dialogVisible = true;
      },
      uploadFile(file) {
        console.log(file)

        let homework = new FormData();
        homework.append("homework", file.file);
        let homeworkInfo = this.homeworkList[this.homeworkListIndex];
        console.log(homeworkInfo);

        this.service.post("upload/homework", homework)
            .then(res => {
              console.log(res);
              if (res.code !== 1) {
                this.$message.error("上传失败");
                return ;
              }
              let submitResource = {
                assignId: homeworkInfo.homeworkId,
                resourceName: file.file.name,
                resourceSize: file.file.size,
                resourceUrl: res.data.homework,
              }
              let fileUrl = res.data.homework;
              console.log(submitResource);
              this.service.post("submit", submitResource)
                  .then(res => {
                    console.log(res);
                    if (res.code !== 2) {
                      this.$message.error(res.msg);
                      return ;
                    }
                    let newHomework = {
                      homeworkId: homeworkInfo.homeworkId,
                      title: homeworkInfo.title,
                      content: homeworkInfo.content,
                      gmtCreate: homeworkInfo.gmtCreate,
                      gmtExpire: homeworkInfo.gmtExpire,
                      expired: homeworkInfo.expired,

                      submitted: true,
                      homeworkFileName: file.file.name,
                      homeworkFileUrl: fileUrl,
                    }

                    this.homeworkList.splice(this.homeworkListIndex, 1, newHomework);
                    this.$message.success("上传成功");
                  })

            })

        this.dialogVisible = false;
      },
      beforeCoverUpload(file) {
        console.log(file)
        const isLt100M = file.size < 100 * 1024 * 1024;

        if (!isLt100M) {
          this.$message.error('上传文件大小不能超过 100M!');
        }
        return isLt100M;
      },

      download(downloadUrl, downloadFileName) {
        this.getBlob(downloadUrl).then(blob => {
          this.saveAs(blob, downloadFileName);
        });
      },
      getBlob(url) {
        return new Promise(resolve => {
          const xhr = new XMLHttpRequest();

          xhr.open('GET', url, true);
          xhr.responseType = 'blob';
          xhr.onload = () => {
            if (xhr.status === 200) {
              resolve(xhr.response);
            }
          };

          xhr.send();
        });
      },
      saveAs(blob, filename) {
        if (window.navigator.msSaveOrOpenBlob) {
          navigator.msSaveBlob(blob, filename);
        } else {
          const link = document.createElement('a');
          const body = document.querySelector('body');

          let binaryData = [];
          binaryData.push(blob);
          link.href = window.URL.createObjectURL(new Blob(binaryData));
          link.download = filename;

          // fix Firefox
          link.style.display = 'none';
          body.appendChild(link);

          link.click();
          body.removeChild(link);

          window.URL.revokeObjectURL(link.href);
        }
      },
    }
  }
</script>

<style scoped>

</style>