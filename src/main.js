import Vue from 'vue'
import VueFire from 'vuefire'
import './firebase'

import App from './app.vue'

Vue.use(VueFire)

new Vue({
  el: '#app',
  template: '<App/>',
  components: { App }
})
