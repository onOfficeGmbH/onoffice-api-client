<script setup lang="ts">
import { callApi } from '@/api-client';
import { History } from '@/history';
import { ref, reactive, computed } from 'vue';

const token = ref("")
const secret = ref("")

const history = reactive(new History());
const previousLabel = computed(() => {
    if (history.canGoBack()) {
        return `Previous (#${history.getCurrentNumber() - 1})`;
    } else {
        return "Previous";
    }
})
const nextLabel = computed(() => {
    if (history.canGoForward()) {
        return `Next (#${history.getCurrentNumber() + 1})`;
    } else {
        return "Next"
    }
})
function previousInHistoryClicked() {
    history.goBack()
    const historyEntry = history.getCurrentEntry()
    if (historyEntry !== null) {
        query.value = historyEntry.query
        response.value = historyEntry.response
    }
}
function nextInHistoryClicked() {
    history.goForward()
    const historyEntry = history.getCurrentEntry()
    if (historyEntry !== null) {
        query.value = historyEntry.query
        response.value = historyEntry.response
    }
}

const defaultQuery = `\
{
    "actionid": "urn:onoffice-de-ns:smart:2.5:smartml:action:read",
    "resourceid": "",
    "identifier": "",
    "resourcetype": "estate",
    "parameters": {
        "data":["Id", "lage", "kaufpreis"],
        "filter": {
            "status": [{"op": "=", "val": 1}],
            "kaufpreis": [{"op": "<", "val": 300000}]
        },
        "listlimit": 100,
        "listoffset": 0,
        "sortby": {"kaufpreis": "ASC", "warmmiete": "ASC"}
    }
}`
const query = ref(defaultQuery)

const response = ref("")

async function sendQuery() {
    response.value = await callApi(
        token.value,
        secret.value,
        query.value
    ).then(response => JSON.stringify(response, undefined, 2))

    history.addNewEntry({
        query: query.value,
        response: response.value
    })
}
</script>

<template>
    <div class="input">
        <h2>Query #{{history.getCurrentNumber()}}</h2>
        <form @submit.prevent="sendQuery">
            <div class="credentials">
                <label>
                    Token
                    <input type="text" v-model="token" name="username" autocomplete="username" />
                </label>
                <label>
                    Secret
                    <input type="password" v-model="secret" name="password" autocomplete="password" />
                </label>
            </div>
            <textarea rows="20" v-model="query" name="query"></textarea>
            <input type="submit" :value="`Send (#${history.size() + 1})`">
        </form>
        <div class="history">
            <button :disabled="!history.canGoBack()" @click="previousInHistoryClicked">{{ previousLabel }}</button>
            <button :disabled="!history.canGoForward()" @click="nextInHistoryClicked">{{ nextLabel }}</button>
        </div>
        <h2>Response #{{history.getCurrentNumber()}}</h2>
        <code>
            <pre>{{ response }}</pre>
        </code>
    </div>
</template>

<style scoped>
.input {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}

form {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
}

.credentials {
    display: flex;
    flex-direction: row;
    gap: 1rem;
    margin-bottom: 1rem;
}

label {
    display: flex;
    flex-direction: column;
}

textarea {
    width: 100%;
}

.history {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin: 1rem 0;
    gap: 0.5rem;
}

code {
    width: 100%;
}
</style>