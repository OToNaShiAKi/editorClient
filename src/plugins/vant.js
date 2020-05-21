import Vue from 'vue'
import {
    Button,
    Switch,
    Field,
    Notify
} from 'vant'

Notify.setDefaultOptions({
    duration: 1000
})



Vue.use(Button)
    .use(Switch)
    .use(Field)
    .use(Notify)
