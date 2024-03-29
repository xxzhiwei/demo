import '@babel/polyfill';

import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import '@/style/reset.css';

import App from './App';

Vue.use(ElementUI);

new Vue({
    render: h => h(App)
}).$mount('#app');