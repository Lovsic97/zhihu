<template>
  <Nav></Nav>
  <van-form ref="formBox" @submit="submit">
    <van-cell-group inset>
      <van-field
        v-model="phone"
        center
        label="手机号"
        label-width="50px"
        name="phone"
        placeholder="请填写手机号"
        :rules="[
          { required: true, message: '手机号为必填项' },
          { pattern: regPhone, message: '手机号格式不正确' },
        ]"
      >
        <template #button>
          <van-button
            size="small"
            :type="enable ? 'primary' : ''"
            class="form-btn"
            :disabled="!enable"
            @click="sendcode"
          >
            {{ enable ? "发送验证码" : time }}
          </van-button>
        </template>
      </van-field>

      <van-field
        v-model="code"
        label="验证码"
        label-width="50px"
        placeholder="请填写验证码"
        :rules="[
          { required: true, message: '验证码为必填项' },
          { pattern: regCode, message: '验证码必须是6位数字' },
        ]"
      />
    </van-cell-group>

    <div style="margin: 20px 40px">
      <van-button round block type="primary" native-type="submit">
        立即登录/注册
      </van-button>
    </div>
  </van-form>
</template>

<script>
import Nav from '@/components/Nav.vue'
import {reactive, ref, toRefs} from 'vue'
import api from '@/api/index.js'
import { Toast } from 'vant';
import { useStore } from 'vuex';
import { useRouter, useRoute } from 'vue-router'

export default {
    name: "Login",
    components: { Nav },
    setup() {
      let state = reactive({
        phone: "",
        code: "",
        enable: true,
        time: "60s"
      })
      let formBox = ref(null)
      const store = new useStore()
      const router = new useRouter()
      const route = new useRoute()

      // 发送验证码
      const sendcode = async () => {
        try {
          // 校验手机号格式
          await formBox.value.validate("phone");
          // 发送请求
          let { code } = await api.phoneCode(state.phone);
          if (+code !== 0) {
            Toast("当前网络繁忙，请稍后再试");
            return;
          }
          // 开启按钮倒计时
          state.enable = false;
          state.time = `60s`;
          let n = 60;
          let timer = setInterval(() => {
            n--;
            if (n === 0) {
              clearInterval(timer);
              state.enable = true;
              return;
            }
            state.time = `${n}s`;
          }, 1000);
        } catch (err) {}
      };

      // 表单提交
      const submit = async () => {
        let {code, token} = await api.login(state.phone, state.code)
        if(+code!==0) {
            Toast('很遗憾，当前登录失败')
            formBox.value.resetValidation()
            state.code = ""
            return
        }
        localStorage.setItem('token', token)
        store.commit("changeIsLogin", true)   // 修改vuex中的isLogin状态
        store.dispatch("changeInfoAsync")   // 异步，从服务器获取当前用户信息，在vuex中修改
        Toast('登录成功！')
        // 跳转到指定的地址
        let from = route.query.from
        if(from) {
          router.replace(`/${from}`)
          return 
        }
        router.replace(`/person`)
      }

      return {
        ...toRefs(state),
        regCode: /^\d{6}$/,
        regPhone: /^1\d{10}$/,
        formBox,
        sendcode,
        submit
      }
    }
}
</script>

<style lang="less" scoped>
  .van-form {
    margin-top: 30px;
  
    .form-btn {
      width: 78px;
    }
  }
  </style>