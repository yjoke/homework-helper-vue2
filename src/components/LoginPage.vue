<template>
  <div class="loginBody">
    <div class="loginData">
      <div class="loginText">
        <h2 class="title">石铁大作业帮</h2>
      </div>

      <div class="formData">
        <el-form ref="form" :model="form" :rules="rules">
          <el-form-item prop="phone">
            <el-input
                v-model="form.phone"
                clearable
                placeholder="请输入手机号">
              <i slot="prefix" class="fa fa-mobile-phone" style="margin-left: 6px"/>
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
                v-model="form.password"
                clearable
                placeholder="请输入密码"
                show-password>
              <i slot="prefix" class="fa fa-key" style="margin-left: 6px"/>
            </el-input>
          </el-form-item>
        </el-form>
      </div>

      <div class="tool">
        <div><!--  @change="remember" -->
          <el-checkbox v-model="checked">记住密码</el-checkbox>
        </div>
        <div>
          <span class="forgetPassword" @click="forgetPassword">忘记密码？</span>
        </div>
      </div>

      <div class="button">
        <el-button type="primary" @click.native.prevent="login('form')">登录</el-button>
        <el-button class="register" @click="(dialogShowFlag = true) && (isRegister = true)">注册</el-button>
      </div>
    </div>

    <v-code :show="isShow" @success="onSuccess" @close="isShow = false"/>

    <el-dialog :title="isRegister ? '注册账号' : '忘记密码'" :visible.sync="dialogShowFlag"
               :modal-append-to-body="false">
      <el-form ref="registerForm" :model="registerForm" :rules="rules">
        <el-form-item prop="phone" :label-width="formLabelWidth">
          <el-input
              v-model="registerForm.phone"
              clearable
              placeholder="请输入手机号"
              style="width: 78%">
            <i slot="prefix" class="fa fa-mobile-phone" style="margin-left: 6px"/>
          </el-input>
        </el-form-item>
        <el-form-item prop="password" :label-width="formLabelWidth">
          <el-input
              v-model="registerForm.password"
              clearable
              placeholder="请输入密码"
              show-password
              style="width: 78%">
            <i slot="prefix" class="fa fa-key" style="margin-left: 6px"/>
          </el-input>
        </el-form-item>
        <el-form-item prop="password2" :label-width="formLabelWidth">
          <el-input
              v-model="registerForm.password2"
              clearable
              placeholder="请确认输入密码"
              show-password
              style="width: 78%">
            <i slot="prefix" class="fa fa-key" style="margin-left: 6px"/>
          </el-input>
        </el-form-item>

        <el-form-item prop="code" :label-width="formLabelWidth">
          <el-input
              v-model="registerForm.code"
              clearable
              placeholder="请输入验证码"
              style="width: 63%">
            <i slot="prefix" class="fa fa-cloud" style="margin-left: 6px"/>
          </el-input>
          <el-button
              type=primary
              @click="getCode"
              :disabled="disable">{{ codeButton }}
          </el-button>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogShowFlag = false">取 消</el-button>
        <el-button type="primary" @click="register('registerForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import VCode from "vue-puzzle-vcode"

  export default {
    name: "LoginPage",
    components: {
      VCode
    },
    data: function () {
      return {
        form: {
          phone: '',
          password: '',
        },
        rules: {
          phone: [
            {required: true, message: "请输入手机号", trigger: "blur"},
            {
              pattern: /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/,
              message: "请输入正确的手机号",
              trigger: "blur"
            },
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
                if (value === this.registerForm.password) callback()
                else callback(new Error('两次密码不一致'))
              },
              trigger: "blur"
            },
          ],
          code: [
            {required: true, message: "请输入验证码", trigger: "blur"},
            {min: 6, max: 6, message: "请输入正确的六位验证码", trigger: "blur"},
          ],
        },
        checked: false,

        isShow: false,
        buttonFlag: 1,  // 1 登录, 2 注册, 3 忘记密码, 4 发送验证码
        isRegister: true, // 区分注册和忘记密码

        dialogShowFlag: false,

        registerForm: {
          phone: '',
          password: '',
          password2: '',
          code: '',
        },
        formLabelWidth: '120px',

        codeButton: "获取验证码",
        count: 120,
        disable: false,
      };
    },
    mounted() {
      // 启动时查看是否保存密码
      if (localStorage.getItem("auto-memory-key")) {
        this.form = JSON.parse(localStorage.getItem("auto-memory-key"))
        this.checked = true
      }
    },
    methods: {
      onSuccess() {
        // 验证成功
        this.isShow = false;

        if (this.buttonFlag === 1) {
          this.loginCore();
        } else if (this.buttonFlag === 2) {
          this.registerCore();
        } else if (this.buttonFlag === 3) {
          this.forgetPasswordCore();
        } else if (this.buttonFlag === 4) {
          this.getCodeCore();
        }
      },
      remember() {
        // 保存密码
        if (this.checked) {
          console.log("savePassword: ", JSON.stringify(this.form))
          localStorage.setItem("auto-memory-key", JSON.stringify(this.form))
        } else {
          localStorage.removeItem("auto-memory-key")
        }
      },
      login(form) {
        // 手机号密码格式正确, 调出滑块验证
        console.log("form: " + JSON.stringify(this.form))
        this.$refs[form].validate((valid) => {
          if (valid) {
            this.remember();
            this.buttonFlag = 1;
            this.isShow = true;
          }
        });
      },
      register(registerForm) {
        console.log("registerForm: ", JSON.stringify(this.registerForm));
        this.$refs[registerForm].validate((valid) => {
          if (valid) {
            this.buttonFlag = this.isRegister ? 2 : 3;
            this.isShow = true;
          }
        })
      },
      forgetPassword() {
        this.isRegister = false;
        this.dialogShowFlag = true;
      },
      getCode() {
        // 打开验证码对应的框
        this.buttonFlag = 4;
        this.isShow = true;
      },
      loginCore() {
        this.service.post('login', this.form)
            .then((res) => {
              // console.log(res);
              if (res.data.code !== 1) {
                console.log("fail");
                return;
              }
              console.log("success");
              let token = res.data.data;
              console.log("token: " + token);
              localStorage.setItem("Authorization", "Bearer " + token);
              this.$message.success("登录成功");
              this.$router.push('/home');
            })
      },
      registerCore() {
        this.service.post('register', this.registerForm)
            .then((res) => {
              console.log(res);
              this.$message.success("注册成功");
              this.dialogShowFlag = false;
            })
            .catch((err) => {
              console.log(err);
              this.$message.success("注册失败, 请稍后重试");
            })
      },
      forgetPasswordCore() {
        this.service.post('forget', this.registerForm)
            .then((res) => {
              console.log(res);
              this.$message.success("找回成功");
              this.dialogShowFlag = false;
            })
            .catch((err) => {
              console.log(err);
              this.$message.error("找回失败, 请稍后重试");
            })
      },
      getCodeCore() {
        // 验证通过后执行,
        this.service.post('code', {})
            .then((res) => {
              console.log(res);
              if (res.data.code === 1) {
                this.$message.success('验证码发送成功, 请注意查收');
              } else {
                this.message.error("验证码发送失败, 请稍后重试");
              }
            })
            .catch((err) => {
              console.log(err);
              this.message.error("验证码发送失败, 请稍后重试");
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
    },
  };
</script>

<style scoped>
  .title {
    font-size: 45px;
  }

  .loginBody {
    width: 100%;
    height: 100%;
    min-width: 1000px;
    /*background-image: url("../assets/login-background.jpg");*/
    background-image: url("https://api.btstu.cn/sjbz/api.php?lx=dongman&format=images");
    background-size: 100% 100%;
    background-position: center center;
    overflow: auto;
    background-repeat: no-repeat;
    position: fixed;
    line-height: 100%;
    padding-top: 150px;
  }

  .loginText {
    margin-bottom: 20px;
    line-height: 50px;
    text-align: center;
    font-size: 30px;
    font-weight: bolder;
    color: white;
    text-shadow: 2px 2px 4px #000000;
  }

  .loginData {
    width: 400px;
    height: 300px;
    transform: translate(-50%);
    margin-left: 50%;
  }

  .tool {
    display: flex;
    justify-content: space-between;
    color: #606266;
  }

  .button {
    margin-top: 10px;
    text-align: center;
  }

  .register {
    cursor: pointer;
    color: #606266;
  }

</style>