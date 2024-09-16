// src/main.js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router' // 作成したルーターをインポート

createApp(App)
  .use(router)  // ルーターを使用
  .mount('#app')
