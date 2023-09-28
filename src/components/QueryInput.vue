<script setup lang="ts">
import { callApi } from "@/api-client";
import type { ApiResponse } from "@/api-client";
import { History } from "@/history";
import { ref, reactive, computed } from "vue";
import { Codemirror } from "vue-codemirror";
import { json } from "@codemirror/lang-json";
import { getCredentials } from "@/session-storage";
import TokenModal from "@/components/TokenModal.vue";
import Divider from "@/components/Divider.vue";

import createEstate from "@/assets/examples/create-estate.json";
import readEstates from "@/assets/examples/read-estates.json";
import readUser from "@/assets/examples/read-user.json";
import readUserPhoto from "@/assets/examples/read-user-photo.json";
import editEstate from "@/assets/examples/edit-estate.json";
import readAddresses from "@/assets/examples/read-addresses.json";
import createAddress from "@/assets/examples/create-address.json";
import editAddress from "@/assets/examples/edit-address.json";
import createSearchCriteria from "@/assets/examples/create-search-criteria.json";

const extensions = [json()];

const history = reactive(new History());

const examples = new Map<string, string>();
examples.set("Create Address", JSON.stringify(createAddress, undefined, 2));
examples.set("Read Addresses", JSON.stringify(readAddresses, undefined, 2));
examples.set("Edit Address", JSON.stringify(editAddress, undefined, 2));
examples.set("Create Estate", JSON.stringify(createEstate, undefined, 2));
examples.set("Read Estates", JSON.stringify(readEstates, undefined, 2));
examples.set("Edit Estate", JSON.stringify(editEstate, undefined, 2));
examples.set(
  "Create Search Criteria",
  JSON.stringify(createSearchCriteria, undefined, 2)
);
examples.set("Read User", JSON.stringify(readUser, undefined, 2));
examples.set("Read User Photo", JSON.stringify(readUserPhoto, undefined, 2));
examples.set("Custom", JSON.stringify({}, undefined, 2));

const currentExample = ref("Create Address");
const query = ref(examples.get(currentExample.value) as string);
const sending = ref(false);
const error = ref<string | null>(null);
const submitMsg = computed(() => {
  if (!sending.value) {
    return `Send #${history.size() + 1}`;
  } else {
    return `Sending #${history.size() + 1}…`;
  }
});

const response = ref<ApiResponse | null>(null);
const deltaTime = ref(0);
const showTokenModal = ref(false);

const codemirrorStyle = {
  width: "100%",
  "max-width": "100%",
  "margin-top": "0.5rem",
  "margin-bottom": "0.5rem",
  border: "1px solid black",
  "background-color": "white",
};

async function sendQuery() {
  try {
    error.value = null;
    sending.value = true;
    const { savedToken, savedSecret } = getCredentials();
    if (!savedToken || !savedSecret) {
      showTokenModal.value = true;
      return;
    }
    const t = Date.now();
    response.value = await callApi(savedToken, savedSecret, query.value);
    deltaTime.value = Math.round(Date.now() - t);

    history.addNewEntry({
      query: query.value,
      response: JSON.stringify(response.value, undefined, 2),
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    error.value = `An error occurred while sending the query:\n${e.message}`;
  } finally {
    sending.value = false;
  }
}

function queryModified(newQuery: string) {
  query.value = newQuery;
}

function exampleChanged() {
  query.value = examples.get(currentExample.value) as string;
}
</script>

<template>
  <div class="container">
    <div class="grid">
      <form @submit.prevent="sendQuery">
        <TokenModal @close="showTokenModal = false" :show="showTokenModal" />
        <span>Pick an example or enter your own query.</span>
        <select
          v-model="currentExample"
          @change="exampleChanged"
          style="
            width: fit-content;
            border: 0.5px solid black;
            border-radius: 0.5rem;
          "
        >
          <option
            v-for="[key, _] in examples"
            :value="key"
            :selected="currentExample === key"
            :key="key"
          >
            {{ key }}
          </option>
        </select>
        <codemirror
          :style="codemirrorStyle"
          :extensions="extensions"
          :modelValue="query"
          @update:modelValue="queryModified"
        />
        <input type="hidden" :value="query" name="query" />
        <input
          class="primary-button"
          type="submit"
          :value="submitMsg"
          :disabled="sending"
        />
      </form>

      <div class="grid-item">
        <div class="flex w-full justify-between">
          <h2 class="font-bold">Response #{{ history.getCurrentNumber() }}</h2>
          <div class="history">
            <button :disabled="!history.canGoBack()" @click="history.goBack">
              &laquo;
            </button>
            <span>{{ history.getCurrentNumber() }}</span>
            <button
              :disabled="!history.canGoForward()"
              @click="history.goForward"
            >
              &raquo;
            </button>
          </div>
        </div>
        <div class="flex gap-4">
          <span>Response time: {{ deltaTime }} ms</span>
          <template v-if="response?.status">
            <span class="flex items-center gap-1">
              <pre
                v-if="response?.status.code < 400"
                class="h-2 w-2 bg-green-500 rounded-full"
              ></pre>
              <pre v-else class="h-2 w-2 bg-red-500 rounded-full"></pre>
              Http: {{ response?.status.code }}
            </span>
            <span v-if="response?.status.errorcode > 0"
              >ErrorCode: {{ response?.status.errorcode }}</span
            >
          </template>
        </div>
        <div class="error" v-if="error">
          <p
            v-for="paragraph in error?.split('\n')"
            :key="paragraph.slice(0, 3)"
          >
            {{ paragraph }}
          </p>
        </div>
        <Divider />
        <details>
          <summary>See query #{{ history.getCurrentNumber() }}</summary>
          <codemirror
            :style="codemirrorStyle"
            :extensions="extensions"
            :modelValue="history.getCurrentEntry()?.query"
            disabled
            readonly
          />
        </details>
        <codemirror
          v-if="!sending"
          :style="codemirrorStyle"
          :extensions="extensions"
          :modelValue="history.getCurrentEntry()?.response"
          disabled
          readonly
        />
        <div v-else class="animate-pulse flex">
          <div class="flex-1 py-1">
            <div class="h-2 bg-[#036f99] rounded"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

@media screen and (min-width: 1000px) {
  .grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 5%;
  }
}

.container {
  display: flex;
  flex-direction: column;
  padding-bottom: 2rem;
}

.grid-item,
form {
  display: flex;
  flex-direction: column;
  padding: 0.5rem 1rem;
  width: 100%;
  background-color: #fefefe;
  border: 0.5px solid grey;
  border-radius: 0.5rem;
  box-shadow: 0 0.2rem 1.5rem -0.3rem rgba(0, 0, 0, 0.07),
    0 1rem 2rem -0.2rem rgba(0, 0, 0, 0.04);
}

.error {
  border: 0.1rem solid red;
  background-color: rgba(255, 10, 10, 0.25);
  padding: 0 1rem;
  margin: 1rem 0;
  border-radius: 0.5rem;
}

.history {
  align-self: center;
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
}

details {
  width: 100%;
  margin: 0.5rem 0;
}

button {
  border: 0.5px solid black;
  border-radius: 0.5rem;
  padding: 0 0.5rem;
  background-color: rgb(225, 225, 225);
}

button:disabled {
  color: rgb(150, 150, 150);
  background-color: rgb(200, 200, 200);
}
</style>
