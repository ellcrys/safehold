import Vue from 'vue';
import axios from 'axios';

import App from './App';
import router from './router';
import store from './store';
import VueClipboard from 'vue-clipboard2'
import Modal from './components/modals/Modal';

if (!process.env.IS_WEB) Vue.use(require('vue-electron'));
Vue.http = Vue.prototype.$http = axios;
Vue.config.productionTip = false;
Vue.use(VueClipboard)
Vue.component("Modal", Modal)

/* eslint-disable no-new */
new Vue({
	components: {
		App,
	},
	router,
	store,
	template: '<App/>',
}).$mount('#app');
