<script setup lang="ts">
import QueryInput from "./components/QueryInput.vue";
import IconDocumentation from "./components/icons/IconDocumentation.vue";
import IconCommunity from "./components/icons/IconCommunity.vue";
import IconTooling from "./components/icons/IconTooling.vue";
import onOfficeLogo from "./onOffice-logo.png";
</script>

<template>
  <nav>
    <img style="height:2.5rem;" :src="onOfficeLogo" alt="onOffice logo" />
    <div>
      <a href="https://apidoc.onoffice.de/" target="_blank" rel="noopener">
        <IconDocumentation />
        Docs
      </a>
      <a href="https://apidoc.onoffice.de/" target="_blank" rel="noopener">
        <IconCommunity/>
        Community
      </a>
      <a href="https://apidoc.onoffice.de/" target="_blank" rel="noopener">
        <IconTooling/>
        Tools
      </a>
    </div>
  </nav>
  <main>
    <h1>onOffice API Client</h1>
    <QueryInput />
  </main>
</template>

<style>
nav {
  display: flex;
  padding: 0 2rem;
  justify-content: space-between;
  border-bottom: 0.1px solid rgba(0, 0, 0, 0.25);
}

a {
  margin-left: 0.5rem;
  text-align: center;
  align-items: center;
  padding: 0 0.5rem;
  text-decoration: none;
}

main {
  width: 90%;
  margin: 0 auto;
}

h1 {
  margin-bottom: 0.5rem;
  color: #030399;
}
</style>
