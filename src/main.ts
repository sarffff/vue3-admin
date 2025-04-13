import { createApp } from 'vue'
import pinia from './stores'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import "element-plus/dist/index.css";

import 'element-plus/theme-chalk/dark/css-vars.css'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import './assets/font_svg/iconfont.js'
import SvgIcon from './components/SvgIcon/SvgIcon.vue'
import './styles/style.scss'
const app = createApp(App)
app.use(pinia)
app.use(router)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component);
}
app.use(ElementPlus, {
    locale: zhCn,
})
app.component('SvgIcon', SvgIcon)
app.mount('#app')
