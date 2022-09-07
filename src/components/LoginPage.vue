<template>
  <div class="loginBody">
    <div class="loginData">
      <div class="loginText">
        <h2 class="title">石铁大作业帮</h2>
      </div>
      <div class="formData">
        <el-form ref="form" :model="form" :rules="rules">
          <el-form-item prop="username">
            <el-input
                v-model="form.username"
                clearable
                placeholder="请输入手机号"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
                v-model="form.password"
                clearable
                placeholder="请输入密码"
                show-password></el-input>
          </el-form-item>
        </el-form>
      </div>

      <div class="tool">
        <div>
          <el-checkbox v-model="checked" @change="remember">记住密码</el-checkbox>
        </div>
        <div>
          <span class="shou" @click="forgetPassword">忘记密码？</span>
        </div>
      </div>
      <div class="button">
        <el-button type="primary" @click.native.prevent="login('form')">登录</el-button>
        <el-button class="register" @click="register">注册</el-button>
      </div>
    </div>

  </div>
</template>

<script>

  export default {
    name: "LoginPage",
    components: {},
    data() {
      return {
        form: {
          password: '',
          username: '',
        },
        isShow: true,
        rules: {
          username: [
            {required: true, message: "请输入用户名", trigger: "blur"},
            {max: 10, message: "不能大于10个字符", trigger: "blur"},
          ],
          password: [
            {required: true, message: "请输入密码", trigger: "blur"},
            {max: 10, message: "不能大于10个字符", trigger: "blur"},
          ],
        },
        checked: false,
      };
    },
    mounted() {
      if (localStorage.getItem("news")) {
        this.form = JSON.parse(localStorage.getItem("news"))
        this.checked = true
      }
    },
    methods: {
      login(form) {
        console.log(form)
        this.$refs[form].validate((valid) => {
          if (valid) {
            // TODO 显示验证框
          } else {
            return false;
          }
        });
      },
      remember(data) {
        console.log(data)
        this.checked = data
        if (this.checked) {
          localStorage.setItem("news", JSON.stringify(this.form))
        } else {
          localStorage.removeItem("news")
        }
      },
      forgetPassword() {
        this.$message({
          type: "info",
          message: "功能尚未开发额😥",
          showClose: true
        })
      },
      register() {
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
    background-image: url("../assets/login-background.jpg");
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