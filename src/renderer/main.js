import Vue from 'vue';
import axios from 'axios';
import VModal from 'vue-js-modal';
import Notifications from 'vue-notification';

import App from './App';
import router from './router';
import store from './store';

Vue.use(VModal, { dialog: true });
Vue.use(Notifications);

if (!process.env.IS_WEB) Vue.use(require('vue-electron'));
Vue.http = Vue.prototype.$http = axios;
Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>',
}).$mount('#app');
