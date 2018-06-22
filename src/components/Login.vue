<template>
  <div login>
    <div class="login-form">
      <Form inline ref="formData" :model="formData" :rules="ruleFormData" label-position="top">
        <FormItem prop="account">
          <i-input type="text" v-model="formData.account" placeholder="账号">
            <Icon type="ios-person-outline" slot="prepend"></Icon>
          </i-input>
        </FormItem>
        <FormItem prop="password">
          <i-input type="password" v-model="formData.password" placeholder="密码">
            <Icon type="ios-locked-outline" slot="prepend"></Icon>
          </i-input>
        </FormItem>
        <FormItem>
          <Button :loading="loading" type="primary" @click="handleSubmit('formData')">登录</Button>
        </FormItem>
      </Form>
      <ul class="bg-bubbles">
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
      </ul>
    </div>
  </div>
</template>
<script>
import authApi from "../api/auth";
export default {
  data() {
    const validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        callback();
      }
    };
    const validAccount = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入账号"));
      } else {
        callback();
      }
    };
    return {
      formData: {
        account: "",
        password: ""
      },
      ruleFormData: {
        account: [{ validator: validatePass, trigger: "blur" }],
        password: [{ validator: validAccount, trigger: "blur" }]
      },
      loading: false
    };
  },
  methods: {
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          this.loading = true;
          authApi
            .login({
              account: this.formData.account,
              password: this.formData.password
            })
            .then(result => {
              this.$store.commit("login", result.data);
              this.$router.replace("/");
            })
            .catch(e => {
              console.log(e);
              this.$Message.error(e.message);
            })
            .then(() => {
              this.loading = false;
            });
        }
      });
    }
  },
  mounted() {
    console.log(this.$router);
  }
};
</script>
<style>
[login] {
  text-align: center;
  width: 100%;
  height: 100vh;
  background: #50a3a2;
  background: -webkit-linear-gradient(top left, #50a3a2 0%, #53e3a6 100%);
  background: linear-gradient(to bottom right, #50a3a2 0%, #53e3a6 100%);
  opacity: 0.8;
}

[login] .login-form {
  padding-top: calc(50vh - 57px);
}

[login] .login-form form {
  position: relative;
  z-index: 2;
}

[login] .bg-bubbles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1;
  height: 100vh;
  overflow: hidden;
}
[login] .bg-bubbles li {
  position: absolute;
  list-style: none;
  display: block;
  width: 40px;
  height: 40px;
  background-color: rgba(255, 255, 255, 0.15);
  bottom: -160px;
  -webkit-animation: square 25s infinite;
  animation: square 25s infinite;
  -webkit-transition-timing-function: linear;
  transition-timing-function: linear;
}
[login] .bg-bubbles li:nth-child(1) {
  left: 10%;
}
[login] .bg-bubbles li:nth-child(2) {
  left: 20%;
  width: 80px;
  height: 80px;
  -webkit-animation-delay: 2s;
  animation-delay: 2s;
  -webkit-animation-duration: 17s;
  animation-duration: 17s;
}
[login] .bg-bubbles li:nth-child(3) {
  left: 25%;
  -webkit-animation-delay: 4s;
  animation-delay: 4s;
}
[login] .bg-bubbles li:nth-child(4) {
  left: 40%;
  width: 60px;
  height: 60px;
  -webkit-animation-duration: 22s;
  animation-duration: 22s;
  background-color: rgba(255, 255, 255, 0.25);
}
[login] .bg-bubbles li:nth-child(5) {
  left: 70%;
}
[login] .bg-bubbles li:nth-child(6) {
  left: 80%;
  width: 120px;
  height: 120px;
  -webkit-animation-delay: 3s;
  animation-delay: 3s;
  background-color: rgba(255, 255, 255, 0.2);
}
[login] .bg-bubbles li:nth-child(7) {
  left: 32%;
  width: 160px;
  height: 160px;
  -webkit-animation-delay: 7s;
  animation-delay: 7s;
}
[login] .bg-bubbles li:nth-child(8) {
  left: 55%;
  width: 20px;
  height: 20px;
  -webkit-animation-delay: 15s;
  animation-delay: 15s;
  -webkit-animation-duration: 40s;
  animation-duration: 40s;
}
[login] .bg-bubbles li:nth-child(9) {
  left: 25%;
  width: 10px;
  height: 10px;
  -webkit-animation-delay: 2s;
  animation-delay: 2s;
  -webkit-animation-duration: 40s;
  animation-duration: 40s;
  background-color: rgba(255, 255, 255, 0.3);
}
[login] .bg-bubbles li:nth-child(10) {
  left: 90%;
  width: 160px;
  height: 160px;
  -webkit-animation-delay: 11s;
  animation-delay: 11s;
}

@-webkit-keyframes square {
  0% {
    -webkit-transform: translateY(0);
    transform: translateY(0);
  }
  100% {
    -webkit-transform: translateY(-700px) rotate(600deg);
    transform: translateY(-700px) rotate(600deg);
  }
}
@keyframes square {
  0% {
    -webkit-transform: translateY(0);
    transform: translateY(0);
  }
  100% {
    -webkit-transform: translateY(-700px) rotate(600deg);
    transform: translateY(-700px) rotate(600deg);
  }
}
</style>

