<template>
  <div
    class="markdown-viewer"
    v-html="htmlContent"></div>
</template>

<script setup>
  import { ref, onMounted } from 'vue';
  import MarkdownIt from 'markdown-it';

  const md = new MarkdownIt(); // 创建一个 MarkdownIt 实例

  const htmlContent = ref(null);

  onMounted(async () => {
    const response = await fetch('/src/assets/markdown/Introduce.md'); // 替换为你的 Markdown 文件路径
    const text = await response.text();

    htmlContent.value = md.render(text);
  });
</script>

<style>
  @import '/src/assets/style/markdown.css';
</style>
