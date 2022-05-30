import {
  onBeforeUnmount,
  onMounted,
} from "https://cdn.jsdelivr.net/npm/vue@3.2.36/dist/vue.esm-browser.js"
import "../libs/tmi.min.js"

const TMIClient = window.tmi.Client

export default function useTmi(channel, username, token) {
  const client = new TMIClient({
    // options: { debug: true },
    identity:
      username && token
        ? {
            username,
            password: token,
          }
        : undefined,
    channels: [channel],
  })

  onMounted(() => client.connect())
  onBeforeUnmount(() => client.disconnect())

  return { client }
}
