// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import axios from 'axios'
import myUpload from '@/components/upload'
import test from '@/components/test'
import camera from '@/components/camera'

import 'element-ui/lib/theme-chalk/index.css'

Vue.config.productionTip = false
Vue.component('my-upload', myUpload)
Vue.component('progress-circle', test)
Vue.component('camera', camera)
Vue.use(ElementUI)
Vue.prototype.$axios = axios

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    components: {
        App
    },
    template: '<App/>'
})
