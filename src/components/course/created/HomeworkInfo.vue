<template>
  <div>
    <el-card>
      <el-button type="primary"
                 style="margin-bottom: 10px"
                 @click="dialogShowFlag = true">发布新作业</el-button>
      <el-collapse
          v-for="(item, index) in homeworkList"
          :key="index">
        <el-collapse-item :name="index">
          <template slot="title">
            <el-col :span="8">
              <span style="font-weight: bold">{{ item.title }}</span>
            </el-col>
            <el-col :span="11">
              <span style="font-weight: bold">提交时间:</span>
              <span>
                {{ item.gmtCreate }} &nbsp;-&nbsp; {{ item.gmtExpire }}
              </span>
            </el-col>
            <el-col :span="4">
              <el-link
                  type="primary"
                  :underline="false"
                  @click="getSubmittedList(item.homeworkId, item.title)">
                查看提交列表
              </el-link>
            </el-col>
            <el-col :span="1">
              <template>
                <el-popconfirm
                    title="确定删除该作业?"
                    icon="el-icon-info"
                    icon-color="red"
                    @confirm="delHomework(item.homeworkId)">
                  <el-link
                      slot="reference"
                      type="danger"
                      :underline="false">
                    <i class="fa fa-trash-o"/>
                  </el-link>
                </el-popconfirm>
              </template>
            </el-col>
          </template>
          <div style="white-space: pre-wrap">{{ item.content }}</div>
        </el-collapse-item>
      </el-collapse>
    </el-card>

    <el-dialog :visible.sync="dialogShowFlag" title="发布新作业">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="标题">
          <el-input v-model="form.title"></el-input>
        </el-form-item>
        <el-form-item label="内容">
          <el-input type="textarea" v-model="form.content"></el-input>
        </el-form-item>
        <el-form-item label="截止时间">
            <el-date-picker
                type="datetime"
                placeholder="选择日期"
                v-model="form.gmtExpire"
                style="width: 100%;"
                :align="'center'"></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">立即发布</el-button>
          <el-button @click="dialogShowFlag = false">取消</el-button>
        </el-form-item>
        <span style="color: red; font-size: small">*没有添加数据格式校验</span>
      </el-form>
    </el-dialog>

    <el-dialog :visible.sync="submittedListFlag">
      <template slot="title">
        <el-button type="primary" @click="downloadAll">下载作业</el-button>
        <span style="color: red">*下载过程还没有加流程提示</span>
      </template>
      <div style="margin-top: -25px">
        <el-tabs v-model="activeName">
          <el-tab-pane label="已提交" name="first">
            <el-table :data="submitList" style="width: 100%">
              <el-table-column prop="studentClazz" label="班级" width="180">
              </el-table-column>
              <el-table-column prop="studentNumber" label="学号" width="180">
              </el-table-column>
              <el-table-column prop="studentName" label="姓名" width="180">
              </el-table-column>
              <el-table-column prop="resourceName" label="作业">
                <template slot-scope="scope">
                  <el-link
                    type="primary"
                    target="_blank"
                    :underline="false"
                    @click="download(scope.row.resourceUrl,
                     scope.row.studentInfo + '-' +  scope.row.resourceName)">
                    {{ scope.row.resourceName }}
                  </el-link>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="未提交" name="second">
            <el-table :data="notSubmitList" style="width: 100%">
              <el-table-column prop="studentClazz" label="班级" width="180">
              </el-table-column>
              <el-table-column prop="studentNumber" label="学号" width="180">
              </el-table-column>
              <el-table-column prop="studentName" label="姓名" width="180">
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-dialog>
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
        courseName: '',

        homeworkList: [{
          homeworkId: '',
          title: '',
          content: '',
          gmtCreate: '',
          gmtExpire: '',
        }],

        dialogShowFlag: false,
        form: {
          title: '',
          content: '',
          gmtExpire: '',
        },

        submittedListFlag: false,
        activeName: 'first',
        submitList: [{studentInfo: ''}],
        notSubmitList: [],

        // 正在处理的
        homeworkId: '',
        homeworkName: '',

        // 消除警告
        zipUrl: '',

      }
    },
    created() {
      this.courseId = this.$route.query.courseId;
      this.service.get("assign/" + this.courseId)
          .then(res => {
            console.log(res);
            this.homeworkList = res.data;
          })
      this.service.get("course/" + this.courseId)
          .then(res => {
            console.log(res);
            this.courseName = res.data.courseName;
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

      downloadAll() {
        this.$message.success("已经响应请求, 速度较慢, 请耐心等待");
        this.service.get("/submit/" + this.homeworkId)
            .then(res => {
              console.log(res)
              this.download(res.data.zipUrl,
                  this.courseName + "-" + this.homeworkName + ".zip");
            })
      },

      getSubmittedList(homeworkId, homeworkName) {
        this.homeworkId = homeworkId;
        this.homeworkName = homeworkName;
        console.log(homeworkId, homeworkName);

        this.service.get("/submit/has/" + homeworkId)
            .then(res => {
              console.log(res);
              this.submitList = res.data;
            })
        this.service.get("/submit/not/" + homeworkId)
            .then(res => {
              console.log(res);
              this.notSubmitList = res.data;
            })

        this.submittedListFlag = true;

      },
      delHomework(homeworkId) {
        console.log("删除", homeworkId);
        this.$message.error("删除未实现");
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