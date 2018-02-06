<template>
  <div>
    <el-tabs v-model="activeTab">
      <el-tab-pane label="查看详情" name="detail">
        <user-detail :id="userId"></user-detail>
      </el-tab-pane>
      <el-tab-pane label="充值记录" name="recharge">
        <recharge-record :id="userId"></recharge-record>
      </el-tab-pane>
      <el-tab-pane label="消费记录" name="purchase">
        <purchase-record :id="userId"></purchase-record>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style lang="scss" scoped>

</style>

<script>
import UserDetail from './UserDetail.vue'
import RechargeRecord from './RechargeRecord.vue'
import PurchaseRecord from './PurchaseRecord.vue'

export default {
  components: {
    UserDetail,
    RechargeRecord,
    PurchaseRecord
  },
  data () {
    return {
      activeTab: 'detail'
    }
  },
  computed: {
    userId () {
      return this.$route.params.id
    }
  }
}
</script>