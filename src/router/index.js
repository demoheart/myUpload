import Vue from 'vue'
import Router from 'vue-router'
import parent from '@/components/parent'
import test from '@/components/test'

Vue.use(Router)

export default new Router({
    routes: [{
        path: '/',
        name: 'parent',
        component: parent
    }, {
        path: '/test',
        name: 'test',
        component: test
    }]
})
