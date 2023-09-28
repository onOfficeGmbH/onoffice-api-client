<script setup lang="ts">
import { ref, watch } from "vue";
import { updateSessionStorage, getCredentials } from "@/session-storage";
import Modal from "@/components/Modal.vue";

defineEmits(["close"]);

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
    <div class="credentials">
      <p>Enter your credentials.</p>
      <div class="inputs">
        <label>
          Token
          <input
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
            type="password"
            required
            v-model="secret"
            name="password"
            autocomplete="password"
          />
        </label>
      </div>
      <button @click="$emit('close')">Save</button>
    </div>
  </Modal>
</template>
