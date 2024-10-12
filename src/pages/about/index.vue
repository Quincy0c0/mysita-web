<template>
  <div
    class="markdown-viewer"
    v-html="htmlContent"></div>
</template>

<script>
  import { ref, onMounted } from 'vue';
  import MarkdownIt from 'markdown-it';
  import hljs from 'highlight.js';

  const response = await fetch('/src/assets/markdown/Introduce.md'); // 替换为你的 Markdown 文件路径
  const text = await response.text();

  const md = new MarkdownIt(); // 创建一个 MarkdownIt 实例

  const htmlContent = ref(md.render(text));

  export default {
    name: 'MarkdownViewer',
    setup() {
      return { htmlContent };
    },
  };
</script>

<style>
  @import '/src/assets/style/markdown.css';
</style>
