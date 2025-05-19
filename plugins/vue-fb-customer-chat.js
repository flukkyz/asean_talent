import Vue from 'vue'
import VueFbCustomerChat from 'vue-fb-customer-chat'

Vue.use(VueFbCustomerChat, {
  page_id: process.env.facebookPageId,
  theme_color: '#224293',
  locale: 'th_TH'
})
