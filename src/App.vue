<script setup lang="ts">
import QueryInput from "./components/QueryInput.vue";
</script>

<template>
  <main>
    <h1>onOffice API Client</h1>
    <a href="https://apidoc.onoffice.de/" target="_blank" rel="noopener">API Documentation (opens in new tab)</a>
    <QueryInput />
  </main>
</template>

<style>
main {
  max-width: 52rem;
  margin: 0 auto;
}

h1 {
  margin-bottom: 0.5rem;
}
</style>
