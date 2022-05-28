import {
  onBeforeUnmount,
  onMounted,
  ref,
} from "https://cdn.jsdelivr.net/npm/vue@3.2.36/dist/vue.esm-browser.js"

export default function useStreamElements(params) {
  const eventHandlers = ref({})

  const registerHandler = (eventName, fn) => {
    eventHandlers.value[eventName] = eventHandlers.value[eventName] ?? []
    eventHandlers.value[eventName].push(fn)

    return () => {
      eventHandlers.value[eventName] = eventHandlers.value[eventName].filter(
        (x) => x !== fn
      )
    }
  }

  const handleEvent = (params) => {
    const eventName = params.detail.listener
    const eventData = params["detail"]["event"]
    const handlers = eventHandlers.value[eventName] ?? []

    handlers.forEach((fn) => {
      fn(eventData)
    })
  }

  const onFollow = (fn) => registerHandler("follower-latest", fn)
  const onSubscribe = (fn) => registerHandler("subscriber-latest", fn)
  const onHost = (fn) => registerHandler("host-latest", fn)
  const onCheer = (fn) => registerHandler("cheer-latest", fn)
  const onTip = (fn) => registerHandler("tip-latest", fn)
  const onRaid = (fn) => registerHandler("raid-latest", fn)
  const onMessage = (fn) => registerHandler("message", fn)
  const onMessageDelete = (fn) => registerHandler("delete-message", fn)
  const onUserMessagesDelete = (fn) => registerHandler("delete-messages", fn)
  const onSkipAlert = (fn) => registerHandler("event:skip", fn)
  const onToggleAlerts = (fn) => registerHandler("alertService:toggleSound", fn)
  const onBotCountUpdate = (fn) => registerHandler("bot:counter", fn)
  const onApikeyUpdate = (fn) => registerHandler("kvstore:update", fn)
  const onWidgetButtonClick = (fn) => registerHandler("widget-button", fn)

  onMounted(() => window.addEventListener("onEventReceived", handleEvent))
  onBeforeUnmount(() =>
    window.removeEventListener("onEventReceived", handleEvent)
  )

  return {
    onFollow,
    onSubscribe,
    onHost,
    onCheer,
    onTip,
    onRaid,
    onMessage,
    onMessageDelete,
    onUserMessagesDelete,
    onSkipAlert,
    onToggleAlerts,
    onBotCountUpdate,
    onApikeyUpdate,
    onWidgetButtonClick,
  }
}
