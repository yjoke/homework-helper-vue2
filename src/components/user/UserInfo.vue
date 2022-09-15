<template>
  <el-card>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="修改个人信息" name="first">
        <div>
          <el-form ref="form" :model="form" :rules="rules">
            <el-form-item prop="avatar" label="头像" :label-width="formLabelWidth">
              <div v-if="editFlag">
                <el-image :src="userInfo.avatar" class="avatar"/>
              </div>
              <el-upload v-else
                         class="avatar-uploader"
                         action="#"
                         :http-request="uploadAvatar"
                         accept="image/jpeg"
                         :show-file-list="false"
                         :multiple="false"
                         :before-upload="beforeAvatarUpload">
                <div v-if="form.avatar">
                  <el-image :src="form.avatar" class="avatar"/>
                </div>
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
            <el-form-item prop="clazz" label="班级" :label-width="formLabelWidth">
              <span v-if="editFlag">{{ userInfo.clazz }}</span>
              <el-input v-else
                        v-model="form.clazz"
                        placeholder="请输入班级"
                        style="width: 20%"></el-input>
            </el-form-item>
            <el-form-item prop="number" label="学号" :label-width="formLabelWidth">
              <span v-if="editFlag">{{ userInfo.number }}</span>
              <el-input v-else
                        v-model="form.number"
                        placeholder="请输入学号"
                        style="width: 20%"></el-input>
            </el-form-item>
            <el-form-item prop="name" label="姓名" :label-width="formLabelWidth">
              <span v-if="editFlag">{{ userInfo.name }}</span>
              <el-input v-else
                        v-model="form.name"
                        placeholder="请输入姓名"
                        style="width: 20%"></el-input>
            </el-form-item>
          </el-form>
          <el-button
              :type="editFlag ? 'primary' : 'info'"
              @click="editFlag ? edit() : cancel()">
            {{ editFlag ? "修改" : "取消" }}
          </el-button>
          <el-button v-if="!editFlag" type="success" @click="submitInfo('form')">确认</el-button>
        </div>
      </el-tab-pane>
      <el-tab-pane label="修改手机号" name="second">
        <div>
          <el-form ref="phoneForm" :model="phoneForm" :rules="rules">
            <el-form-item prop="phone" label="新手机号" :label-width="formLabelWidth">
              <el-input
                  v-model="phoneForm.phone"
                  placeholder="请输入手机号"
                  style="width: 20%"></el-input>
            </el-form-item>
            <el-form-item prop="code" label="验证码" :label-width="formLabelWidth">
              <el-input
                  v-model="phoneForm.code"
                  placeholder="请输入验证码"
                  style="width: 20%"></el-input>
              <el-button
                  type="primary"
                  @click="getCode('phoneForm', 'phone')"
                  :disabled="disable">
                {{ codeButton }}
              </el-button>
            </el-form-item>
          </el-form>
          <el-button type="success" @click="submitPhone('phoneForm')">提交</el-button>
        </div>
      </el-tab-pane>
      <el-tab-pane label="修改密码" name="third">
        <div>
          <el-form ref="passwordForm" :model="passwordForm" :rules="rules">
            <el-form-item prop="password" label="密码" :label-width="formLabelWidth">
              <el-input
                  v-model="passwordForm.password"
                  placeholder="请输入新密码"
                  clearable
                  show-password
                  style="width: 20%"></el-input>
            </el-form-item>
            <el-form-item prop="password2" label="确认密码" :label-width="formLabelWidth">
              <el-input
                  v-model="passwordForm.password2"
                  placeholder="请再次输入密码"
                  clearable
                  show-password
                  style="width: 20%"></el-input>
            </el-form-item>
          </el-form>
          <el-button type="success" @click="submitPassword('passwordForm')">提交</el-button>
        </div>
      </el-tab-pane>
    </el-tabs>
    <v-code :show="isShow" @success="onSuccess" @close="isShow = false"/>
  </el-card>
</template>

