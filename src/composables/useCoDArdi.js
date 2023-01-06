import { ref } from "https://cdn.jsdelivr.net/npm/vue@3.2.36/dist/vue.esm-browser.js"

export default function useCoDArdi(msgSource) {
  const ready = ref(false)
  const markov = new Markov()

  const init = async () => {
    const messages = await fetch(msgSource).then((r) => r.text())
    const chat = await whatsappChatParser.parseString(messages)
    const states = chat
      .filter((x) => x.author !== "System")
      .map((x) =>
        x.message
          .replace("<Media omessi>", "")
          .replace(/@[0-9]+/g, "")
          .trim()
      )
      .filter((x) => !!x)

    markov.addStates(states)
    markov.train(10)
    ready.value = true
  }

  const random = (min, max) => {
    return Math.random() * (max - min) + min
  }

  const shorten = (text, max) => {
    return text.split(/\s+/).slice(0, max).join(" ").trim()
  }

  const speak = async () => {
    if (!ready.value) {
      await init()
    }

    return shorten(markov.generateRandom(250), random(1, 20))
  }

  return {
    speak,
  }
}
