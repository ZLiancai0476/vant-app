<template>
  <div>
      <van-nav-bar
        title="消息通知"
      />
      <div style="width: 100%;margin-top: 60px;">
      </div>
      <div v-if="chatList.length > 0">
        <div v-for="(item,index) in chatList" :key="index">
          <van-cell @click="toChat(item)" :value="item.goods_name" icon="shop-o">
            <template slot="title">
              <span class="custom-text">买家: {{item.buyerName}}</span>
            </template>
          </van-cell>
        </div>
      </div>
      <div class='no-msg' v-else>
        暂无最新消息
      </div>
      <van-loading v-if="loading" color="#1989fa" size='70px' vertical>正在玩命加载中...</van-loading>
  </div>
</template>

<script>
import {getBussinessChat} from '@/api/load-data.js'
import {localUser} from '@/util/local.js'
export default {
  data () {
    return {
      chatList: [],
      loading: true
    }
  },
  created () {
    this.$store.commit('setActiveMenu', 1)
  },
  mounted () {
    let data = {
      username: localUser().username
    }
    getBussinessChat(data).then(res => {
      if (res.success) {
        this.loading = false
        this.chatList = res.data
      } else {
        this.loading = false
      }
    })
  },
  methods: {
    toChat (item) {
      this.$router.push({path: '/business/bussinessChat', query: {id: item.buyerName}})
    }
  }
}
</script>

<style lang="scss" scoped>
.van-popup{
  width: 100%;
  height: calc(100vh - 50px);
}
.van-cell{
  border-bottom: 1px solid rgba(153,153,153, .2);
}
.no-msg{
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
