<template>
  <div>
    <Vcode :show="isShow" @success="onSuccess" @close="onClose" />
    <button @click="submit">开始验证</button>
  </div>
</template>

<script>
  import Vcode from "vue-puzzle-vcode";
  export default {
    name: "TestPage",
    data() {
      return {
        isShow: false,
      };
    },
    components: {
      Vcode,
    },
    methods: {
      submit() {
        this.isShow = true;
      },

      onSuccess() {
        this.isShow = false; // 通过验证后，需要手动关闭模态框
      },

      onClose() {
        this.isShow = false;
      },
    },
  };
</script>