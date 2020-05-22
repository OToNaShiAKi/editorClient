import Vue from 'vue'
import {
    Button,
    Switch,
    Field,
    Notify,
    Dialog
} from 'vant'

Notify.setDefaultOptions({
    duration: 1000
})



Vue.use(Button)
    .use(Switch)
    .use(Field)
    .use(Notify)
    .use(Dialog)
