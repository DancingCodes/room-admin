import { createApp } from 'vue'
import { ElLoadingDirective } from 'element-plus'
import 'element-plus/theme-chalk/src/loading.scss'
import 'element-plus/theme-chalk/src/message.scss'
import 'element-plus/theme-chalk/src/message-box.scss'
import App from './App.vue'
import router from './router'

createApp(App).use(router).directive('loading', ElLoadingDirective).mount('#app')
