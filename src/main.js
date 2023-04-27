import Vue from "vue";
import Vuex from "vuex"

import App from './App'
import Storage from './Store'

import './assets/sass/paper-dashboard.scss'

Vue.use(Vuex)

const store = new Vuex.Store(Storage)

Object.defineProperty(Vue.prototype, 'localStorage', {
    get () {
        return window.localStorage
    }
})

new Vue({
    el: '#app',
    store,
    data: function() {
        return {

        };
    },
    computed: {

    },
    watch: {

    },
    beforeMount () {

    },
    methods: {

    },
    render: h => h(App)
})
