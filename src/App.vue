<script setup lang="ts">
import { ref } from "vue";
import QueryInput from "@/components/QueryInput.vue";
import NavBar from "./components/NavBar.vue";

const userAvatarUrl = ref(
  //"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
  "https://ui-avatars.com/api/?name=User+Name&background=0D5AAA&color=fff"
);
</script>

<template>
  <NavBar :user-avatar-url="userAvatarUrl" />
  <main>
    <h1>onOffice API Client</h1>
    <QueryInput />
  </main>
</template>

<style>
main {
  width: 90%;
  margin: 0 auto;
}

h1 {
  margin-bottom: 0.5rem;
  color: #030399;
}
</style>
