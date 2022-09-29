<template>
  <Nav title="我的收藏"></Nav>
  <van-empty description="暂无收藏" v-if="storeList.length === 0" />
  <div v-else>
    <van-swipe-cell v-for="item in storeList" :key="item.id">
      <div class="con">
        <Item :data="{ ...item.news, images: [item.news.image], hint: '' }"></Item>
      </div>
      <template #right>
        <van-button
          square
          type="danger"
          text="删除"
          @click="removeHandle(item.id)"
        />
      </template>
    </van-swipe-cell>
  </div>
</template>

<script>
import api from '@/api';
import Nav from '@/components/Nav.vue';
import Item from '@/components/Item.vue'
import { Toast } from 'vant';
import { useStore } from 'vuex';
import { computed } from '@vue/reactivity';
export default {
    name: "Store",
    components: { Nav, Item },
    setup() {
      // 显示收藏
      const store = new useStore()
      let storeList = computed(() => {
        return store.state.storeList || [];
      });

      // 删除收藏
      const removeHandle = async (id) => {
        let { code } = await api.storeRemove(id)
        if(+code !== 0) {
          Toast("很遗憾，删除失败！");
          return
        }
        Toast("恭喜您，删除成功！");
        store.commit("removeStoreList", id);
      }
      return {
        storeList,
        removeHandle
      }
    }
}
</script>

<style lang="less" scoped>
.van-swipe-cell {
  .con {
    padding: 0 15px;
  }

  /deep/ .van-swipe-cell__right {
    .van-button {
      position: relative;
      top: 50%;
      transform: translateY(-50%);
    }
  }
}
</style>