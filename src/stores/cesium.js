import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useCesiumStore = defineStore('cesium', () => {
  const buildModel = ref(null);

  return { buildModel };
});
