<template>
  <div>
    <el-card>
      <el-button type="primary" @click="dialogVisible = true">上传资料</el-button>
      <el-table :data="resourceList" style="width: 100%">
        <el-table-column label="文件名">
          <template slot-scope="scope">
            <el-link
                type="primary"
                target="_blank"
                :underline="false"
                @click="download(scope.row.resourceUrl, scope.row.resourceName)">
              {{ scope.row.resourceName }}
            </el-link>
          </template>
        </el-table-column>
        <el-table-column prop="resourceSize" label="文件大小"></el-table-column>
        <el-table-column prop="gmtCreate" label="上传时间"></el-table-column>
      </el-table>
      <span style="color: red">差一个文件名修改, 时间格式化, 文件大小单位</span>
      <br/>
      <span style="color: red">添加一个搜索, 删除</span>
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
        <div class="el-upload__tip" slot="tip">*文件大小不超过 1 GB</div>
      </el-upload>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "MaterialInfo",
    data() {
      return {
        courseId: '',
        resourceList: [],
        dialogVisible: false,
      }
    },
    created() {
      this.courseId = this.$route.query.courseId;
      console.log(this.$route.query);
      this.getResourceList();
    },
    methods: {
      getResourceList() {
        this.service.get("course-resource/" + this.courseId)
            .then(res => {
              console.log(res);
              if (res.code !== 1) {
                this.$message.error("网络异常");
                return ;
              }
              this.resourceList = res.data;
            })
      },
      uploadFile(file) {
        console.log(file)

        let resource = new FormData();
        resource.append("resource", file.file);

        this.service.post("upload/resource", resource)
            .then(res => {
              console.log(res);
              if (res.code !== 1) {
                this.$message.error("上传失败");
                return ;
              }
              let courseResource = {
                courseId: this.courseId,
                resourceName: file.file.name,
                resourceSize: file.file.size,
                resourceUrl: res.data.resource,
              }
              console.log(courseResource);
              this.service.post("course-resource", courseResource)
                  .then(res => {
                    console.log(res);
                    if (res.code !== 1) {
                      this.$message.error(res.msg);
                      return ;
                    }
                    this.$message.success("上传成功");
                    this.resourceList.push(res.data);
                  })

            })

        this.dialogVisible = false;
      },
      beforeCoverUpload(file) {
        console.log(file)
        const isLt1GB = file.size < 1024 * 1024 * 1024;

        if (!isLt1GB) {
          this.$message.error('上传文件大小不能超过 1GB!');
        }
        return isLt1GB;
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