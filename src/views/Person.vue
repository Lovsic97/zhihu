<template>
  <Nav></Nav>
  <div class="base-info">
    <img src="../assets/images/timg.jpg"/>
    <p>zhufeng</p>
  </div>
  <van-cell-group>
    <van-cell title="我的收藏" is-link/>
    <van-cell title="退出登录"/>
  </van-cell-group>
</template>

<script>
import Nav from '@/components/Nav.vue';
export default {
    name: "Person",
    components: { Nav }
}
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