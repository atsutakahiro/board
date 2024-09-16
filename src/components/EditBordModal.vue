<template>
  <div v-if="visible" class="modal">
    <div class="modal-content">
      <span class="close" @click="close">&times;</span>
      <h2>編集</h2>
      <form @submit.prevent="updateBord">
        <input v-model="editableBord.title" placeholder="タイトル" class="bord-input" />
        <textarea v-model="editableBord.content" placeholder="内容" class="bord-textarea"></textarea>
        <button type="submit" class="bord-button">更新</button>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios'; // axiosをインポート

export default {
  props: {
    bord: Object, // 編集対象のボード
    visible: Boolean // モーダルの表示・非表示フラグ
  },
  data() {
    return {
      editableBord: { ...this.bord } // propsのコピーを作成
    };
  },
  watch: {
    bord: {
      handler(newVal) {
        this.editableBord = { ...newVal }; // bordが変更されたらコピーを更新
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    close() {
      this.$emit('close'); // 親コンポーネントにモーダルを閉じるイベントを送信
    },
    async updateBord() {
      try {
        const token = localStorage.getItem('token');
        await axios.patch(`http://localhost:3000/bords/${this.editableBord.id}`, this.editableBord, {
          headers: {
            'Authorization': `Bearer ${token}` // 認証トークンをヘッダーに追加
          }
        });
        this.$emit('update-success'); // 更新が成功したら親コンポーネントにイベントを送信
        this.close(); // モーダルを閉じる
      } catch (error) {
        console.error('更新に失敗しました:', error);
        alert('更新に失敗しました。再度お試しください。');
      }
    }
  }
};
</script>

<style scoped>
.modal {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-content {
  background-color: #fefefe;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  max-width: 500px;
  width: 100%;
}

.close {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 18px;
  cursor: pointer;
}

.bord-input,
.bord-textarea {
  width: 100%;
  margin-bottom: 10px;
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
</style>
