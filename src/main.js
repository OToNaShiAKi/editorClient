import Vue from 'vue'
import App from './App.vue'

import './plugins/vant.js'
import './plugins/code-mirror.js'

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
