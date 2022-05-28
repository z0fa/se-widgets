import {
  ref,
  computed,
} from "https://cdn.jsdelivr.net/npm/vue@3.2.36/dist/vue.esm-browser.js"

export default function useArrayInOut() {
  const previousItems = ref([])
  const currentItems = ref([])
  const firstRun = ref(true)

  const addedItems = computed(() =>
    currentItems.value.filter((item) => !previousItems.value.includes(item))
  )
  const removedItems = computed(() =>
    previousItems.value.filter((item) => !currentItems.value.includes(item))
  )

  const updateItems = (items) => {
    if (firstRun.value) {
      previousItems.value = items
      currentItems.value = items
      firstRun.value = false
    } else {
      previousItems.value = currentItems.value
      currentItems.value = items
    }
  }

  return {
    updateItems,
    addedItems,
    removedItems,
  }
}
