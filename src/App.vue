<script setup lang="ts">
import { ref } from "vue";
import QueryInput from "@/components/QueryInput.vue";
import NavBar from "./components/NavBar.vue";

const userAvatarUrl = ref(
  //"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
  "https://ui-avatars.com/api/?name=User+Name&background=036F99&color=fff"
);
</script>

<template>
  <NavBar :user-avatar-url="userAvatarUrl" />
  <main>
    <h1><span class="italic">onOffice</span> API Explorer</h1>
    <QueryInput />
  </main>
</template>

<style>
main {
  width: 90%;
  margin: 0 auto;
}

h1 {
  font-size: 1.7rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: transparent;
  letter-spacing: -0.05rem;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-image: linear-gradient(
    to right,
    #036f99,
    #02a8e8,
    #01c6ff,
    #01e0ff,
    #01f2ff
  );

}

.primary-button {
  width: fit-content;
  background-color: #036f99;
  color: white;
  border: none;
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  cursor: pointer;
}
</style>
