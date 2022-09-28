<template>
  <van-skeleton title :row="5" v-if="newsInfo === null" />
  <div class="content" v-else v-html="newsInfo.body"></div>
  <div class="nav-box">
    <van-icon name="arrow-left" @click="handle"></van-icon>
    <van-icon name="comment-o" :badge="comments"></van-icon>
    <van-icon name="good-job-o" :badge="popularity"></van-icon>
    <van-icon name="star-o" color="#1989fa"></van-icon>
    <van-icon name="share-o" color="#ccc"></van-icon>
  </div>
</template>

<script>
import { reactive, toRefs } from '@vue/reactivity'
import { useRouter, useRoute } from 'vue-router'
import { onBeforeMount } from '@vue/runtime-core'
import api from '@/api/index.js'

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

    onBeforeMount(async () => {
      let id = route.params.id
      let result = await api.queryNewsInfo(id)
      state.newsInfo = result
      let { comments, popularity } = await api.queryNewsStory(id)
      state.comments = comments
      state.popularity = popularity
    })

    return {
      ...toRefs(state),
      handle
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