<template>
  <div>
    <div>
      <the-header/>
      <el-container class="content">
        <the-aside :menus="this.$router.options.routes[3].children" :tag="tag">
          <el-image class="image" :src="src"/>
        </the-aside>

        <el-main>
          <div class="cont">
            <router-view></router-view>
          </div>
          <the-footer/>
        </el-main>
      </el-container>
    </div>
    <div>
      <el-dialog
          :visible.sync="dialogPerfectInfo"
          title="信息完善"
          :before-close="dialogClose">

        <div>
          <el-form ref="form" :model="form" :rules="rules">
            <el-form-item prop="avatar" label="头像" :label-width="formLabelWidth">
              <el-upload
                  class="avatar-uploader"
                  action="#"
                  :http-request="uploadAvatar"
                  accept="image/jpeg"
                  :show-file-list="false"
                  :multiple="false"
                  :before-upload="beforeAvatarUpload">
                <div v-if="src">
                  <el-image :src="src" class="avatar"/>
                </div>
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
            <el-form-item prop="clazz" label="班级" :label-width="formLabelWidth">
              <el-input
                  v-model="form.clazz"
                  placeholder="请输入班级"
                  style="width: 78%"></el-input>
            </el-form-item>
            <el-form-item prop="number" label="学号" :label-width="formLabelWidth">
              <el-input
                  v-model="form.number"
                  placeholder="请输入学号"
                  style="width: 78%"></el-input>
            </el-form-item>
            <el-form-item prop="name" label="姓名" :label-width="formLabelWidth">
              <el-input
                  v-model="form.name"
                  placeholder="请输入姓名"
                  style="width: 78%"></el-input>
            </el-form-item>
          </el-form>
        </div>

        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="uploadInfo('form')">提&nbsp;交</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import TheHeader from "@/components/common/TheHeader";
  import TheAside from "@/components/common/TheAside";
  import TheFooter from "@/components/common/TheFooter";

  export default {
    name: "UserHomePage",
    data() {
      return {
        tag: "",
        src: "",  // 侧边栏的图片地址
        form: {
          clazz: '',
          number: '',
          name: '',
          avatar: '',
        },
        rules: {
          clazz: [
            {required: true, message: "请输入班级", trigger: "blur"},
            {max: 16, message: "长度最大为 16", trigger: "blur"}
          ],
          number: [
            {required: true, message: "请输入学号", trigger: "blur"},
            {max: 16, message: "长度最大为 16", trigger: "blur"}
          ],
          name: [
            {required: true, message: "请输入名字", trigger: "blur"},
            {max: 16, message: "长度最大为 16", trigger: "blur"}
          ],
        },
        formLabelWidth: '100px',
        hasInfo: true,
        dialogPerfectInfo: false,
      };
    },
    components: {
      TheFooter,
      TheAside,
      TheHeader
    },
    created() {
      this.service.get("user")
          .then((res) => {
            console.log("登录信息: ", res);
            if (res.code === 0) {
              this.hasInfo = false;
              this.dialogPerfectInfo = true;
              this.$message.error(res.msg);
            } else if (res.code === 1) {
              this.tag = res.data.name;
              this.src = res.data.avatar;
            }
          })
    },
    methods: {
      dialogClose(done) {
        if (this.hasInfo) done()
        else this.dialogPerfectInfo = true;
      },
      uploadInfo(form) {
        console.log(this.form);
        this.$refs[form].validate(valid => {
          console.log(valid);
          if (valid) {
            this.service.post("/user/upload-info", this.form)
                .then(res => {
                  console.log(res);
                  let message = this.$message.error;
                  if (res.code === 2) {
                    this.tag = this.form.name;
                    this.hasInfo = true;
                    this.dialogPerfectInfo = false;
                    message = this.$message.success;
                  }
                  message(res.msg);
                })
          }
        })
      },

      uploadAvatar(file) {
        console.log(file)
        let avatar = new FormData();
        avatar.append("avatar", file.file);
        this.service.post("/upload/avatar", avatar)
            .then(res => {
              console.log(res);
              if (res.code === 1) {
                this.src = res.data.avatar;
                this.form.avatar = this.src;
              } else this.$message.error(res.msg);
            })
            .catch(err => {
              console.log(err)
              this.$message.error(err.msg);
            })

      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt4M = file.size / 1024 / 1024 < 4;

        if (!isJPG) {
          this.$message.error('只能上传图片!');
        }
        if (!isLt4M) {
          this.$message.error('上传头像图片大小不能超过 4MB!');
        }
        return isJPG && isLt4M;
      }

    },

  };
</script>

<style scoped>
  .image {
    border-radius: 50%;
    height: 60px;
    width: 60px;

    overflow: hidden;
    margin-top: 20px;
    margin-left: -30px;
    left: 50%;
  }

  .content {
    position: absolute;
    width: 100%;
    top: 60px;
    bottom: 0;
  }

  .cont {
    margin-top: 20px;
    margin-block: 20px;
  }


  .avatar-uploader {
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    line-height: 100px;
    text-align: center;
  }

  .avatar {
    width: 100px;
    height: 100px;
    display: block;
    border-radius: 50%;
  }
</style>