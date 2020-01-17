import Vue from 'vue'
import App from './App.vue'
import router from './router/index'

import '@/styles/base.stylus'

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
