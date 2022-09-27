<template>
  <!-- 头部 -->
  <Head :time="today"></Head>
  <!-- 轮播图 -->
  <section class="banner-box">
    <van-swipe v-if="bannerList.length > 0" autoplay="3000" lazy-render>
      <van-swipe-item v-for="item in bannerList" :key="item.id">
        <router-link :to=" `/detail/${item.id}`" class="content">
          <img :src="item.image">
          <div class="mark">
            <h3 class="title">{{item.title}}</h3>
            <span class="tip">{{item.hint}}</span>
          </div>
        </router-link>
      </van-swipe-item>
    </van-swipe>
  </section>
</template>

<script>
import Head from '@/components/Head.vue'
import api from '@/api/index.js'
import { reactive, toRefs } from '@vue/reactivity'
import { onBeforeMount } from '@vue/runtime-core'
export default {
  name: "Home",
  components: { Head },
  setup() {
    let state = reactive({
      today: '',
      newList: [],
      bannerList: []
    })

    // 第一次加载数据
    onBeforeMount(async () => {
      let {date, stories, top_stories} = await api.queryNewsLatest()
      state.today = date
      state.newList.push(
        Object.freeze({
        date,
        stories
        })
      )
      state.bannerList = Object.freeze(top_stories)
    })

    return {
      ...toRefs(state)
    }
  }
}
</script>

<style lang="less" scoped>
.banner-box {
  box-sizing: border-box;
  height: 375px;
  background-color: #d5d5d5;

  .van-swipe {
    height: 100%;
    background: #fff;

    .content {
      position: relative;
      display: block;
      height: 100%;
      color: #fff;

      img {
        display: block;
        width: 100%;
        height: 100%;
      }

      .mark {
        position: absolute;
        bottom: 0;
        left: 0;
        box-sizing: border-box;
        padding: 10px 20px;
        width: 100%;
        height: 110px;
        background: rgba(0, 0, 0, 0.3);
        background: -webkit-linear-gradient(
          top,
          rgba(0, 0, 0, 0),
          rgba(0, 0, 0, 0.5)
        );

        .title {
          padding-top: 10px;
          font-size: 20px;
          line-height: 25px;
          max-height: 50px;
          overflow: hidden;
        }

        .tip {
          font-size: 12px;
          line-height: 20px;
        }
      }
    }

    /deep/ .van-swipe__indicators {
      left: auto;
      right: 15px;
      transform: none;

      .van-swipe__indicator--active {
        width: 15px;
        border-radius: 3px;
        background: #fff;
      }
    }
  }
}
</style>