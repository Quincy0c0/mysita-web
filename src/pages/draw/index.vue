<template>
  <div class="container">
    <div style="width: 100%; height: 100%">
      <div id="drawBoard"></div>
    </div>
  </div>
</template>

<script setup>
  import { Graph, Shape } from '@antv/x6';
  import { onMounted } from 'vue';

  onMounted(() => {
    const graph = new Graph({
      container: document.getElementById('drawBoard'),
      grid: true,
      autoResize: true,
    });

    Shape.HTML.register({
      shape: 'custom-html',
      width: 160,
      height: 80,
      html() {
        const div = document.createElement('div');
        div.className = 'custom-html';
        div.innerHTML = /*html*/ `<input></input>`;

        return div;
      },
    });

    graph.addNode({
      shape: 'custom-html',
      x: 60,
      y: 100,
    });
  });
</script>
<style scoped>
  .container {
    width: 95vw;
    height: 90vh;
    border: 1px solid #ccc;
    margin-top: 10px;
  }
</style>

<style>
  .custom-html {
    width: 150px;
    height: 50px;
    background-color: #f5f5f5;
    border: 1px solid #ccc;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
