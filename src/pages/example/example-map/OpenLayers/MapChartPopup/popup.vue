<template>
  <div id="popup">
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

  const chartOptions = ref({
    title: {
      text: 'Referer of a Website',
      subtext: 'Fake Data',
      left: 'center',
    },
    tooltip: {
      trigger: 'item',
    },
    legend: {
      orient: 'vertical',
      left: 'left',
    },
    series: [
      {
        name: 'Access From',
        type: 'pie',
        radius: '50%',
        data: [
          { value: 1048, name: 'Search Engine' },
          { value: 735, name: 'Direct' },
          { value: 580, name: 'Email' },
          { value: 484, name: 'Union Ads' },
          { value: 300, name: 'Video Ads' },
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
    ],
  });

  const { chartShow } = defineProps(['chartShow']);

  watch(
    () => chartShow,
    (newVal) => {
      console.log('newVal', newVal);
      if (newVal) {
        nextTick(() => {
          initChart();
        });
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
    const option = chartOptions.value;
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
</style>
