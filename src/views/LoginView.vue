<template>
  <div>
    <h1>ログインページ</h1>
    <form @submit.prevent="login">
      <div>
        <label for="email">メールアドレス</label>
        <input type="email" id="email" v-model="email" required />
      </div>
      <div>
        <label for="password">パスワード</label>
        <input type="password" id="password" v-model="password" required />
      </div>
      <button type="submit">ログイン</button>
    </form>
    <p v-if="errorMessage" style="color: red;">{{ errorMessage }}</p>
  </div>
</template>

<script>
import axios from 'axios';

// CSRFトークンの設定 (トークンが存在する場合のみ)
const csrfTokenMeta = document.querySelector('meta[name="csrf-token"]');
if (csrfTokenMeta) {
  axios.defaults.headers.common['X-CSRF-Token'] = csrfTokenMeta.getAttribute('content');
}

export default {
  name: 'LoginView',
  data() {
    return {
      email: '',
      password: '',
      errorMessage: ''
    };
  },
  methods: {
    async login() {
      try {
        // サーバーへのログインリクエスト
        const response = await axios.post('http://localhost:3000/api/login', {
          email: this.email,
          password: this.password
        });

        // トークンの保存
        localStorage.setItem('token', response.data.token);

        // ログイン成功後に BordList へリダイレクト
        this.$router.push({ name: 'bordlist' });
      } catch (error) {
        // エラーメッセージの設定
        this.errorMessage = 'メールアドレスまたはパスワードが間違っています';
      }
    }
  }
};
</script>


<style scoped>
form {
  max-width: 300px;
  margin: auto;
}
input {
  display: block;
  width: 100%;
  margin-bottom: 10px;
}
button {
  width: 100%;
}
</style>
