<script setup lang="ts">
import { callApi } from '@/api-client';
import { History } from '@/history';
import { ref, reactive, computed, watch } from 'vue';
import { Codemirror } from "vue-codemirror";
import { json } from "@codemirror/lang-json";

const token = ref("")
const secret = ref("")

const extensions = [json()];

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

const examples = reactive(new Map())
examples.set("Read Estates", `\
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
}`)
examples.set("Create Estate", `\
{ 
    "actionid":"urn:onoffice-de-ns:smart:2.5:smartml:action:create",
    "resourceid":"",
    "identifier":"",
    "resourcetype":"estate",
    "parameters":{ 
        "data":{ 
            "objektart":"haus",
            "nutzungsart":"wohnen",
            "vermarktungsart":"kauf",
            "objekttyp":"einfamilienhaus",
            "plz":52068,
            "ort":"Aachen",
            "land":"DEU",
            "regionaler_zusatz":["openGeoDb_Region_122117"],
            "nebenkosten":100,
            "heizkosten":80,
            "mietpreis_pro_qm":12,
            "wohnflaeche":75,
            "anzahl_zimmer":3,
            "anzahl_schlafzimmer":1,
            "anzahl_badezimmer":1,
            "breitengrad":"50.7762106",
            "laengengrad":"6.0857545",
            "heizungsart":["zentral","fussboden"],
            "stellplatzart":["freiplatz","carport"],
            "kaufpreis":200000
        }
    }
}
`)

const currentExample = ref<string | null>("Read Estates")
const currentExampleLabel = computed(() => {
    if (currentExample.value === null) {
        return "Custom"
    } else {
        return currentExample.value
    }
})
const query = ref(examples.get(currentExample.value))
const sending = ref(false)
const submitMsg = computed(() => {
    if (!sending.value) {
        return `Send #${history.size() + 1}`
    } else {
        return `Sending #${history.size() + 1}…`
    }
})

const response = ref("")
const responseElement = ref<HTMLInputElement | null>(null)

async function resizeResponseTextarea(newResponse: string) {
    const element = responseElement.value!!
    element.innerHTML = newResponse
    element.style.height = "auto"
    element.style.height = element.scrollHeight + "px"
}

watch(response, resizeResponseTextarea)

async function sendQuery() {
    try {
        sending.value = true
        response.value = await callApi(
            token.value,
            secret.value,
            query.value
        ).then(response => JSON.stringify(response, undefined, 2))
    } finally {
        sending.value = false
    }

    history.addNewEntry({
        query: query.value,
        response: response.value
    })
}

function queryModified(newQuery: string) {
    query.value = newQuery
    currentExample.value = null
}

function exampleChanged() {
    if (currentExample.value !== null) {
        query.value = examples.get(currentExample.value)
    }
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
            <select v-model="currentExample" @change="exampleChanged">
                <option v-if="currentExample === null" selected :value="null">Custom</option>
                <option v-for="[key, _] in examples" :value="key" :selected="currentExample === key">{{ key }}</option>
            </select>
            <codemirror :extensions="extensions" :modelValue="query" @update:modelValue="queryModified" />
            <input type="hidden" :value="query" name="query" />
            <input type="submit" :value="submitMsg" :disabled="sending">
        </form>
        <div class="history">
            <button :disabled="!history.canGoBack()" @click="previousInHistoryClicked">{{ previousLabel }}</button>
            <button :disabled="!history.canGoForward()" @click="nextInHistoryClicked">{{ nextLabel }}</button>
        </div>
        <h2>Response #{{history.getCurrentNumber()}}</h2>
        <textarea ref="responseElement" class="result" readonly>{{response}}</textarea>
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

.cm-editor {
    width: 100%;
}

.history {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin: 1rem 0;
    gap: 0.5rem;
}

textarea.result {
    width: 100%;
    resize: none;
}
</style>