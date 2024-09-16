<template>
  <div class="bord-container">
    <h1>掲示板一覧</h1>
    <p v-if="currentUser">ログイン中のユーザー: {{ currentUser.name }}</p>
    <form @submit.prevent="createBord" class="bord-form">
      <input v-model="newBord.title" placeholder="タイトル" class="bord-input" />
      <textarea v-model="newBord.content" placeholder="内容" class="bord-textarea"></textarea>
      <button type="submit" class="bord-button">投稿</button>
    </form>
    <ul class="bord-list">
      <li v-for="bord in bords" :key="bord.id" class="bord-item">
        <h2>{{ bord.title }}</h2>
        <p>{{ bord.content }}</p>
        <button @click="deleteBord(bord.id)" class="delete-button">削除</button>
      </li>
    </ul>
    <button @click="logout" class="logout-button">ログアウト</button>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      bords: [],
      newBord: { title: '', content: '' },
      currentUser: null, // 現在のユーザー情報を格納
    };
  },
  created() {
    this.fetchBords();
    this.fetchCurrentUser(); // 現在のユーザー情報を取得
  },
  methods: {
    async fetchBords() {
      const token = localStorage.getItem('token'); // トークンの取得
      try {
        const response = await axios.get('http://localhost:3000/bords', {
          headers: {
            'Authorization': `Bearer ${token}` // 認証トークンの追加
          }
        });
        this.bords = response.data;
      } catch (error) {
        console.error('データの取得に失敗しました:', error);
      }
    },
    async fetchCurrentUser() {
      const token = localStorage.getItem('token'); // ローカルストレージからトークンを取得
      console.log('Token:', token);  // トークンの確認
      try {
        const response = await axios.get('http://localhost:3000/api/user', {
          headers: {
            'Authorization': `Bearer ${token}` // 認証トークンの追加
          }
        });
        this.currentUser = response.data;
      } catch (error) {
        console.error('ユーザー情報の取得に失敗しました:', error);
      }
    },
    async createBord() {
      const token = localStorage.getItem('token'); // トークンの取得
      try {
        await axios.post('http://localhost:3000/bords', this.newBord, {
          headers: {
            'Authorization': `Bearer ${token}` // 認証トークンの追加
          }
        });
        this.newBord = { title: '', content: '' };
        this.fetchBords();
      } catch (error) {
        console.error('投稿の作成に失敗しました:', error);
        alert('投稿の作成に失敗しました。ログイン状態を確認してください。');
      }
    },
    async deleteBord(id) {
      const token = localStorage.getItem('token'); // トークンの取得
      try {
        await axios.delete(`http://localhost:3000/bords/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}` // 認証トークンの追加
          }
        });
        this.fetchBords();
      } catch (error) {
        console.error('投稿の削除に失敗しました:', error);
        alert('投稿の削除に失敗しました。ログイン状態を確認してください。');
      }
    },
    async logout() {
      try {
        await axios.delete('http://localhost:3000/api/logout', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}` // 認証トークンの追加
          }
        });
        localStorage.removeItem('token');
        this.$router.push({ name: 'login' });
      } catch (error) {
        console.error('ログアウトに失敗しました:', error);
        alert('ログアウトに失敗しました。再度お試しください。');
      }
    }
  },
};
</script>

<style scoped>
/* スタイルは現在のコードに合わせて調整してください */
.bord-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.bord-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.bord-input, .bord-textarea {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.bord-button {
  padding: 10px;
  color: #fff;
  background-color: #007bff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.bord-button:hover {
  background-color: #0056b3;
}

.bord-list {
  list-style: none;
  padding: 0;
  margin-top: 20px;
}

.bord-item {
  background-color: #fff;
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 4px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
}

.delete-button {
  margin-top: 10px;
  padding: 5px 10px;
  color: #fff;
  background-color: #dc3545;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.delete-button:hover {
  background-color: #c82333;
}

.logout-button {
  margin-top: 20px;
  padding: 10px 15px;
  color: #fff;
  background-color: #28a745;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.logout-button:hover {
  background-color: #218838;
}
</style>
