import { defineStore, createPinia } from 'pinia'
import { ref } from 'vue'
import type { Ref } from 'vue'

const useCounterStore = defineStore('test', () => {
    const content = ref()

    return {
        content
    }
})

export { useCounterStore }