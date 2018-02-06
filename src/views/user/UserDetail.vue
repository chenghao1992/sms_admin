<template>
  <div>
    <div class="section">
      <div class="section-title">基本信息</div>
      <div class="section-item">
        <span class="section-label">用户名：</span>
        <span class="section-value">{{user.username}}</span>
      </div>
      <div class="section-item">
        <span class="section-label">公司名称：</span>
        <span class="section-value">{{user.companyName}}</span>
      </div>
      <div class="section-item">
        <span class="section-label">营业执照号：</span>
        <span class="section-value">{{user.businessLicense}}</span>
      </div>
      <div class="section-item">
        <span class="section-label">联系人：</span>
        <span class="section-value">{{user.contactName}}</span>
      </div>
      <div class="section-item">
        <span class="section-label">身份证号：</span>
        <span class="section-value">{{user.contactIdNumber}}</span>
      </div>
      <div class="section-item">
        <span class="section-label">手机号：</span>
        <span class="section-value">{{user.contactMobile}}</span>
      </div>
      <div class="section-item">
        <span class="section-label">Access Key ID：</span>
        <span class="section-value">{{user.id}}</span>
      </div>
      <div class="section-item">
        <span class="section-label">Access Key Secret：</span>
        <span class="section-value">{{user.accessSecret}}</span>
      </div>
    </div>
    <div class="section">
      <div class="section-title">流控规则</div>
      <div class="section-item">
        <span class="section-label">单一号码发送间隔：</span>
        <span class="section-value">{{flow.mobileInterval}}s</span>
      </div>
      <div class="section-item">
        <span class="section-label">单一号码10分钟最大条数：</span>
        <span class="section-value">{{flow.mobileTenMinTotal}}条</span>
      </div>
      <div class="section-item">
        <span class="section-label">单一号码1小时最大条数：</span>
        <span class="section-value">{{flow.mobileHourTotal}}条</span>
      </div>
      <div class="section-item">
        <span class="section-label">单一号码1天最大条数：</span>
        <span class="section-value">{{flow.mobileDailyTotal}}条</span>
      </div>
    </div>
  
    <div class="section">
      <div class="section-title">签名信息</div>
      <div class="signature" :key="item.id" v-for="(item, index) in signatures">
        <div class="signature-header">
          签名{{index + 1}}：{{item.sign}}
        </div>
        <div class="signature-content">
          <!-- <span class="signature-id">签名ID：{{item.id}}</span> -->
          <span>绑定通道：</span>
          <div class="channel-list">
            <div class="channel" :key="channel.id" v-for="channel in item.list">
              <span style="background:#00ff99;" v-if="channel.status==2">已启用</span>
              <span style="background:#ff6600;" v-else>已禁用</span>
              <span>{{channel.channelName}}</span>
              <span class="channel-weight">权重{{channel.weight}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
     <div class="section">
        <div class="section-title">账户信息</div>
        <table class="sms-list sms-table" cellpadding="10" cellspacing="0">
          <tr>
            <td align="center">短信类型</td>
            <td align="center">营销短信</td>
            <td align="center">通知短信</td>
          </tr>
          <tr>
            <td align="center">开通状态</td>
            <td align="center">{{marketing.status==0?'已开通':'未开通'}}</td>
            <td align="center">{{notief.status==0?'已开通':'未开通'}}</td>
          </tr>
          <tr>
            <td align="center">开通时间</td>
            <td align="center">{{marketing.openTime}}</td>
            <td align="center">{{notief.openTime}}</td>
          </tr>
          <tr>
            <td align="center">账户短信余额</td>
            <td align="center"><span class="color-red">{{marketing.balance}}</span>条</td>
            <td align="center"><span class="color-red">{{notief.balance}}</span>条</td>
          </tr>
        </table>
       </div>   
  </div>
</template>

<style lang="scss" scoped>
.section {
  padding: 10px 0;
}

.section-title {
  margin-bottom: 20px;
  padding: 10px 30px;
  font-size: 16px;
  font-weight: 600;
  border-bottom: 1px solid #d1dbe5;
}

.section-item {
  padding: 10px 30px;
  .section-label {
    padding-right: 10px;
  }
}

.signature {
  margin: 10px 0 20px 0;
  padding-left: 30px;
  .signature-header {
    padding-bottom: 8px;
    color: #FF6600;
  }
  .signature-content {
    .signature-id {
      padding-right: 30px;
    }
    .channel-list {
      margin-left: 5px;
      display: inline-block;
    }
    .channel {
      margin: 0 10px;
      padding: 3px 8px;
      display: inline-block;
      border: 1px solid #d1dbe5;
      .channel-weight {
        padding-left: 10px;
        color: #FF9900;
        display: inline-block;
      }
    }
  }
}

.sms-list {
  width: 750px;
}

.color-red {
  padding-right: 5px;
  color: #FF0000;
}
</style>

<script>
import { userInfo } from '../../api/api';
export default {
  name: 'user-detail',
  props: {
    id: {
      type: String,
      required: false
    }
  },
  data() {
    return {
      user: {
        username: '',
        companyName: '',
        businessLicense: '',
        contactName: '',
        contactIdNumber: '',
        contactMobile: '',
        id: '',
        accessSecret: ''
      },
      flow: {
        mobileInterval: '--',
        mobileTenMinTotal: '--',
        mobileHourTotal: '--',
        mobileDailyTotal: '--'
      },
      signatures: [],
      marketing: {},
      notief:{}
    }
  },
  mounted() {
    userInfo({ userId: this.$route.params.id }).then(res => {
      this.user = res.data.result.user;
      this.user.accessSecret = this.user.accessSecret.replace(/./g,'*');
      this.flow = !res.data.result.flow?this.flow:res.data.result.flow;
      this.flow.mobileInterval = !this.flow.mobileInterval?'--':this.flow.mobileInterval;
      this.flow.mobileTenMinTotal = !this.flow.mobileTenMinTotal?'--':this.flow.mobileTenMinTotal;
      this.flow.mobileHourTotal = !this.flow.mobileHourTotal?'--':this.flow.mobileHourTotal;
      this.flow.mobileDailyTotal = !this.flow.mobileDailyTotal?'--':this.flow.mobileDailyTotal;
      this.signatures = res.data.result.accountsList;
      this.marketing = res.data.result.marketing;
      this.notief = res.data.result.notief;

    })
  }
}
</script>