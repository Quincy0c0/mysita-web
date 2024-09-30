import { ref, computed, watch } from 'vue';
import { defineStore } from 'pinia';

export const useHomeStore = defineStore('home', () => {
  const selectedMenu = ref('home');

  return { selectedMenu };
});
