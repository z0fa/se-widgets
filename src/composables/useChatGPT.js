export default function useChatGPT(gptToken, tuToken) {
  const speak = async (message, maxTokens = 50) => {
    const response = await fetch("https://api.openai.com/v1/completions", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${gptToken}`,
      },
      body: JSON.stringify({
        model: "text-davinci-003",
        prompt: message,
        max_tokens: maxTokens,
        temperature: 1.0,
      }),
    }).then((r) => r.json())

    return response?.choices?.[0]?.text ?? ""
  }

  const draw = async (message) => {
    const longUrl = await fetch(
      "https://api.openai.com/v1/images/generations",
      {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${gptToken}`,
        },
        body: JSON.stringify({
          prompt: message,
          n: 1,
          size: "512x512",
        }),
      }
    )
      .then((r) => r.json())
      .then((r) => r.data[0].url)

    const url = await fetch("https://api.tinyurl.com/create", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tuToken}`,
      },
      body: JSON.stringify({
        url: longUrl,
      }),
    })
      .then((r) => r.json())
      .then((r) => r.data.tiny_url)

    return url
  }

  return {
    speak,
    draw,
  }
}
