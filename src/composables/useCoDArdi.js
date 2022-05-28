import Markov from "https://cdn.jsdelivr.net/npm/js-markov@3.0.3/dist/markov.js"
import whatsapp from "https://cdn.jsdelivr.net/npm/whatsapp-chat-parser@3.2.1/dist/whatsapp-chat-parser.min.js"

export default async function useCoDArdi(waMessages) {
  const markov = new Markov()

  const chat = await whatsapp.parseString(waMessages)
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

  const random = (min, max) => {
    return Math.random() * (max - min) + min
  }

  const shorten = (text, max) => {
    return text.split(/\s+/).slice(0, max).join(" ").trim()
  }

  const generateMessage = () =>
    shorten(markov.generateRandom(250), random(1, 20))

  return {
    generateMessage,
  }
}
