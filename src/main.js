import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// main.js
import VueXss from 'vue-xss'
Vue.use(VueXss)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
