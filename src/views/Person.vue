<template>
  <Nav />
  <div class="base-info" v-if="info">
    <img :src="info.pic" @click="$router.push('/updateperson')"/>
    <p>{{info.name}}</p>
  </div>
  <van-cell-group>
    <van-cell title="我的收藏" is-link url="#/store" />
    <van-cell title="退出登录" @click="signout" />
  </van-cell-group>
</template>

<script>
import Nav from "@/components/Nav.vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { Toast } from "vant";
import { computed, onBeforeMount } from "vue";

export default {
  components: { Nav },
  name: "Person",
  setup() {
    const router = new useRouter()
      const store = new useStore()
      // 从vuex获取头像和用户信息
      let info = computed(() => {
      let { isLogin, info } = store.state;
      if (isLogin && info) return info;
        return null;
      })
      onBeforeMount(() => {
        let { isLogin, info } = store.state;
        if (isLogin === null) store.dispatch("changeIsLoginAsync");
        if (info === null) store.dispatch("changeInfoAsync");
      });

      // 退出登录
      const signout = () => {
        Toast("您已经安全退出!");
        // 删除token
        localStorage.removeItem('token')
        store.commit("changeIsLogin", null);
        store.commit("changeInfo", null);
        store.commit("changeStoreList", null);
        // 返回首页
        router.replace('/login')
      }
      return {
        signout,
        info
      }
    }
};
</script>

<style lang="less" scoped>
.base-info {
  box-sizing: border-box;
  margin: 20px 0;

  img {
    display: block;
    margin: 0 auto;
    width: 86px;
    height: 86px;
    border-radius: 50%;
  }

  p {
    line-height: 50px;
    font-size: 18px;
    text-align: center;
  }
}
</style>