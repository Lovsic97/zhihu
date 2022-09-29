<template>
  <van-skeleton title :row="5" v-if="newsInfo === null" />
  <div class="content" v-else v-html="newsInfo.body"></div>
  <div class="nav-box">
    <van-icon name="arrow-left" @click="handle"></van-icon>
    <van-icon name="comment-o" :badge="comments"></van-icon>
    <van-icon name="good-job-o" :badge="popularity"></van-icon>
    <van-icon 
      name="star-o" 
      :color="isStore ? '#1989fa' : '#000'" 
      @click="storeHandle">
    </van-icon>
    <van-icon name="share-o" color="#ccc"></van-icon>
  </div>
</template>

<script>
import { reactive, toRefs } from '@vue/reactivity'
import { useRouter, useRoute } from 'vue-router'
import { onBeforeMount, onBeforeUnmount, onUpdated } from '@vue/runtime-core'
import { useStore } from 'vuex'
import { Toast } from 'vant'
import api from '@/api/index.js'
import { computed } from '@vue/reactivity'

export default {
  name: 'Detail',
  setup() {
    let state = reactive({
      comments: 0,
      popularity: 0,
      newsInfo: null
    })

    const router = new useRouter()
    const route = new useRoute()
    const handle = () => {
      router.back()
    }

    // 点击收藏变色，如果变色就无法使用
    let isStore = computed(() => {
      let { isLogin, storeList } = store.state;
      if (isLogin) {
        if (!Array.isArray(storeList)) storeList = [];
        return storeList.some((item) => {
          return +item.news.id === +route.params.id;
        });
      }
      return false;
    });

    // 点击收藏
    const store = new useStore()
    const storeHandle = async () => {
      if (!store.state.isLogin) {
        Toast("请先登录！");
        router.push({
          path: "/login",
          query: {
            from: `detail/${route.params.id}`,
          },
        });
        return;
      }
      if (isStore.value) return;
      let { code } = await api.store(route.params.id)
      if(+code !== 0) {
        Toast("很遗憾，收藏失败!");
        return;
      }
      Toast("恭喜您，收藏成功！");
      store.dispatch("changeStoreListAsync");
    }

    onBeforeMount(async () => {
      let id = route.params.id
      let result = await api.queryNewsInfo(id)
      state.newsInfo = result
      // 动态创建CSS
      let link = document.createElement('link')
      link.id = "link"
      link.rel = "stylesheet"
      link.href = state.newsInfo.css[0]
      document.head.appendChild(link)

      let { comments, popularity } = await api.queryNewsStory(id)
      state.comments = comments
      state.popularity = popularity
    })

    // 组件销毁前移除动态创建的CSS，跳到其他组件它就不会生效
    onBeforeUnmount(() => {
      let link = document.querySelector('#link')
      if(!link) return
      document.head.removeChild(link)
    })

    // 第一次进来是获得数据，所以没数据，获得数据更新以后才拿到图片，所以要在第一次更新以后插入图片
    onUpdated(() => {
      let imgPlaceHolder = document.querySelector(".img-place-holder");
      if (imgPlaceHolder) {
        if (imgPlaceHolder.innerHTML.trim() === "") {
          imgPlaceHolder.innerHTML += `<img src="${state.newsInfo.image}" alt=""/>`;
        }
      }
    })

    return {
      ...toRefs(state),
      handle,
      storeHandle,
      isStore
    }
  }
}
</script>

<style lang="less" scoped>
  .content {
    background: #fff;
    padding-bottom: 50px;
    margin: 0;
  
    /deep/ .img-place-holder {
      height: 375px;
      overflow: hidden;
      img {
        display: block;
        margin: 0;
        width: 100%;
        min-height: 100%;
      }
    }
  }
  
  .van-skeleton {
    padding: 30px 15px;
  }
  
  .nav-box {
    position: fixed;
    bottom: 0;
    left: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;
    padding: 0 15px;
    width: 100%;
    height: 50px;
    background: #f4f4f4;
  
    .van-icon:nth-child(1) {
      position: relative;
      &::after {
        position: absolute;
        top: -10%;
        right: -15px;
        content: "";
        width: 1px;
        height: 120%;
        background: #d5d5d5;
      }
    }
  
    /deep/ .van-badge {
      background-color: transparent;
      border: none;
      color: #000;
      right: -5px;
    }
  }
  </style>