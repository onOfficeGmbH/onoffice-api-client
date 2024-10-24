<script setup lang="ts">
import { ref, watch } from "vue";
import { updateSessionStorage, getCredentials } from "@/session-storage";
import Modal from "@/components/Modal.vue";

defineEmits(["close", "server-change", "version-change"]);

defineProps({
  show: {
    type: Boolean,
    default: false,
  },
});
const { savedToken, savedSecret } = getCredentials();
const token = ref(savedToken);
const secret = ref(savedSecret);

const remember = ref(true);
watch([token, secret], ([newToken, newSecret]) => {
  if (remember.value) {
    updateSessionStorage(newToken, newSecret);
  }
});
</script>

<template>
  <Modal :show="show" @close="$emit('close')">
    <div class="flex flex-col py-2 px-4">
      <h2 class="text-lg mb-1">Authentication</h2>
      <p>
        Enter your
        <a
          href="https://apidoc.onoffice.de/access-token-generieren/"
          class="underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          &nbsp;credentials.
        </a>
      </p>
      <div class="flex gap-4 mb-2">
        <label>
          Token
          <input
            class="border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-600"
            type="text"
            required
            v-model="token"
            name="username"
            autocomplete="username"
          />
        </label>
        <label>
          Secret
          <input
            class="border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-600"
            type="password"
            required
            v-model="secret"
            name="password"
            autocomplete="password"
          />
        </label>
      </div>
      <details class="mb-2">
        <summary>Developer</summary>
        <label
          >Server
          <input
            class="w-3/4 border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-600"
            type="text"
            id="server"
            name="server"
            value="https://api.onoffice.de/api/"
            @change="$emit('server-change', ($event.target as HTMLInputElement).value)"
          />
        </label>
        <label
          >Version
          <select
            @change="$emit('version-change', ($event.target as HTMLSelectElement).value)"
            class="w-fit border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="stable">stable</option>
            <option value="latest">latest</option>
          </select>
        </label>
      </details>
      <button class="primary-button" @click="$emit('close')">Save</button>
    </div>
  </Modal>
</template>

<style scoped>
.credentials .remember {
  flex-direction: row;
}

label {
  display: flex;
  flex-direction: column;
}
</style>
