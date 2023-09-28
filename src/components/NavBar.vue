<script setup lang="ts">
import { ref } from "vue";
import onOfficeLogo from "@/assets/onOffice-logo.png";
import IconDocumentation from "@/components/icons/IconDocumentation.vue";
import IconCommunity from "@/components/icons/IconCommunity.vue";
import IconTooling from "@/components/icons/IconTooling.vue";
import TokenModal from "@/components/TokenModal.vue";

defineProps({
  userAvatarUrl: {
    type: String,
    default: "",
  },
});

const showTokenModal = ref(false);
</script>

<template>
  <nav>
    <a href="https://www.onoffice.de/">
      <img style="height: 2.5rem" :src="onOfficeLogo" alt="onOffice logo" />
    </a>
    <div class="nav-links">
      <a href="https://apidoc.onoffice.de/" target="_blank" rel="noopener">
        <IconDocumentation />
        Docs
      </a>
      <a href="https://apidoc.onoffice.de/" target="_blank" rel="noopener">
        <IconCommunity />
        Community
      </a>
      <a href="https://github.com/onOfficeGmbH/" target="_blank" rel="noopener">
        <IconTooling />
        Tools
      </a>
      <img
        @click="showTokenModal = true"
        class="avatar"
        :src="userAvatarUrl"
        alt=""
      />
    </div>
    <TokenModal
      @close="showTokenModal = false"
      :show="showTokenModal"
    ></TokenModal>
  </nav>
</template>

<style scoped>
nav {
  display: flex;
  padding: 0 2rem;
  justify-content: space-between;
  border-bottom: 0.1px solid rgba(0, 0, 0, 0.25);
}

a {
  display: inline-flex;
  text-align: center;
  align-items: center;
  padding: 0 0.5rem;
  text-decoration: none;
  gap: 0.25rem;
}
.nav-links {
  display: flex;
  flex-wrap: nowrap;
  gap: 1rem;
  align-items: center;
}

.avatar {
  cursor: pointer;
  height: 2rem;
  width: 2rem;
  border-radius: 9999px;
}
</style>