<script>
  import VCode from "vue-puzzle-vcode"

  export default {
    name: "UserInfo",
    components: {
      VCode
    },
    data() {
      return {
        activeName: 'first',
        editFlag: true,
        userInfo: {
          clazz: '',
          number: '',
          name: '',
          avatar: '',
          phone: '',
        },
        form: {
          clazz: '',
          number: '',
          name: '',
          avatar: '',
          phone: '',
        },
        phoneForm: {
          phone: '',
          code: '',
        },
        passwordForm: {
          password: '',
          password2: '',
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

          phone: [
            {required: true, message: "请输入手机号", trigger: "blur"},
            {
              pattern: /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/,
              message: "请输入正确的手机号",
              trigger: "blur"
            },
          ],
          code: [
            {required: true, message: "请输入验证码", trigger: "blur"},
            {min: 6, max: 6, message: "请输入正确的六位验证码", trigger: "blur"},
          ],

          password: [
            {required: true, message: "请输入密码", trigger: "blur"},
            {min: 6, max: 18, message: "密码合法长度为 6~18 位", trigger: "blur"},
          ],
          password2: [
            {required: true, message: "请输入密码", trigger: "blur"},
            {
              required: true,
              validator: (rule, value, callback) => {
                if (value === this.passwordForm.password) callback()
                else callback(new Error('两次密码不一致'))
              },
              trigger: "blur"
            },
          ],
        },
        formLabelWidth: '100px',



        isShow: false,
        codeButton: "获取验证码",
        count: 120,
        disable: false,
      };
    },
    created() {
      this.service.get("user")
          .then((res) => {
            console.log("登录信息: ", res);
            if (res.code === 1) {
              this.userInfo = res.data;
            } else {
              this.$message.error("数据加载失败")
            }
          })
    },
    methods: {
      handleClick(tab, event) {
        console.log(tab, event);
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
      },

      edit() {
        this.editFlag = false;
        this.form = JSON.parse(JSON.stringify(this.userInfo));
      },
      cancel() {
        this.editFlag = true;
      },
      submitInfo(form) {
        console.log(this.form);
        this.$refs[form].validate(valid => {
          console.log(valid);
          if (valid) {
            if (JSON.stringify(this.form) !== JSON.stringify(this.userInfo)) {
              this.service.post("/user/upload-info", this.form)
                  .then(res => {
                    console.log(res);
                    if (res.code === 2) {
                      this.userInfo = JSON.parse(JSON.stringify(this.form));
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

      submitPhone(phoneForm) {
        console.log(phoneForm)
        this.$refs[phoneForm].validate(valid => {
          console.log(valid)
          if (valid) {
            this.service.post("/user/modify-phone", this.phoneForm)
                .then(res => {
                  console.log(res)
                  if (res.code === 1) {
                    this.$message.success("修改成功");
                    // 手机号修改成功, 修改 记住密码 和本地 token
                    let token = res.data.Authorization;
                    console.log("token: " + token);
                    localStorage.setItem("Authorization", "Bearer " + token);

                    let ps = localStorage.getItem("auto-memory-key");
                    let parse = JSON.parse(ps);
                    parse.phone = this.phoneForm.phone;
                    let newPs = {
                      phone: parse.phone,
                      password: parse.password
                    };
                    localStorage.setItem("auto-memory-key", JSON.stringify(newPs));
                    this.phoneForm = {
                      phone: '', code: ''
                    }
                  }
                  else this.$message.error(res.msg);
                })
                .catch(() => {this.$message.error("网络异常")})
          }
        })
      },
      onSuccess() {
        this.isShow = false;
        // 验证通过后执行,
        this.service.post('code', this.phoneForm)
            .then((res) => {
              console.log(res);
              if (res.code === 2) this.$message.success(res.msg);
              else this.$message.error(res.msg);
            })
        let timeout = setInterval(() => {
          if (this.count < 1) {
            this.disable = false;
            this.codeButton = "获取验证码";
            this.count = 120;
            clearInterval(timeout);
          } else {
            this.disable = true;
            this.codeButton = this.count-- + "s后重发";
          }
        }, 1000);
      },
      getCode(phoneForm, phone) {
        // 打开验证码对应的框
        console.log("into")
        this.$refs[phoneForm].validateField(phone, () => {
          let match = this.rules.phone[1].pattern.test(this.phoneForm.phone);
          if (match) {
            if (this.userInfo.phone === this.phoneForm.phone)
              this.$message.info("当前已经绑定该账号");
            else
              this.isShow = true;
          }
        });
        console.log("out")
      },
      submitPassword(passwordForm) {
        this.$refs[passwordForm].validate(valid => {
          if (valid) {
            this.service.post("/user/modify-password", this.passwordForm)
                .then(res => {
                  console.log(res)
                  if (res.code === 2) {
                    this.$message.success(res.msg);

                    let ps = localStorage.getItem("auto-memory-key");
                    let parse = JSON.parse(ps);
                    parse.password = this.passwordForm.password;
                    let newPs = {
                      phone: parse.phone,
                      password: parse.password
                    };
                    localStorage.setItem("auto-memory-key", JSON.stringify(newPs));
                    this.passwordForm = {
                      password: '', password2: ''
                    }
                  } else {
                    this.$message.error(res.msg);
                  }
                })
                .catch(() => this.$message.error("网络异常"))
          }
        })
      }
    }
  }
</script>

<style scoped>
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