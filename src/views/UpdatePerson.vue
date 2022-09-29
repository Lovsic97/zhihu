<template>
  <Nav></Nav>
  <div class="form-box">
    <van-cell-group inset>
      <van-field v-model="name" label="用户名" label-width="60px" />

      <van-field label="用户头像" label-width="60px">
        <template #input>
          <van-uploader v-model="pic" max-count="1" />
        </template>
      </van-field>
    </van-cell-group>

    <div style="margin: 20px 40px">
      <van-button
        :loading="loading"
        loading-text="处理中..."
        round
        block
        type="primary"
        @click="submit"
      >
        修改信息
      </van-button>
    </div>
  </div>
</template>

<script>
import Nav from '@/components/Nav.vue';
import { toRefs, reactive } from 'vue';
import { useStore } from 'vuex'
import { Toast } from 'vant'
import api from '@/api';

export default {
    name: "UpdatePerson",
    components: { Nav },
    setup() {
      const store = new useStore()
      const router = useRouter()
      let state = reactive({
        name: "",
        pic: [],
        loading: false
      })

      const submit = async () => {
        if (state.loading) return;
        state.loading = true;

        let {name, pic} = state
        // 校验格式
        let reg = /^[\w\u4e00-\u9fa5]+$/    // 匹配一个或多个任意的中文、字母、数字和下划线
        if(!reg.test(name)) {
          Toast("新的用户名格式不正确！")
          return
        }
        if (pic.length === 0) {
          Toast("请上传至少一张图片！");
          return;
        }
        // 提交数据给服务器
        let { code, data } = await api.userUpdate(name, pic[0].file)
        if(+code !== 0) {
          Toast("信息修改失败，请稍后再试!");
          return;
        }
        Toast("用户信息修改成功！");
        store.commit("changeInfo", data)
        router.replace("/person");
        state.loading = false;
      }

      return {
        ...toRefs(state),
        submit
      }
    }
}
</script>

<style lang="less" scoped>
  .form-box {
    margin-top: 30px;
  }
  </style>