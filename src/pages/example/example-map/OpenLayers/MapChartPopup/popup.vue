<template>
  <div id="popup">
    <div class="close">
      <el-icon @click="closePopup"><Close /></el-icon>
    </div>
    <div
      ref="chartContainer"
      style="width: 400px; height: 250px"></div>
  </div>
</template>

<script setup>
  import { ref, watch, nextTick, onUnmounted, onMounted } from 'vue';
  import * as echarts from 'echarts';

  const chartContainer = ref(null);
  const chartInstance = ref(null);

  const { chartOptions } = defineProps(['chartOptions']);
  const emit = defineEmits(['closeEvent']);

  const closePopup = () => {
    emit('closeEvent'); // 触发父组件的事件
  };

  watch(
    () => chartOptions,
    (newVal) => {
      if (newVal) {
        nextTick(() => {
          initChart();
        });
        // initChart();
      } else {
        chartInstance.value.dispose();
      }
    }
  );

  const initChart = () => {
    if (chartInstance.value) {
      chartInstance.value.dispose();
    }
    chartInstance.value = echarts.init(chartContainer.value);
    const option = chartOptions;
    chartInstance.value.setOption(option);
  };

  onMounted(() => {
    initChart();
  });

  onUnmounted(() => {
    if (chartInstance.value) {
      chartInstance.value.dispose();
    }
  });
</script>
<style scoped>
  #popup {
    position: absolute;
    background-color: white;
    padding: 10px;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
    border-radius: 10px;
    left: -50%;
    top: 0%;
    transform: translate(-50%, 0%);
  }

  #popup::before {
    content: '';
    position: absolute;
    background-color: white;
    width: 10px;
    height: 10px;
    bottom: -5px;
    left: 50%;
    transform: translateX(-50%) rotate(45deg);
    box-shadow: 5px 5px 6px rgba(0, 0, 0, 0.5);
  }

  .close {
    top: 10px;
    right: 10px;
    cursor: pointer;
    position: absolute;
    z-index: 999;
  }

  .close:hover {
    color: red;
    cursor: pointer;
  }
</style>
