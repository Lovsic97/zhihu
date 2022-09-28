<template>
  <router-view v-slot="{Component}">
    <keep-alive include="Home">
      <component :is="Component"></component>
    </keep-alive>
  </router-view>
</template>

<script>
export default {

}
</script>

<style lang="less">
  html, body {
    min-height: 100%;
    overflow-x: hidden;
    background-color: #f4f4f4;
  }
  #app {
    background: #fff;
    margin: 0 auto;
  }
</style>